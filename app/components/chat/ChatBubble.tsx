// src/components/chat/ChatBubble.tsx
import { useChat } from "@/hooks/useChat";

export default function ChatBubble() {
  const {
    open,
    setOpen,
    messages,
    text,
    setText,
    send
  } = useChat();

  return (
    <>
      <div
        onClick={() => setOpen(o => !o)}
        className="chat-bubble"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#007bff",
          color: "#fff",
          borderRadius: "50%",
          width: 60,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }}
      >
        💬
      </div>

      {open && (
        <div className="chat-window" style={{
          position: "fixed",
          bottom: 90,
          right: 20,
          width: 300,
          background: "#fff",
          border: "1px solid #ccc",
          padding: 10
        }}>
          <div className="chat-messages" style={{ height: "200px", overflowY: "auto" }}>
            {messages.map((m, i) => (
              <div key={i}>
                <b>{m.sender}:</b> {m.content}
              </div>
            ))}
          </div>

          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Nhập tin nhắn..."
          />
        </div>
      )}
    </>
  );
}
