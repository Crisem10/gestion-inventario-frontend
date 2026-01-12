"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CategoryForm } from "@/components/category-form"
import { Plus, Pencil, Trash2, Package } from "lucide-react"
import type { Category } from "@/lib/types"

interface CategoryWithCount extends Category {
  product_count: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithCount | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function fetchCategories() {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
      const res = await fetch(`${API_URL}/api/categories`)
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("[v0] Error obteniendo categorías:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  async function handleDelete() {
    if (!deletingCategory) return

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
      const res = await fetch(`${API_URL}/api/categories/${deletingCategory.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Error al eliminar la categoría")

      fetchCategories()
      setDeletingCategory(null)
    } catch (error) {
      console.error("[v0] Error eliminando categoría:", error)
      alert("Error al eliminar la categoría")
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground mt-2">Organiza tus productos con categorías</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
            Agregar categoría
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando categorías...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingCategory(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeletingCategory(category)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{category.description || "Sin descripción"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                    <span>
                    {category.product_count} {category.product_count === 1 ? "producto" : "productos"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          {categories.length === 0 && (
              <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No hay categorías. Crea tu primera categoría.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar nueva categoría</DialogTitle>
            <DialogDescription>Crea una nueva categoría para organizar tus productos</DialogDescription>
          </DialogHeader>
          <CategoryForm
            onSuccess={() => {
              setIsCreating(false)
              fetchCategories()
            }}
            onCancel={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar categoría</DialogTitle>
            <DialogDescription>Actualiza la información de la categoría</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              category={editingCategory}
              onSuccess={() => {
                setEditingCategory(null)
                fetchCategories()
              }}
              onCancel={() => setEditingCategory(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
          <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará la categoría "{deletingCategory?.name}". Los productos en esta categoría no serán eliminados,
              pero ya no estarán asociados con esta categoría.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
