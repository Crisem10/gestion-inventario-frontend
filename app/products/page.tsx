"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductsTable } from "@/components/products-table"
import { ProductForm } from "@/components/product-form"
import { Plus, Search } from "lucide-react"
import type { Product } from "@/lib/types"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  async function fetchProducts() {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
      const res = await fetch(`${API_URL}/api/products`)
      if (!res.ok) {
        const errorBody = await res.text()
        console.error("[v0] /api/products error:", res.status, errorBody)
        setProducts([])
        setFilteredProducts([])
        return
      }

      const data = await res.json()
      if (!Array.isArray(data)) {
        console.error("[v0] /api/products datos no son array:", data)
        setProducts([])
        setFilteredProducts([])
        return
      }

      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error("[v0] Error obteniendo productos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.category_name?.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, products])

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground mt-2">Administra el inventario de productos</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
            Agregar producto
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, SKU o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      ) : (
        <ProductsTable products={filteredProducts} onUpdate={fetchProducts} />
      )}

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar nuevo producto</DialogTitle>
            <DialogDescription>Ingresa la información del producto</DialogDescription>
          </DialogHeader>
          <ProductForm
            onSuccess={() => {
              setIsCreating(false)
              fetchProducts()
            }}
            onCancel={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
