import { useEffect, useRef, useState } from 'react';

const Contact = ({ isFormEdit = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    area: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user/create-feedback.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!json.success) throw new Error(json.error);

      alert('Cảm ơn bạn đã gửi lời nhắn cho MAM! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.');
      setForm({ name: '', phone: '', area: '', message: '' });
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`py-${isFormEdit ? '8' : '20'} bg-secondary`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="section-subtitle mb-4">Liên hệ</p>
          <h2 className="section-title mb-8">
            Hãy cùng nhau xây dựng <span className="italic">ngôi nhà trong mơ</span>
          </h2>
          <p className="font-sans text-muted-foreground mb-12 leading-relaxed">
            Chúng tôi chân thành cảm ơn bạn đã ghé thăm và tin tưởng lựa chọn chúng tôi trong hành trình xây dựng tổ ấm
            của mình. Chúng tôi rất mong được lắng nghe câu chuyện của bạn và đồng hành cùng bạn để biến những ý tưởng
            ấy thành hiện thực.
          </p>

          {/* Contact Form */}
          <form className="space-y-6 text-left" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-1 gap-6">
              <div>
                <label className="block font-sans text-xs tracking-[0.15em] uppercase mb-3">Họ tên</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  className="w-full bg-transparent border-b border-foreground/30 py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Nhập tên của bạn"
                />
              </div>
              {/* <div>
                <label className="block font-sans text-xs tracking-[0.15em] uppercase mb-3">Email Address</label>
                <input
                 onChange={handleChange}
                  type="email"
                  className="w-full bg-transparent border-b border-foreground/30 py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Enter your email"
                />
              </div> */}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-xs tracking-[0.15em] uppercase mb-3">Số điện thoại</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="text"
                  className="w-full bg-transparent border-b border-foreground/30 py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-[0.15em] uppercase mb-3">Diện tích</label>
                <input
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  type="text"
                  className="w-full bg-transparent border-b border-foreground/30 py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Nhập diện tích căn nhà (m²)"
                />
              </div>
            </div>
            <div>
              <label className="block font-sans text-xs tracking-[0.15em] uppercase mb-3">Lời nhắn</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={isFormEdit ? 1 : 4}
                className="w-full bg-transparent border-b border-foreground/30 py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                placeholder="Hãy nói cho chúng tôi biết về dự án của bạn..."
              />
            </div>
            <div className="text-center pt-4">
              <button type="submit" className="elegant-button">
                Gửi lời nhắn
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
