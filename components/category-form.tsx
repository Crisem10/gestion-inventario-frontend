"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Category } from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
const categorySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
})

interface CategoryFormProps {
  category?: Category
  onSuccess: () => void
  onCancel: () => void
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  })

  async function onSubmit(values: z.infer<typeof categorySchema>) {
    setIsLoading(true)
    try {
      const url = category ? `${API_URL}/api/categories/${category.id}` : `${API_URL}/api/categories`
      const method = category ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Error al guardar la categoría")
      }

      onSuccess()
    } catch (error) {
      console.error("[v0] Error guardando la categoría:", error)
      alert(error instanceof Error ? error.message : "Error al guardar la categoría")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la categoría</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el nombre de la categoría" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Ingrese la descripción de la categoría" {...field} />
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
            {isLoading ? "Guardando..." : category ? "Actualizar categoría" : "Crear categoría"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
