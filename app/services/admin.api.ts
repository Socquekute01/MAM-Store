const ADMIN_BASE = 'https://khoancatbetongtienxuan.com/api/admin';
const URL_BASE = 'https://khoancatbetongtienxuan.com/api/user';

export const adminApi = {
  /* =======================
   * CHAT – CONVERSATION
   * ======================= */
  getConversations() {
    return fetch(`${ADMIN_BASE}/get-conversations.php`).then((r) => r.json());
  },

  getMessages(conversationId: number) {
    return fetch(`${URL_BASE}/get-messages.php?conversation_id=${conversationId}`).then((r) => r.json());
  },
  uploadImage: async (
    file: File,
  ): Promise<{
    image_url: string;
  }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${ADMIN_BASE}/upload-construction-image.php`, {
      method: 'POST',
      body: formData,
    });

    const json = await response.json();
    return json.data;
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
  createConstruction(data: { image: string; completedDate: string; title: string; videoUrl?: string }) {
    return fetch(`${ADMIN_BASE}/create-construction.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json());
  },
  getConstructions() {
    return fetch(`${URL_BASE}/get-constructions.php`).then((r) => r.json());
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

  /* =======================
   * FEEDBACK
   * ======================= */
  getFeedbacks() {
    return fetch(`${ADMIN_BASE}/get-feedbacks.php`).then((r) => r.json());
  },

  /* =======================
   * CATEGORY
   * ======================= */
  getCategories() {
    return fetch(`${ADMIN_BASE}/get-categories.php`).then((r) => r.json());
  },

  createCategory(name: string) {
    return fetch(`${ADMIN_BASE}/create-category.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    }).then((r) => r.json());
  },

  /* =======================
   * PRODUCT
   * ======================= */

  createProduct(categoryId: number, name: string, description: string) {
    return fetch(`${ADMIN_BASE}/create-product.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category_id: categoryId,
        name,
        description,
      }),
    }).then((r) => r.json());
  },

  /* =======================
   * PRODUCT IMAGES
   * ======================= */
  async uploadImages(productId: number, files: File[]) {
    const formData = new FormData();
    formData.append('product_id', String(productId));

    files.forEach((file) => {
      formData.append('images[]', file);
    });

    const res = await fetch(`${ADMIN_BASE}/upload-product-images.php`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const json = await res.json();

    if (!res.ok || json.success === false) {
      throw new Error(json.error || 'Upload failed');
    }

    return json;
  },

  setThumbnail(imageId: number) {
    return fetch(`${ADMIN_BASE}/set-thumbnail.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_id: imageId }),
    }).then((r) => r.json());
  },
  deleteConstruction(id: number) {
    return fetch(`${ADMIN_BASE}/delete-construction.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).then((r) => r.json());
  },
  updateConstruction: async (id: number, construction: any) => {
    const response = await fetch(`${ADMIN_BASE}/update-construction.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...construction }),
    });
    const data = await response.json();
    return data.data;
  },
  deleteImage(imageId: number) {
    return fetch(`${ADMIN_BASE}/delete-image.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_id: imageId }),
    }).then((r) => r.json());
  },

  reorderImages(imageOrders: Array<{ id: number; sort_order: number }>) {
    return fetch(`${ADMIN_BASE}/reorder-images.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_orders: imageOrders,
      }),
    }).then((r) => r.json());
  },

  deleteFeedback(feedbackId: number) {
    return fetch('/api/admin/delete-feedback.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: feedbackId }),
    }).then((r) => r.json());
  },
};
