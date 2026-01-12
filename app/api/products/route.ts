import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query(
      `SELECT p.*, c.name as category_name, s.name as supplier_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       ORDER BY p.created_at DESC`,
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[v0] Error obteniendo productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, sku, description, category_id, supplier_id, price, stock, min_stock, image_url } = body

    const result = await query(
      `INSERT INTO products (name, sku, description, category_id, supplier_id, price, stock, min_stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, sku, description, category_id, supplier_id, price, stock, min_stock, image_url],
    )

    // Registra el movimiento de stock
    await query(`INSERT INTO stock_movements (product_id, quantity, movement_type, notes) VALUES ($1, $2, $3, $4)`, [
      result.rows[0].id,
      stock,
      "IN",
      "Stock inicial",
    ])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error creando producto:", error)
    if (error.code === "23505") {
      return NextResponse.json({ error: "Producto con este SKU ya existe" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
