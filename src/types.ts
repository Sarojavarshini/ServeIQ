export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  calories: number;
  tags: string[];
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  instructions?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  // ✅ Inga 'ready', 'delivered' thookittu 'completed', 'cancelled' add panniruken
  // ஏன்னா App.tsx-la 'cancelled' filter use panreenga.
  status: 'pending' | 'preparing' | 'completed' | 'cancelled'; 
  timestamp: Date;
  priority: 'normal' | 'high';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
}
