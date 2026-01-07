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
import { SupplierForm } from "@/components/supplier-form"
import { Plus, Pencil, Trash2, Package, Mail, Phone, MapPin } from "lucide-react"
import type { Supplier } from "@/lib/types"

interface SupplierWithCount extends Supplier {
  product_count: number
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierWithCount[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<SupplierWithCount | null>(null)
  const [deletingSupplier, setDeletingSupplier] = useState<SupplierWithCount | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function fetchSuppliers() {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
      const res = await fetch(`${API_URL}/api/suppliers`)
      const data = await res.json()
      setSuppliers(data)
    } catch (error) {
      console.error("[v0] Error obteniendo proveedores:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  async function handleDelete() {
    if (!deletingSupplier) return

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
      const res = await fetch(`${API_URL}/api/suppliers/${deletingSupplier.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Error al eliminar el proveedor")

      fetchSuppliers()
      setDeletingSupplier(null)
    } catch (error) {
      console.error("[v0] Error eliminando proveedor:", error)
      alert("Error al eliminar el proveedor")
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-muted-foreground mt-2">Administra los proveedores de productos</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
            Agregar proveedor
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando proveedores...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-balance">{supplier.name}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingSupplier(supplier)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeletingSupplier(supplier)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>
                      {supplier.product_count} {supplier.product_count === 1 ? "producto" : "productos"}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {supplier.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{supplier.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {suppliers.length === 0 && (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No hay proveedores. Agrega tu primer proveedor.</p>
              </div>
          )}
        </div>
      )}

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar nuevo proveedor</DialogTitle>
            <DialogDescription>Agrega un nuevo proveedor a tu sistema</DialogDescription>
          </DialogHeader>
          <SupplierForm
            onSuccess={() => {
              setIsCreating(false)
              fetchSuppliers()
            }}
            onCancel={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingSupplier} onOpenChange={() => setEditingSupplier(null)}>
          <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar proveedor</DialogTitle>
            <DialogDescription>Actualiza la información del proveedor</DialogDescription>
          </DialogHeader>
          {editingSupplier && (
            <SupplierForm
              supplier={editingSupplier}
              onSuccess={() => {
                setEditingSupplier(null)
                fetchSuppliers()
              }}
              onCancel={() => setEditingSupplier(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingSupplier} onOpenChange={() => setDeletingSupplier(null)}>
          <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará el proveedor "{deletingSupplier?.name}". Los productos de este proveedor no serán eliminados,
              pero ya no estarán asociados con este proveedor.
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
