import { useChat } from '@/hooks/useChat';
import { useEffect, useRef } from 'react';
import { ChatLoading } from './ChatLoading';

export default function ChatBubble() {
  const { open, setOpen, messages, text, setText, send, loadingHistory, adminTyping } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <>
      <div onClick={() => setOpen((o) => !o)} className="chat-bubble">
        💬
      </div>

      {open && (
        <div className="chat-window">
          <div className="chat-messages">
            {loadingHistory ? (
              <ChatLoading />
            ) : (
              <>
                {messages.map((m, i) => (
                  <div key={i} className={`chat-msg ${m.sender}`}>
                    <b>{m.sender}:</b> {m.content}
                  </div>
                ))}
                <div ref={messagesEndRef} />
                {adminTyping && (
                  <div className="chat-msg bot">
                    <i>Admin đang trả lời...</i>
                  </div>
                )}
              </>
            )}
          </div>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Nhập tin nhắn..."
          />
        </div>
      )}
    </>
  );
}
