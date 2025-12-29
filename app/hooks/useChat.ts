// src/hooks/useChat.ts
import { useEffect, useState } from "react";
import { chatApi } from "@/services/chat.api";

export function useChat() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  // mở chat → start
  useEffect(() => {
    if (open && !conversationId) {
      chatApi.start().then(res => {
        setConversationId(res.conversation_id);
      });
    }
  }, [open]);

  // polling
  useEffect(() => {
    if (!conversationId) return;

    const i = setInterval(() => {
      chatApi.messages(conversationId).then(setMessages);
    }, 3000);

    return () => clearInterval(i);
  }, [conversationId]);

  const send = async () => {
    if (!text.trim() || !conversationId) return;
    await chatApi.send(conversationId, text);
    setText("");
  };

  return {
    open,
    setOpen,
    messages,
    text,
    setText,
    send
  };
}
