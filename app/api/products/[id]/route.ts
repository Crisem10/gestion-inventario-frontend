import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await query(
      `SELECT p.*, c.name as category_name, s.name as supplier_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.id = $1`,
      [id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("[v0] Error obteniendo producto:", error)
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, sku, description, category_id, supplier_id, price, stock, min_stock, image_url } = body

    // Obtener el stock actual
    const currentProduct = await query(`SELECT stock FROM products WHERE id = $1`, [id])

    if (currentProduct.rows.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    const oldStock = currentProduct.rows[0].stock
    const stockDiff = stock - oldStock

    // Actualizar producto
    const result = await query(
      `UPDATE products 
       SET name = $1, sku = $2, description = $3, category_id = $4, supplier_id = $5, 
           price = $6, stock = $7, min_stock = $8, image_url = $9
       WHERE id = $10
       RETURNING *`,
      [name, sku, description, category_id, supplier_id, price, stock, min_stock, image_url, id],
    )

    // Registrar movimiento de stock si cambió
    if (stockDiff !== 0) {
      await query(`INSERT INTO stock_movements (product_id, quantity, movement_type, notes) VALUES ($1, $2, $3, $4)`, [
        id,
        stockDiff,
        stockDiff > 0 ? "IN" : "OUT",
        "Ajuste de stock",
      ])
    }

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("[v0] Error actualizando producto:", error)
    if (error.code === "23505") {
      return NextResponse.json({ error: "Producto con este SKU ya existe" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await query(`DELETE FROM products WHERE id = $1 RETURNING *`, [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Producto eliminado exitosamente" })
  } catch (error) {
    console.error("[v0] Error eliminando producto:", error)
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
