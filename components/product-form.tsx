"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, Category, Supplier } from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  sku: z.string().min(1, "SKU es obligatorio"),
  description: z.string().optional(),
  category_id: z.string().optional(),
  supplier_id: z.string().optional(),
  price: z.string().min(0, "El precio debe ser positivo"),
  stock: z.string().min(0, "El stock debe ser positivo"),
  min_stock: z.string().min(0, "El stock mínimo debe ser positivo"),
  image_url: z.string().url().optional().or(z.literal("")),
})

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
  onCancel: () => void
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      sku: product?.sku || "",
      description: product?.description || "",
      category_id: product?.category_id?.toString() || "",
      supplier_id: product?.supplier_id?.toString() || "",
      price: product?.price?.toString() || "0",
      stock: product?.stock?.toString() || "0",
      min_stock: product?.min_stock?.toString() || "10",
      image_url: product?.image_url || "",
    },
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, suppliersRes] = await Promise.all([
          fetch(`${API_URL}/api/categories`),
          fetch(`${API_URL}/api/suppliers`),
        ])

        if (!categoriesRes.ok) {
          const err = await categoriesRes.text().catch(() => categoriesRes.statusText)
          console.error("[v0] /api/categories error:", categoriesRes.status, err)
          setCategories([])
        } else {
          const categoriesData = await categoriesRes.json()
          if (Array.isArray(categoriesData)) setCategories(categoriesData)
          else {
            console.error("[v0] /api/categories datos no son array:", categoriesData)
            setCategories([])
          }
        }

        if (!suppliersRes.ok) {
          const err = await suppliersRes.text().catch(() => suppliersRes.statusText)
          console.error("[v0] /api/suppliers error:", suppliersRes.status, err)
          setSuppliers([])
        } else {
          const suppliersData = await suppliersRes.json()
          if (Array.isArray(suppliersData)) setSuppliers(suppliersData)
          else {
            console.error("[v0] /api/suppliers datos no son array:", suppliersData)
            setSuppliers([])
          }
        }
      } catch (error) {
        console.error("[v0] Error obteniendo datos del formulario:", error)
      }
    }

    fetchData()
  }, [])

  async function onSubmit(values: z.infer<typeof productSchema>) {
    setIsLoading(true)
    try {
      const payload = {
        ...values,
        category_id: values.category_id ? Number.parseInt(values.category_id) : null,
        supplier_id: values.supplier_id ? Number.parseInt(values.supplier_id) : null,
        price: Number.parseFloat(values.price),
        stock: Number.parseInt(values.stock),
        min_stock: Number.parseInt(values.min_stock),
      }

      const url = product ? `${API_URL}/api/products/${product.id}` : `${API_URL}/api/products`
      const method = product ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Error al guardar el producto")
      }

      onSuccess()
    } catch (error) {
      console.error("[v0] Error guardando el producto:", error)
      alert(error instanceof Error ? error.message : "Error al guardar el producto")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del producto</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Producto ABC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese el SKU" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Ingrese la descripción del producto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="min_stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock mínimo</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de imagen (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : product ? "Actualizar" : "Crear producto"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
