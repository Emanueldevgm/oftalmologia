// src/components/AgentChat/useAgentChat.ts
import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export function useAgentChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gera ou recupera sessionId do localStorage
  const getSessionId = useCallback(() => {
    let sessionId = localStorage.getItem('agentSessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + '-' + Math.random();
      localStorage.setItem('agentSessionId', sessionId);
    }
    return sessionId;
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Adiciona mensagem do usuário
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const sessionId = getSessionId();
        const payload = {
          message: content.trim(),
          sessionId,
        };

        const response = await fetch('/api/agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Erro ao comunicar com o agente');
        }

        // Trata tanto JSON quanto streaming
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/event-stream')) {
          // Processa streaming
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let agentResponse = '';

          // Adiciona mensagem vazia do agente
          const agentMessageId = (Date.now() + 1).toString();
          setMessages((prev) => [
            ...prev,
            {
              id: agentMessageId,
              role: 'agent',
              content: '',
              timestamp: new Date(),
            },
          ]);

          while (true) {
            const { done, value } = await reader?.read() || { done: true };
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    agentResponse += parsed.content;
                    // Atualiza a última mensagem do agente
                    setMessages((prev) => {
                      const last = prev[prev.length - 1];
                      if (last && last.role === 'agent') {
                        return [
                          ...prev.slice(0, -1),
                          { ...last, content: agentResponse },
                        ];
                      }
                      return prev;
                    });
                  }
                } catch (e) {
                  // ignora
                }
              }
            }
          }
        } else {
          // JSON simples
          const data = await response.json();
          const agentMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            content: data.reply || data.message || 'Desculpe, não entendi.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, agentMessage]);
        }
      } catch (err: any) {
        setError(err.message);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: 'Ops! Não consegui me conectar ao assistente. Tente novamente mais tarde.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [getSessionId]
  );

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isOpen,
    isLoading,
    error,
    sendMessage,
    toggleChat,
    clearMessages,
  };
}