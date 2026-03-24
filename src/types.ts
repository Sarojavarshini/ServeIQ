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
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  timestamp: Date;
  priority: 'normal' | 'high';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
}
