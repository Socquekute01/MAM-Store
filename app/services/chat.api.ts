// src/services/chat.api.ts
const BASE = "/api/chat";

export const chatApi = {
  start() {
    return fetch(`${BASE}/start.php`).then(r => r.json());
  },

  send(conversationId: number, message: string) {
    return fetch(`${BASE}/send.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: conversationId,
        message
      })
    });
  },

  messages(conversationId: number) {
    return fetch(
      `${BASE}/messages.php?conversation_id=${conversationId}`
    ).then(r => r.json());
  }
};
