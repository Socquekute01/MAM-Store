// src/services/chat.api.ts
const API_BASE = '/api/user';

export const userAPI = {
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
  getCategories() {
    return fetch(`${API_BASE}/get-categories.php`).then((r) => r.json());
  },
  getProducts(categoryId: number) {
    return fetch(`${API_BASE}/get-products.php?category_id=${categoryId}`).then((r) => r.json());
  },
  getAllProducts() {
    return fetch(`${API_BASE}/get-all-products.php`).then((r) => r.json());
  },
  getProductDetail(productId: number) {
    return fetch(`${API_BASE}/get-product-detail.php?product_id=${productId}`).then((r) => r.json());
  },
};
