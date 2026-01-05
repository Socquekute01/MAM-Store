type Construction = {
  id: number;
  image: string;
  completed_date: string;
  title: string;
  video_url: string | null;
  created_at: string;
};

type Message = {
  id: number;
  content: string;
  sender: 'bot' | 'guest' | 'admin';
  created_at: string;
  unread_count?: number;
};

type Conversation = {
  id: number;
  guest_id: string;
  status: 'open' | 'closed';
  created_at: string;
  last_message?: string;
  unread_count: number;
};

type Feedback = {
  id: number;
  name: string;
  phone: string;
  message: string;
  area: string;
  created_at: string;
  status: 'new' | 'read';
};

type Category = {
  id: number;
  name: string;
  slug: string;
  product_count: number;
  created_at: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
  image_count: number;
  created_at: string;
};

type ProductImage = {
  id: number;
  image_url: string;
  is_thumbnail: number;
  sort_order: number;
};

type ProductDetail = {
  id: number;
  name: string;
  description: string;
  category_name: string;
  images: ProductImage[];
};

type SidebarAdminType = {
  setActiveTab: (tab: 'conversations' | 'feedback' | 'products' | 'construction' | 'profile') => void;
  setSelectedConversation: (id: number | null) => void;
  activeTab: 'conversations' | 'feedback' | 'products' | 'construction' | 'profile';
  conversations: any[];
  feedbacks: any[];
  setProductView: React.Dispatch<React.SetStateAction<'categories' | 'products' | 'detail'>>;
};

type ConversationsType = {
  selectedConversation: number | null;
  setSelectedConversation: (id: number | null) => void;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  conversations: Conversation[];
  loadingConversations: boolean;
};

type FeedbackType = {
  setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
  feedbacks: Feedback[];
};

type ProductType = {
  productView: 'categories' | 'products' | 'detail';
  setProductView: React.Dispatch<React.SetStateAction<'categories' | 'products' | 'detail'>>;
};

export type {
  Construction,
  Conversation,
  Feedback,
  Category,
  Product,
  ProductImage,
  ProductDetail,
  Message,
  ConversationsType,
  SidebarAdminType,
  FeedbackType,
  ProductType,
};
