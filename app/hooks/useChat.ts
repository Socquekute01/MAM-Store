// src/hooks/useChat.ts
import { useEffect, useRef, useState } from 'react';
import { userAPI } from '@/services/user.api';

const BOT_WELCOME = {
  sender: 'bot',
  content: 'Chào bạn, MAM có thể giúp gì cho bạn?',
};

const BOT_WAITING = {
  sender: 'bot',
  content: 'MAM sẽ nhanh chóng phản hồi câu hỏi của bạn, bạn chờ trong giây lát nhé!',
};

export function useChat() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const hasSentFirst = useRef(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);

  // useChat.ts
  useEffect(() => {
    if (!open) return;

    setMessages((prev) => {
      if (prev.length === 0) {
        return [BOT_WELCOME];
      }
      return prev;
    });

    const saved = localStorage.getItem('conversation_id');
    if (saved) {
      setConversationId(Number(saved));
      return;
    }

    userAPI.start().then((res) => {
      setConversationId(res.conversation_id);
      localStorage.setItem('conversation_id', res.conversation_id);
    });
  }, [open]);

  useEffect(() => {
    if (!conversationId) return;

    let cancelled = false;
    setLoadingHistory(true);

    const timer = setInterval(() => {
      userAPI
        .messages(conversationId)
        .then((data) => {
          if (cancelled) return;

          setMessages((prev) => {
            const bot = prev.filter((m) => m.sender === 'bot');
            return [...bot, ...data];
          });
        })
        .finally(() => {
          if (!cancelled) setLoadingHistory(false);
        });
    }, 3000);

    return () => clearInterval(timer);
  }, [conversationId]);

  const send = async () => {
    if (!text.trim() || !conversationId) return;

    setMessages((prev) => [...prev, { sender: 'guest', content: text }]);

    if (!hasSentFirst.current) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          content: 'MAM sẽ nhanh chóng phản hồi câu hỏi của bạn, bạn chờ trong giây lát nhé!',
        },
      ]);
      hasSentFirst.current = true;
    }

    setAdminTyping(true); // 👈 bắt đầu chờ admin
    setText('');
    if (text != BOT_WAITING.content && text != BOT_WELCOME.content) {
      await userAPI.send(conversationId, text);
    }
  };

  return {
    open,
    setOpen,
    messages,
    text,
    setText,
    send,
    loadingHistory,
    adminTyping,
  };
}
