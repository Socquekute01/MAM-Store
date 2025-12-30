const ADMIN_BASE = '/api/admin';
const URL_BASE = '/api/chat';

export const adminApi = {
  getConversations() {
    return fetch(`${ADMIN_BASE}/get-conversations.php`).then((r) => r.json());
  },

  getMessages(conversationId: number) {
    return fetch(`${URL_BASE}/get-messages.php?conversation_id=${conversationId}`).then((r) => r.json());
  },

  sendMessage(conversationId: number, content: string) {
    return fetch(`${ADMIN_BASE}/send-message.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: conversationId,
        message: content,
      }),
    }).then((r) => r.json());
  },

  closeConversation(conversationId: number) {
    return fetch(`${ADMIN_BASE}/close-conversation.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: conversationId,
      }),
    }).then((r) => r.json());
  },

  getFeedbacks() {
    return fetch(`${ADMIN_BASE}/get-feedbacks.php`).then((r) => r.json());
  },

  markRead(conversationId: number) {
    return fetch(`${URL_BASE}/mark-read.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: conversationId,
        role: 'admin',
      }),
    }).then((r) => r.json());
  },
};
