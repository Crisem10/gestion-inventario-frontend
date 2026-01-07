import { StatCard } from "@/components/stat-card"
import { RecentMovements } from "@/components/recent-movements"
import { CategoryChart } from "@/components/category-chart"
import { StockTrendsChart } from "@/components/stock-trends-chart"
import { Package, FolderTree, Truck, AlertTriangle } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/stats`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Error al obtener estadísticas")
    }

    return res.json()
  } catch (error) {
    console.error("[v0] Error obteniendo estadísticas del panel:", error)
    // Retornar valores por defecto en caso de error
    return {
      totalProducts: 0,
      totalCategories: 0,
      totalSuppliers: 0,
      lowStockProducts: 0,
      totalStockValue: 0,
      recentMovements: [],
      categoryDistribution: [],
      stockTrends: [],
    }
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Panel</h1>
        <p className="text-muted-foreground mt-2">Resumen de tu sistema de gestión de inventario</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total de productos"
          value={stats.totalProducts}
          icon={Package}
          description="Productos en inventario"
        />
        <StatCard title="Categorías" value={stats.totalCategories} icon={FolderTree} description="Categorías de productos" />
        <StatCard title="Proveedores" value={stats.totalSuppliers} icon={Truck} description="Proveedores activos" />
        <StatCard
          title="Alerta de stock bajo"
          value={stats.lowStockProducts}
          icon={AlertTriangle}
          description="Productos por debajo del mínimo"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <StockTrendsChart data={stats.stockTrends} />
        <CategoryChart data={stats.categoryDistribution} />
      </div>

      <RecentMovements movements={stats.recentMovements} />
    </div>
  )
}
