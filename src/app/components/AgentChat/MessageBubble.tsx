// src/components/AgentChat/MessageBubble.tsx
import { Message } from './useAgentChat';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm shadow-md ${
          isUser
            ? 'bg-blue-600 text-white' // usuário: azul com texto branco
            : 'bg-gray-700 text-white border border-gray-600' // agente: fundo escuro, texto branco
        }`}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed text-white">
          {message.content}
        </p>
        <span className="mt-1.5 block text-[10px] text-white/70 text-right">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}