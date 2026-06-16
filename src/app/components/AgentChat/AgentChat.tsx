'use client';

import { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import { Button } from '../ui/Button';
import { MessageCircle } from 'lucide-react';

export function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          {isOpen ? (
            <span className="text-2xl">✕</span>
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </div>

      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}