import ChatBubble from '@/components/chat/ChatBubble';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ZaloBubble from '@/components/zalo';
import { Outlet } from 'react-router';

function RootLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
        <ZaloBubble />
        <ChatBubble />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
