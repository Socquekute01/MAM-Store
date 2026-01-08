import About from '@/components/landing/About';
import About2 from '@/components/landing/About2';
import About3 from '@/components/landing/About3';
import Contact from '@/components/landing/Contact';
import Hero from '@/components/landing/Hero';
import Portfolio from '@/components/landing/Portfolio';
import Pricing from '@/components/landing/Pricing';
import '@/css/chat.css';

export default function Index() {
  return (
    <>
      <Hero />
      <About />
      <About2 />
      <About3 />
      <Portfolio />
      <Pricing />
      <Contact />
    </>
  );
}
