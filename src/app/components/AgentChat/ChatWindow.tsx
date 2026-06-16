// src/components/AgentChat/ChatWindow.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { useAgentChat } from './useAgentChat';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Loader2, X, Send, Minimize2, Maximize2 } from 'lucide-react';

interface ChatWindowProps {
  onClose: () => void;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const { messages, isLoading, sendMessage, error } = useAgentChat();
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isMinimized]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-12 w-12 rounded-full shadow-lg"
          size="sm"
        >
          <Maximize2 className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 flex h-[600px] w-[420px] flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 p-4 text-white">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-400" />
          <span className="font-semibold text-base">Assistente oftalmológico</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/10"
            size="sm"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/10"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages - fundo escuro */}
      <div className="flex-1 overflow-y-auto bg-gray-900 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-300">
            <p className="text-lg font-semibold">👋 Olá!</p>
            <p className="text-sm">Como posso ajudar você hoje?</p>
            <p className="mt-2 text-xs text-gray-400">
              Posso agendar, cancelar, consultar horários e muito mais.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="mt-2 flex items-center gap-2 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Digitando...</span>
              </div>
            )}
            {error && (
              <div className="mt-2 rounded bg-red-900/50 p-2 text-sm text-red-200 border border-red-700">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input - fundo escuro */}
      <div className="border-t border-gray-700 bg-gray-800 p-3">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1 bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}