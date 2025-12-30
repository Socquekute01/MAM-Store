// src/services/chat.api.ts
const API_BASE = '/api/chat';

export const chatApi = {
  start() {
    return fetch(`${API_BASE}/create-conversation.php`).then((r) => r.json());
  },

  send(conversationId: number, message: string) {
    return fetch(`${API_BASE}/send-message.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: conversationId,
        message,
      }),
    }).then((r) => r.json());
  },

  messages(conversationId: number) {
    return fetch(`${API_BASE}/get-messages.php?conversation_id=${conversationId}`).then((r) => r.json());
  },
};
