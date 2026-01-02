import { useState } from 'react';
import Contact from '../landing/Contact';

export default function ConsultationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    message: '',
  });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Gọi API gửi form ở đây
    alert('Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.');
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', area: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Button cố định bên phải màn hình */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-foreground/40 text-white px-4 py-2 shadow-2xl transition-all duration-300 z-50 group"
        style={{
          writingMode: 'vertical-lr',
          textOrientation: 'mixed',
          letterSpacing: '0.1em',
        }}
      >
        <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider">
          <svg
            className="w-5 h-5 rotate-90 group-hover:scale-110 transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Nhận tư vấn
        </span>
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-opacity-0 bg-secondary/70 flex items-center justify-center z-[100] p-4 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="bg-[#f5f1ea] rounded-lg shadow-2xl max-w-lvh w-full max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <Contact isFormEdit={true} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
