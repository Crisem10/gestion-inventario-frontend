export interface Product {
  id: number
  name: string
  sku: string
  description: string | null
  category_id: number | null
  supplier_id: number | null
  price: number
  stock: number
  min_stock: number
  image_url: string | null
  created_at: string
  updated_at: string
  category_name?: string
  supplier_name?: string
}

export interface Category {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: number
  name: string
  email: string | null
  phone: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export interface StockMovement {
  id: number
  product_id: number
  quantity: number
  movement_type: "IN" | "OUT" | "ADJUSTMENT"
  notes: string | null
  created_at: string
  product_name?: string
}

export interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalSuppliers: number
  lowStockProducts: number
  totalStockValue: number
  recentMovements: StockMovement[]
  categoryDistribution: Array<{ name: string; value: number }>
  stockTrends: Array<{ date: string; in: number; out: number }>
}
