// Tipos do sistema FotoStock

export type UserRole = 'admin' | 'owner' | 'manager' | 'employee';

export type Plan = 'free' | 'simple' | 'pro' | 'annual';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  store_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  owner_id: string;
  store_name: string;
  store_slug: string;
  plan: Plan;
  plan_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description?: string;
  price: number;
  promotional_price?: number;
  stock_quantity: number;
  shelf_location?: string;
  barcode?: string;
  image_url?: string;
  image_original_url?: string;
  background_removed: boolean;
  invoice_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  store_id: string;
  product_id?: string;
  sold_by?: string;
  quantity: number;
  sale_price: number;
  sale_date: string;
  created_at: string;
}

export interface Background {
  id: string;
  name: string;
  url: string;
  category: 'simple' | 'elegant' | 'neutral';
  created_at: string;
}

export interface Notification {
  id: string;
  store_id: string;
  user_id?: string;
  type: 'low_stock' | 'best_seller' | 'slow_moving';
  message: string;
  read: boolean;
  created_at: string;
}

export interface PlanDetails {
  name: string;
  price: number;
  limit: number;
  features: string[];
}

export const PLANS: Record<Plan, PlanDetails> = {
  free: {
    name: 'Grátis',
    price: 0,
    limit: 50,
    features: ['50 produtos', 'Catálogo público', 'Vendas básicas']
  },
  simple: {
    name: 'Simples',
    price: 29,
    limit: 500,
    features: ['500 produtos', 'Catálogo público', 'Vendas completas', 'Estatísticas']
  },
  pro: {
    name: 'Pro',
    price: 59,
    limit: -1, // ilimitado
    features: ['Produtos ilimitados', 'Catálogo público', 'Vendas completas', 'Estatísticas avançadas', 'Notificações']
  },
  annual: {
    name: 'Anual',
    price: 590,
    limit: -1, // ilimitado
    features: ['Produtos ilimitados', 'Catálogo público', 'Vendas completas', 'Estatísticas avançadas', 'Notificações', '2 meses grátis']
  }
};
