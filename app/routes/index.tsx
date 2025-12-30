import About from '@/components/landing/About';
import Contact from '@/components/landing/Contact';
import Hero from '@/components/landing/Hero';
import Portfolio from '@/components/landing/Portfolio';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import '@/css/chat.css';

export default function Index() {
  return (
    <>
      <Hero />
      <About />
      <Portfolio />
      <Pricing />
      <Testimonials />
      <Contact />
    </>
  );
}
