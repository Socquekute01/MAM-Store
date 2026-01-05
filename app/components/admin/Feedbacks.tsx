import { Clock, Eye, MessageSquare, Phone, Trash2, User } from 'lucide-react';
import type { Feedback, FeedbackType } from './admin.types';
import { adminApi } from '@/services/admin.api';
import { useEffect } from 'react';

function FeedbackCard({
  feedback,
  setFeedbacks,
}: {
  feedback: Feedback;
  setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
}) {
  const isNew = feedback.status === 'new';

  const handleMarkAsRead = () => {
    console.log('Mark as read:', feedback.id);
  };

  const handleDelete = async () => {
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
        <span className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg flex items-center gap-1.5 animate-pulse">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          Mới
        </span>
      </div>

      {/* Header - User Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
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
          <Clock size={14} className="shrink-0" />
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
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
    </div>
  );
}

function Feedbacks({ setFeedbacks, feedbacks }: FeedbackType) {
  return (
    <>
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
    </>
  );
}

export default Feedbacks;
