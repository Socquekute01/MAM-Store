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
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes shake-periodic {
          0%, 10%, 100% { transform: translateX(0); }
          1%, 3%, 5%, 7%, 9% { transform: translateX(-2px); }
          2%, 4%, 6%, 8% { transform: translateX(2px); }
        }
        
        .shake-periodic {
          animation: shake-periodic 2s ease-in-out infinite;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .tooltip-slide {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {/* Bubble button with tooltip */}
      <div className="fixed bottom-5 right-5">
        {!open && (
          <div className="tooltip-slide absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm  shadow-lg">
            Bạn có tin nhắn mới
            <div className="absolute -right-1.5 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[6px] border-l-[6px] border-y-transparent border-l-white"></div>
          </div>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          className="shake-periodic flex h-12 w-12 items-center justify-center rounded-full bg-background text-white shadow-lg transition hover:scale-105"
        >
          <img
            src="https://files-cdn.chatway.app/U2Dm64ntDJwYb41agz8eQSEnQCngGjC7DRWaasnn391FQXKB.jpg"
            className="rounded-full"
            alt="MAM logo"
          />
        </button>
      </div>

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
