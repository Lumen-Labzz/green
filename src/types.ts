export interface OrderRequestBody {
  cart: CartItem[];
  total: number;
  notes?: string;
  phone?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}
