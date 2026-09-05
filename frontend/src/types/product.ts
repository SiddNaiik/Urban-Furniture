export interface Product {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  price: number | string;
  lst_price: number;
  cost?: number | string;
  standard_price?: number;
  stock?: number;
  qty_available: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductInput {
  name: string;
  sku?: string;
  category?: string;
  price?: number | string;
  cost?: number | string;
}
