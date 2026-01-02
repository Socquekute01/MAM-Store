import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatLoading } from './ChatLoading';
import ChatTyping from './ChatTyping';
import ChatMessaage from './ChatMessage';

export default function ChatBubble() {
  const { open, setOpen, messages, text, setText, send, loadingHistory, adminTyping } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, adminTyping]);

  return (
    <>
      {/* Bubble button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-foreground/60 text-white shadow-lg transition hover:scale-105"
      >
        💬
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-5 w-80 overflow-hidden rounded-chat border border-chat-border bg-white shadow-xl transition-all duration-300
        ${open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'}`}
      >
        {/* Header */}
        <div className="border-b border-chat-border bg-chat-bg px-3 py-2 font-semibold">MAM Support</div>

        {/* Messages */}
        <div className="h-64 space-y-2 overflow-y-auto p-3 text-sm">
          {loadingHistory ? (
            <ChatLoading />
          ) : (
            <>
              {messages.map((m, i) => (
                <ChatMessaage key={i} content={m.content} sender={m.sender} />
              ))}

              {adminTyping && <ChatTyping />}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-chat-border p-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Nhập tin nhắn..."
            className="w-full rounded-chat border border-chat-border px-3 py-2 text-sm outline-none focus:border-chat-primary text-black"
          />
        </div>
      </div>
    </>
  );
}
