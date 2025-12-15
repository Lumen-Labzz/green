export interface CartItem {
  product: string;
  qty: number;
  total: number;
}

export interface OrderRequestBody {
  cart: CartItem[];
  total: number;
  notes?: string;
  phone?: string;
}
