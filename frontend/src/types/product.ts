export type ProductType = 'Goods' | 'Service' | 'Combo';

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  category_id: string;
  category?: string; // resolved category name for display
  sales_price: number;
  standard_price?: number;
  cost: number;
  image_url?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}