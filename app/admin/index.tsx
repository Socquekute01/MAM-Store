import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Users,
  FileText,
  User,
  Send,
  X,
  Clock,
  CheckCircle,
  ArrowLeft,
  Package,
  Folder,
  Plus,
  Trash2,
  Check,
  Upload,
  Image,
  GripVertical,
  MessageSquare,
  Mail,
  CheckCircle2,
  Phone,
  Eye,
  Toolbox,
  ToolCase,
  Video,
  Pencil,
  Calendar,
  Building2,
} from 'lucide-react';
import { adminApi } from '@/services/admin.api';
import { userAPI } from '@/services/user.api';
type Construction = {
  id: number;
  image: string;
  completed_date: string;
  title: string;
  video_url: string | null;
  created_at: string;
};
// Types
type Message = {
  id: number;
  content: string;
  sender: 'bot' | 'guest' | 'admin';
  created_at: string;
  unread_count?: number;
};

type Conversation = {
  id: number;
  guest_id: string;
  status: 'open' | 'closed';
  created_at: string;
  last_message?: string;
  unread_count: number;
};

type Feedback = {
  id: number;
  name: string;
  phone: string;
  message: string;
  area: string;
  created_at: string;
  status: 'new' | 'read';
};

type Category = {
  id: number;
  name: string;
  slug: string;
  product_count: number;
  created_at: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
  image_count: number;
  created_at: string;
};

type ProductImage = {
  id: number;
  image_url: string;
  is_thumbnail: number;
  sort_order: number;
};

type ProductDetail = {
  id: number;
  name: string;
  description: string;
  category_name: string;
  images: ProductImage[];
};

// Components
function ChatMessage({ content, sender, created_at }: Message) {
  const isAdmin = sender === 'admin';
  const isBot = sender === 'bot';

  return (
    <div className={`flex w-full ${isAdmin ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className="max-w-[75%]">
        <div
          className={`
            px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words shadow-sm
            ${
              isAdmin
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                : isBot
                  ? 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200 rounded-bl-md'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'
            }
          `}
        >
          {content}
        </div>
        <div className="text-xs text-slate-400 mt-1 px-1">
          {new Date(created_at).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}

function FeedbackCard({
  feedback,
  setFeedbacks,
}: {
  feedback: Feedback;
  setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
}) {
  const isNew = feedback.status === 'new';

  const handleMarkAsRead = () => {
    // TODO: Call API to mark as read
    console.log('Mark as read:', feedback.id);
  };

  const handleDelete = async () => {
    // TODO: Call API to delete
    if (confirm('Bạn có chắc muốn xóa feedback này?')) {
      await adminApi.deleteFeedback(feedback.id);
      setFeedbacks((prev) => prev.filter((f) => f.id !== feedback.id));
      alert('Đã xóa phản hồi.');
    }
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 relative overflow-hidden">
      {/* Status Badge - Top Right */}
      <div className="absolute top-4 right-4">
        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg flex items-center gap-1.5 animate-pulse">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          Mới
        </span>
      </div>

      {/* Header - User Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
          <User className="text-white" size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">{feedback.name}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Phone size={14} />
            <a href={`mailto:${feedback.phone}`} className="hover:text-blue-600 transition-colors truncate">
              {feedback.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare size={16} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nội dung phản hồi</span>
        </div>
        <p className="text-slate-700 leading-relaxed text-sm">
          {feedback.message} ({feedback.area})
        </p>
      </div>

      {/* Footer - Time & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock size={14} className="flex-shrink-0" />
          <span>
            {new Date(feedback.created_at).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isNew && (
            <button
              onClick={handleMarkAsRead}
              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
              title="Đánh dấu đã đọc"
            >
              <Eye size={16} />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
    </div>
  );
}

export default function AdminChatInterface() {
  const [activeTab, setActiveTab] = useState<'conversations' | 'feedback' | 'profile' | 'products' | 'construction'>(
    'conversations',
  );
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Product states
  const [productView, setProductView] = useState<'categories' | 'products' | 'detail'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [draggedImage, setDraggedImage] = useState<ProductImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'products') {
      loadCategories();
    }
  }, [activeTab]);

  useEffect(() => {
    if (productView === 'products' && selectedCategory) {
      loadProducts(selectedCategory);
    }
  }, [productView, selectedCategory]);

  useEffect(() => {
    if (productView === 'detail' && selectedProduct) {
      loadProductDetail(selectedProduct);
    }
  }, [productView, selectedProduct]);

  const loadCategories = async () => {
    const data = await userAPI.getCategories();
    setCategories(data || []);
  };

  const loadProducts = async (categoryId: number) => {
    const data = await userAPI.getProducts(categoryId);
    setProducts(data);
  };

  const loadProductDetail = async (productId: number) => {
    const data = await userAPI.getProductDetail(productId);
    setProductDetail(data);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    const newCat = await adminApi.createCategory(newCategoryName);
    setCategories([newCat.data, ...categories]);
    setNewCategoryName('');
    setShowCategoryModal(false);
  };

  const handleCreateProduct = async () => {
    if (!newProductName.trim() || !selectedCategory) return;
    await adminApi.createProduct(selectedCategory, newProductName, newProductDesc);
    setNewProductName('');
    setNewProductDesc('');
    setShowProductModal(false);
    loadProducts(selectedCategory);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !selectedProduct) return;

    const uploaded = await adminApi.uploadImages(selectedProduct, files);
    setProductDetail((prev) =>
      prev
        ? {
            ...prev,
            images: [...prev.images, ...uploaded?.data],
          }
        : null,
    );
  };

  const handleSetThumbnail = async (imageId: number) => {
    await adminApi.setThumbnail(imageId);
    setProductDetail((prev) =>
      prev
        ? {
            ...prev,
            images: prev.images.map((img) => ({
              ...img,
              is_thumbnail: img.id === imageId ? 1 : 0,
            })),
          }
        : null,
    );
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Xóa ảnh này?')) return;
    await adminApi.deleteImage(imageId);
    setProductDetail((prev) =>
      prev
        ? {
            ...prev,
            images: prev.images.filter((img) => img.id !== imageId),
          }
        : null,
    );
  };

  const handleDragStart = (image: ProductImage) => {
    setDraggedImage(image);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetImage: ProductImage) => {
    if (!draggedImage || !productDetail || draggedImage.id === targetImage.id) return;

    const images = [...productDetail.images];
    const draggedIdx = images.findIndex((img) => img.id === draggedImage.id);
    const targetIdx = images.findIndex((img) => img.id === targetImage.id);

    images.splice(draggedIdx, 1);
    images.splice(targetIdx, 0, draggedImage);

    const imageOrders = images.map((img, idx) => ({ id: img.id, sort_order: idx }));

    setProductDetail({
      ...productDetail,
      images: images.map((img, idx) => ({ ...img, sort_order: idx })),
    });

    await adminApi.reorderImages(imageOrders);
    setDraggedImage(null);
  };

  useEffect(() => {
    if (activeTab !== 'conversations') return;

    let alive = true;

    const load = async (showLoading = false) => {
      if (showLoading) setLoadingConversations(true);

      try {
        const data = await adminApi.getConversations();
        if (alive) {
          setConversations((prev) => {
            return data.map((c: { id: number }) => {
              const old = prev.find((p) => p.id === c.id);
              return old ? { ...c } : c;
            });
          });
        }
      } finally {
        if (showLoading && alive) {
          setLoadingConversations(false);
        }
      }
    };

    // load lần đầu → có loading
    load(true);
    adminApi.getFeedbacks().then(setFeedbacks);

    // realtime polling
    const timer = setInterval(() => {
      load(false); // không bật loading để tránh giật UI
      adminApi.getFeedbacks().then(setFeedbacks);
    }, 3000);

    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [activeTab]);

  // Load messages
  useEffect(() => {
    if (!selectedConversation) return;

    loadMessages(); // load lần đầu
    adminApi.markRead(selectedConversation);

    const timer = setInterval(() => {
      loadMessages();
    }, 3000); // 3s là đẹp

    return () => clearInterval(timer);
  }, [selectedConversation]);

  const loadMessages = () => {
    if (!selectedConversation) return;

    adminApi.getMessages(selectedConversation).then((msgs) => {
      setMessages(msgs);
    });
  };

  // // Load feedbacks
  useEffect(() => {
    if (activeTab === 'feedback') {
      adminApi.getFeedbacks().then(setFeedbacks);
    }
    const interal = setInterval(() => {
      adminApi.getFeedbacks().then(setFeedbacks);
    }, 3000);
  }, [activeTab]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now(),
      content: messageText,
      sender: 'admin',
      created_at: new Date().toISOString(),
      unread_count: 0,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');

    try {
      await adminApi.sendMessage(selectedConversation, messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedConversation) return;

    try {
      await adminApi.closeConversation(selectedConversation);
      setConversations((prev) => prev.map((c) => (c.id === selectedConversation ? { ...c, status: 'closed' } : c)));
    } catch (error) {
      console.error('Failed to close conversation:', error);
    }
  };

  const [constructions, setConstructions] = useState<Construction[]>([]);
  const [showConstructionModal, setShowConstructionModal] = useState(false);
  const [editingConstruction, setEditingConstruction] = useState<Construction | null>(null);
  const [constructionForm, setConstructionForm] = useState({
    image: '',
    completedDate: '',
    title: '',
    videoUrl: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const constructionImageInputRef = useRef<HTMLInputElement>(null);

  // ==================== THÊM VÀO PHẦN EFFECTS ====================
  useEffect(() => {
    if (activeTab === 'construction') {
      loadConstructions();
    }
  }, [activeTab]);

  // ==================== THÊM VÀO PHẦN HANDLERS ====================
  const loadConstructions = async () => {
    const data = await adminApi.getConstructions();
    setConstructions(data);
  };

  const handleConstructionImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ảnh tối đa 5MB');
      return;
    }

    try {
      setUploadingImage(true);

      // preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // upload
      const {image_url} = await adminApi.uploadImage(file);

      // 🔑 LƯU PATH, KHÔNG LƯU URL
      setConstructionForm((prev) => ({
        ...prev,
        image: image_url,
      }));
    } catch (err) {
      console.error(err);
      alert('Upload ảnh thất bại');
    } finally {
      setUploadingImage(false);
    }
  };
  const handleRemoveImage = () => {
    setConstructionForm({ ...constructionForm, image: '' });
    setImagePreview('');
    if (constructionImageInputRef.current) {
      constructionImageInputRef.current.value = '';
    }
  };

  const handleConstructionSubmit = async () => {
    if (!constructionForm.image || !constructionForm.completedDate || !constructionForm.title) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      if (editingConstruction) {
        await adminApi.updateConstruction(editingConstruction.id, constructionForm);
      } else {
        await adminApi.createConstruction(constructionForm);
      }

      setShowConstructionModal(false);
      setEditingConstruction(null);
      setConstructionForm({ image: '', completedDate: '', title: '', videoUrl: '' });
      loadConstructions();
      setImagePreview('');
      setConstructions(await adminApi.getConstructions());
    } catch (error) {
      console.error('Error saving construction:', error);
    }
  };

  const handleEditConstruction = (construction: Construction) => {
    setEditingConstruction(construction);
    setConstructionForm({
      image: construction.image,
      completedDate: construction.completed_date,
      title: construction.title,
      videoUrl: construction.video_url || '',
    });
    setImagePreview(construction.image);
    setShowConstructionModal(true);
  };

  const handleDeleteConstruction = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa công trình này?')) return;

    try {
      await adminApi.deleteConstruction(id);
      loadConstructions();
    } catch (error) {
      console.error('Error deleting construction:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-5 border-b border-slate-200">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">MAM Support System</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <button
            onClick={() => {
              setActiveTab('conversations');
              setSelectedConversation(null);
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all font-medium
              ${
                activeTab === 'conversations'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-50 text-blue-600 shadow-sm border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            <MessageCircle size={20} />
            <span>Tin nhắn</span>
            {conversations.filter((c) => c.unread_count && c.unread_count > 0).length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                {conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0)}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('feedback');
              setSelectedConversation(null);
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all font-medium
              ${
                activeTab === 'feedback'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-50 text-blue-600 shadow-sm border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            <FileText size={20} />
            <span>Ý kiến</span>
            {feedbacks.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                {feedbacks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setProductView('categories');
              setSelectedConversation(null);
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all font-medium
              ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-50 text-blue-600 shadow-sm border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            <Package size={20} />
            <span>Thiết kế</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('construction');
              setSelectedConversation(null);
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all font-medium
              ${
                activeTab === 'construction'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-50 text-blue-600 shadow-sm border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            <ToolCase size={20} />
            <span>Thi công</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('profile');
              setSelectedConversation(null);
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
              ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-50 text-blue-600 shadow-sm border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            <User size={20} />
            <span>Tài khoản</span>
          </button>
        </nav>

        {/* Admin Profile */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
              AD
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-slate-900">Admin</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <p className="text-xs text-slate-500">Đang hoạt động</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'conversations' && (
          <>
            {!selectedConversation ? (
              /* Conversations Grid */
              <div className="flex-1 bg-white flex flex-col">
                <div className="p-6 border-b border-slate-200 bg-white">
                  <h2 className="text-2xl font-bold text-slate-900">Danh sách khách hàng</h2>
                  <p className="text-sm text-slate-500 mt-1">{conversations.length} cuộc hội thoại</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {loadingConversations ? (
                    /* Loading conversations */
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-500" />
                    </div>
                  ) : conversations.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Users size={48} className="text-slate-300 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-700">Chưa có hội thoại nào</h3>
                      <p className="text-sm text-slate-500 mt-1 max-w-sm">
                        Khi khách hàng bắt đầu chat, các hội thoại sẽ xuất hiện tại đây.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {conversations.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv.id)}
                          className="bg-white border border-slate-200 rounded-xl p-5 cursor-pointer hover:shadow-xl hover:border-blue-300 transition-all hover:-translate-y-1"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                                {conv.guest_id.slice(-3)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900">Guest {conv.guest_id.slice(-6)}</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <Clock size={12} className="text-slate-400" />
                                  <span className="text-xs text-slate-400">
                                    {new Date(conv.created_at).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {conv.unread_count > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm">
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                            {conv.last_message || 'Chưa có tin nhắn'}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            {conv.status === 'open' ? (
                              <span className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                Đang mở
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                <CheckCircle size={12} />
                                Đã đóng
                              </span>
                            )}
                            <MessageCircle size={16} className="text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Chat Full Screen */
              <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">
                {/* Chat Header */}
                <div className="bg-white border-b border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900"
                        title="Quay lại"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                        {conversations.find((c) => c.id === selectedConversation)?.guest_id.slice(-3)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Guest {conversations.find((c) => c.id === selectedConversation)?.guest_id.slice(-6)}
                        </h3>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <p className="text-sm text-slate-500">Đang hoạt động</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseConversation}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition-all text-slate-700 hover:shadow-sm"
                    >
                      Đóng hội thoại
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-500"></div>
                      </div>
                    ) : (
                      <>
                        {messages.map((msg) => (
                          <ChatMessage key={msg.id} {...msg} />
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>
                </div>

                {/* Input */}
                <div className="bg-white border-t border-slate-200 p-4 shadow-lg">
                  <div className="flex gap-3">
                    <input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                    >
                      <Send size={18} />
                      Gửi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {activeTab === 'feedback' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Ý kiến đóng góp</h2>

              {feedbacks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                  <svg
                    className="w-12 h-12 mb-4 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10h8m-8 4h4m-6 6h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>

                  <p className="text-sm">Chưa có ý kiến đóng góp nào</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {feedbacks.map((feedback) => (
                    <FeedbackCard key={feedback.id} feedback={feedback} setFeedbacks={setFeedbacks} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'construction' && (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Công trình đã hoàn thành</h2>
                <p className="text-sm text-slate-500 mt-1">{constructions.length} công trình</p>
              </div>
              <button
                onClick={() => {
                  setEditingConstruction(null);
                  setConstructionForm({ image: '', completedDate: '', title: '', videoUrl: '' });
                  setImagePreview('');
                  setShowConstructionModal(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
              >
                <Plus size={18} />
                Thêm công trình
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {constructions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Building2 size={48} className="text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700">Chưa có công trình nào</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">
                    Thêm công trình đầu tiên để showcase dự án của bạn.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {constructions.map((construction) => (
                    <div
                      key={construction.id}
                      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img
                          src={construction.image}
                          alt={construction.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {construction.video_url && (
                          <div className="absolute top-3 right-3 bg-black/70 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium">
                            <Video size={14} />
                            Video
                          </div>
                        )}

                        {/* Action Buttons - Show on hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEditConstruction(construction)}
                            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg transition-all"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteConstruction(construction.id)}
                            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-slate-900 text-lg mb-3 line-clamp-2 min-h-[3.5rem]">
                          {construction.title}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-slate-500 pt-3 border-t border-slate-100">
                          <Calendar size={16} />
                          <span>Hoàn thành: {new Date(construction.completed_date).toLocaleDateString('vi-VN')}</span>
                        </div>

                        {construction.video_url && (
                          <a
                            href={construction.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <Video size={16} />
                            Xem video
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {showConstructionModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConstructionModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {editingConstruction ? 'Chỉnh sửa công trình' : 'Thêm công trình mới'}
              </h3>

              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ảnh công trình <span className="text-red-500">*</span>
                  </label>

                  {!imagePreview ? (
                    <div
                      onClick={() => constructionImageInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <input
                        ref={constructionImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleConstructionImageSelect}
                        className="hidden"
                      />
                      {uploadingImage ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-500"></div>
                          <p className="text-sm text-slate-500">Đang upload...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <Upload className="text-blue-600" size={28} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Click để chọn ảnh</p>
                            <p className="text-xs text-slate-500 mt-1">PNG, JPG tối đa 5MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-200 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={18} />
                      </button>
                      <button
                        onClick={() => constructionImageInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="text-white text-center">
                          <Upload size={32} className="mx-auto mb-2" />
                          <p className="text-sm font-medium">Thay đổi ảnh</p>
                        </div>
                      </button>
                      <input
                        ref={constructionImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleConstructionImageSelect}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={constructionForm.title}
                    onChange={(e) => setConstructionForm({ ...constructionForm, title: e.target.value })}
                    placeholder="Tên công trình"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ngày hoàn thành <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={constructionForm.completedDate}
                    onChange={(e) => setConstructionForm({ ...constructionForm, completedDate: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">URL Video (không bắt buộc)</label>
                  <input
                    value={constructionForm.videoUrl}
                    onChange={(e) => setConstructionForm({ ...constructionForm, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowConstructionModal(false);
                    setImagePreview('');
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-medium text-slate-700"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConstructionSubmit}
                  disabled={uploadingImage}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingConstruction ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </div>
          </div>
        )}
       
        {activeTab === 'products' && (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {productView === 'categories' && (
              <>
                <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Portfolio & Dự án</h2>
                    <p className="text-sm text-slate-500 mt-1">{categories.length} danh mục</p>
                  </div>
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus size={18} />
                    Thêm danh mục
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Folder size={48} className="text-slate-300 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-700">Chưa có danh mục nào</h3>
                      <p className="text-sm text-slate-500 mt-1 max-w-sm">
                        Tạo danh mục đầu tiên để bắt đầu quản lý portfolio của bạn.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setProductView('products');
                          }}
                          className="bg-white border border-slate-200 rounded-xl p-6 cursor-pointer hover:shadow-xl hover:border-blue-300 transition-all hover:-translate-y-1"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                              <Folder className="text-white" size={28} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900 text-lg">{cat.name}</h3>
                              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Package size={14} />
                                {cat.product_count || 0} sản phẩm
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            {productView === 'products' && (
              <>
                <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setProductView('categories')}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {categories.find((c) => c.id === selectedCategory)?.name}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">{products.length} sản phẩm</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus size={18} />
                    Thêm sản phẩm
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Package size={48} className="text-slate-300 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-700">Chưa có sản phẩm nào</h3>
                      <p className="text-sm text-slate-500 mt-1 max-w-sm">Thêm sản phẩm đầu tiên vào danh mục này.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setSelectedProduct(product.id);
                            setProductView('detail');
                          }}
                          className="bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:border-blue-300 transition-all hover:-translate-y-1"
                        >
                          <div className="aspect-video bg-slate-100 overflow-hidden">
                            {product.thumbnail ? (
                              <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="text-slate-300" size={48} />
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <h3 className="font-semibold text-slate-900 mb-2">{product.name}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <Image size={14} />
                                <span>{product.image_count} ảnh</span>
                              </div>
                              <span className="text-xs text-slate-400">
                                {new Date(product.created_at).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {productView === 'detail' && productDetail && (
              <>
                <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setProductView('products')}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{productDetail.name}</h2>
                      <p className="text-sm text-slate-500 mt-1">{productDetail.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      <Upload size={18} />
                      Upload ảnh
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {productDetail.images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Image size={48} className="text-slate-300 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-700">Chưa có ảnh nào</h3>
                      <p className="text-sm text-slate-500 mt-1 max-w-sm mb-4">Upload ảnh đầu tiên cho sản phẩm này.</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 shadow-md transition-all"
                      >
                        <Upload size={18} />
                        Chọn ảnh
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {productDetail.images.map((image) => (
                        <div
                          key={image.id}
                          draggable
                          onDragStart={() => handleDragStart(image)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(image)}
                          className="relative group bg-white border-2 border-slate-200 rounded-xl overflow-hidden cursor-move hover:border-blue-400 transition-all hover:shadow-lg"
                        >
                          {image.is_thumbnail === 1 && (
                            <div className="absolute top-2 left-2 z-10 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg font-medium">
                              <Check size={12} />
                              <span>Thumbnail</span>
                            </div>
                          )}

                          <div className="absolute top-2 right-2 z-10 bg-black/50 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical size={16} />
                          </div>

                          <div className="aspect-square bg-slate-100">
                            <img src={image.image_url} alt="" className="w-full h-full object-cover" />
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3 gap-2">
                            {image.is_thumbnail === 0 && (
                              <button
                                onClick={() => handleSetThumbnail(image.id)}
                                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-md transition-all"
                              >
                                Chọn Thumbnail
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteImage(image.id)}
                              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Thông tin cá nhân</h2>
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    AD
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-slate-900">Administrator</h3>
                    <p className="text-slate-500">admin@mam.com</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Họ tên</label>
                    <input
                      type="text"
                      defaultValue="Administrator"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="admin@mam.com"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      placeholder="+84 xxx xxx xxx"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg mt-6">
                    Cập nhật thông tin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showCategoryModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCategoryModal(false)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Thêm danh mục mới</h3>
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              placeholder="Tên danh mục (vd: Website Design)"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-medium text-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateCategory}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all font-medium shadow-md"
              >
                Tạo danh mục
              </button>
            </div>
          </div>
        </div>
      )}

      {showProductModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowProductModal(false)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Thêm sản phẩm mới</h3>
            <input
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Tên sản phẩm"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              autoFocus
            />
            <textarea
              value={newProductDesc}
              onChange={(e) => setNewProductDesc(e.target.value)}
              placeholder="Mô tả sản phẩm"
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowProductModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-medium text-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateProduct}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all font-medium shadow-md"
              >
                Tạo sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
