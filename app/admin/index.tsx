import Constructions from '@/components/admin/Constructions';
import Conversations from '@/components/admin/Conversations';
import Feedbacks from '@/components/admin/Feedbacks';
import Products from '@/components/admin/Products';
import Profile from '@/components/admin/Profile';
import type { Conversation, Feedback } from '@/components/admin/admin.types';
import SidebarAdmin from '@/components/layout/Sidebar';
import { adminApi } from '@/services/admin.api';
import { useEffect, useState } from 'react';

export default function AdminChatInterface() {
  const [activeTab, setActiveTab] = useState<'conversations' | 'feedback' | 'profile' | 'products' | 'construction'>(
    'conversations',
  );
  // conversation states
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [loadingConversations, setLoadingConversations] = useState(false);
  // feedback states
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  //product states
  const [productView, setProductView] = useState<'categories' | 'products' | 'detail'>('categories');

  // construction states
  useEffect(() => {
    if (activeTab !== 'conversations') return;

    setLoadingConversations(true);
    adminApi.getFeedbacks().then(setFeedbacks);
    adminApi.getConversations().then(setConversations);
    setLoadingConversations(false);

    const timer = setInterval(() => {
      adminApi.getFeedbacks().then(setFeedbacks);
      adminApi.getConversations().then(setConversations);
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <SidebarAdmin
        activeTab={activeTab}
        conversations={conversations}
        feedbacks={feedbacks}
        setActiveTab={setActiveTab}
        setProductView={setProductView}
        setSelectedConversation={setSelectedConversation}
      />
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'conversations' && (
          <Conversations
            conversations={conversations}
            selectedConversation={selectedConversation}
            setConversations={setConversations}
            setSelectedConversation={setSelectedConversation}
            loadingConversations={loadingConversations}
          />
        )}
        {activeTab === 'feedback' && <Feedbacks setFeedbacks={setFeedbacks} feedbacks={feedbacks} />}
        {activeTab === 'construction' && <Constructions />}
        {activeTab === 'products' && <Products productView={productView} setProductView={setProductView} />}
        {activeTab === 'profile' && <Profile />}
      </div>
    </div>
  );
}
