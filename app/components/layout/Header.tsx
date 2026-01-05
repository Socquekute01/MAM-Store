import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Về chúng tôi', href: '/#about' },
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Thiết kế', href: '/design' },
    { label: 'Thi công', href: '/construction' },
    { label: 'Dịch vụ', href: '/#pricing' },
    { label: 'Liên hệ', href: '/#contact' },
  ];

  const renderNavLink = (link: (typeof navLinks)[0], onClick?: () => void) => {
    const isInternalPage = link.href.startsWith('/') && !link.href.includes('#');

    if (isInternalPage) {
      return (
        <Link key={link.label} to={link.href} className="nav-link" onClick={onClick}>
          {link.label}
        </Link>
      );
    }

    return (
      <a key={link.label} href={link.href} className="nav-link" onClick={onClick}>
        {link.label}
      </a>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-layout/95 backdrop-blur-sm py-4' : 'bg-layout/95 backdrop-blur-sm py-4'
        // isScrolled ? 'bg-background/95 backdrop-blur-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="font-serif text-xl md:text-2xl tracking-[0.3em] font-light">
            <img
              width="160"
              height="194"
              src="https://mamvietnam.vn/wp-content/uploads/2025/07/mam-logo.webp"
              alt="MAM DESIGN – Thiết kế và thi công nội thất"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">{navLinks.map((link) => renderNavLink(link))}</nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen ? 'max-h-96 pt-6' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-4 pb-4">
            {navLinks.map((link) => renderNavLink(link, () => setIsMobileMenuOpen(false)))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
