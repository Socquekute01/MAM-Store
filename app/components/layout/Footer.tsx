import { Instagram, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <a href="#" className="font-serif text-2xl tracking-[0.3em] font-light mb-8">
            LACY STUDIO
          </a>

          {/* Social Links */}
          <div className="flex items-center gap-6 mb-8">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a
              href="mailto:hello@lacystudio.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>

          {/* Contact Info */}
          <div className="font-sans text-sm text-muted-foreground space-y-1 mb-8">
            <p>Hanoi, Vietnam</p>
            <p>hello@lacystudio.com</p>
          </div>

          {/* Copyright */}
          <p className="font-sans text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Lacy Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
