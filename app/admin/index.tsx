import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Users, FileText, User, Send, X, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { adminApi } from '@/services/admin.api';

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
  email: string;
  message: string;
  created_at: string;
  status: 'new' | 'read';
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

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900">{feedback.name}</h3>
          <p className="text-sm text-slate-500">{feedback.email}</p>
        </div>
        {feedback.status === 'new' && (
          <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium border border-emerald-200">
            Mới
          </span>
        )}
      </div>
      <p className="text-slate-700 mb-3 leading-relaxed">{feedback.message}</p>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Clock size={12} />
        {new Date(feedback.created_at).toLocaleString('vi-VN')}
      </div>
    </div>
  );
}

export default function AdminChatInterface() {
  const [activeTab, setActiveTab] = useState<'conversations' | 'feedback' | 'profile'>('conversations');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab !== 'conversations') return;

    let alive = true;

    const load = async (showLoading = false) => {
      if (showLoading) setLoadingConversations(true);

      try {
        const data = await adminApi.getConversations();
        if (alive) {
          setConversations((prev) => {
            return data.map((c) => {
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

    // realtime polling
    const timer = setInterval(() => {
      load(false); // không bật loading để tránh giật UI
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

  // Load feedbacks
  useEffect(() => {
    if (activeTab === 'feedback') {
      adminApi.getFeedbacks().then(setFeedbacks);
    }
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
              <div className="grid gap-4">
                {feedbacks.map((feedback) => (
                  <FeedbackCard key={feedback.id} feedback={feedback} />
                ))}
              </div>
            </div>
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
    </div>
  );
}
