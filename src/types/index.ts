import { Product } from '../data/products';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: {
    type: 'credit_card' | 'paypal' | 'other';
    details: Record<string, string>;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  text: string;
  date: string;
} 