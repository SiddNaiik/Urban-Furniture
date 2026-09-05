export interface Product {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  price: number | string;
  cost?: number | string;
  stock?: number;
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
