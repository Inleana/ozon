export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  role: string;
  created_at: string;
  last_login: string | null;
  ozon_client_id: string | null;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface CompetitorPrice {
  id: number;
  marketplace: string;
  price: number | null;
  url: string | null;
  checked_at: string;
}

export interface Product {
  id: number;
  ozon_product_id: string | null;
  article: string | null;
  oem_number: string | null;
  name: string | null;
  brand: string | null;
  category: string | null;
  price: number | null;
  recommended_price: number | null;
  description: string | null;
  characteristics: Record<string, unknown> | null;
  images: string[] | null;
  videos: string[] | null;
  status: string;
  created_at: string;
  updated_at: string | null;
  last_sync_at: string | null;
}

export interface ProductDetail extends Product {
  competitor_prices: CompetitorPrice[];
}

export interface CostBreakdown {
  price: number;
  commission: number;
  acquiring: number;
  logistics: number;
  drop_pvz: number;
  fbs: number;
  fbo: number;
  total: number;
  net_profit: number;
}

export interface WarehouseStock {
  id: number;
  product_id: number;
  warehouse_id: string | null;
  warehouse_name: string | null;
  quantity: number;
  reserved: number;
  available: number;
  updated_at: string;
}

export interface NonLiquid {
  id: number;
  oem_number: string | null;
  article: string | null;
  name: string | null;
  brand: string | null;
  description: string | null;
  is_checked: boolean;
  is_uploaded: boolean;
  price: number | null;
  recommended_price: number | null;
  images: string[] | null;
  status: string;
  created_at: string;
}
