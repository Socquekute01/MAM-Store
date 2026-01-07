import { FileText, MessageCircle, Package, ToolCase, User } from 'lucide-react';
import type { SidebarAdminType } from '../admin/admin.types';


function SidebarAdmin({
  setActiveTab,
  setSelectedConversation,
  activeTab,
  conversations,
  feedbacks,
  setProductView,
}: SidebarAdminType) {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-200">
        <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                  ? 'bg-linear-to-r from-blue-50 to-blue-50 text-blue-600 shadow-sm border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
        >
          <MessageCircle size={20} />
          <span>Tin nhắn</span>
          {conversations.filter((c) => c.unread_count && c.unread_count > 0).length > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              {parseInt(conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0))}
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
                  ? 'bg-linear-to-r from-blue-50 to-blue-50 text-blue-600 shadow-sm border border-blue-100'
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
                  ? 'bg-linear-to-r from-blue-50 to-blue-50 text-blue-600 shadow-sm border border-blue-100'
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
                  ? 'bg-linear-to-r from-blue-50 to-blue-50 text-blue-600 shadow-sm border border-blue-100'
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
                  ? 'bg-linear-to-r from-blue-50 to-blue-50 text-blue-600 shadow-sm border border-blue-100'
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
          <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
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
  );
}

export default SidebarAdmin;
