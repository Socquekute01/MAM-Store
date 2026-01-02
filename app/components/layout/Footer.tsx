import { Youtube, Facebook, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 md:py-16 bg-layout border-t border-border">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Logo & Social - Left Column */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start">
            <a href="#" className="mb-6 block transition-opacity hover:opacity-80">
              <img
                width="140"
                height="170"
                src="https://mamvietnam.vn/wp-content/uploads/2025/07/mam-logo.webp"
                alt="MAM DESIGN – Thiết kế và thi công nội thất"
                className="w-32 md:w-36"
              />
            </a>

            <div className="flex items-center gap-4 mb-4">
              <a
                href="https://www.facebook.com/mamvietnam6868/"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.youtube.com/@MAMVi%E1%BB%87tNam"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300"
                aria-label="Youtube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@mamvn.design"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300"
                aria-label="Tiktok"
              >
                <img
                  width={16}
                  height={16}
                  src="https://lacystudio.com/wp-content/themes/lacystudio/images/footer/tiktok.svg"
                  alt="TikTok"
                  className="opacity-70"
                />
              </a>
            </div>

            <p className="text-xs text-muted-foreground/70 text-center md:text-left">
              © {new Date().getFullYear()} Nội thất MAM Design
            </p>
          </div>

          {/* Quick Links - Middle Column */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Hỗ trợ khách hàng</h3>
            <nav className="flex flex-col gap-2.5">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 transform"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 transform"
              >
                Quy định & Chính sách
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 transform"
              >
                Giải đáp vấn đề
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 transform inline-flex items-center gap-1.5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Tư vấn 24/7
              </a>
            </nav>
          </div>

          {/* Contact Info - Right Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-3 items-start group">
                <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-foreground transition-colors" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Trụ sở chính</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Tòa nhà Thảo Nguyên, 07 B1.1 LK19, Phú Lương. Hà Đông, Hà Nội
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start group">
                <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-foreground transition-colors" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Xưởng sản xuất</p>
                  <p className="text-muted-foreground leading-relaxed">KCN Thạch Thất - Huyện Thạch Thất - Hà Nội</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/50 flex flex-col sm:flex-row gap-4 sm:gap-8">
                <a
                  href="tel:0974433666"
                  className="flex gap-3 items-center group hover:text-foreground transition-colors"
                >
                  <Phone className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <div className="text-sm">
                    <p className="text-muted-foreground/70 text-xs mb-0.5">Hotline</p>
                    <p className="font-semibold text-foreground">0974 433 666</p>
                  </div>
                </a>

                <a
                  href="mailto:mamdesign@gmail.com"
                  className="flex gap-3 items-center group hover:text-foreground transition-colors"
                >
                  <Mail className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <div className="text-sm">
                    <p className="text-muted-foreground/70 text-xs mb-0.5">Email</p>
                    <p className="font-medium text-foreground">mamdesign@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
