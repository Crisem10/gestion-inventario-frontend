import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query(
      `SELECT s.*, COUNT(p.id) as product_count 
       FROM suppliers s 
       LEFT JOIN products p ON s.id = p.supplier_id 
       GROUP BY s.id 
       ORDER BY s.name ASC`,
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[v0] Error obteniendo proveedores:", error)
    return NextResponse.json({ error: "Error al obtener proveedores" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, address } = body

    const result = await query(
      `INSERT INTO suppliers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, phone, address],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error creando proveedor:", error)
    return NextResponse.json({ error: "Error al crear proveedor" }, { status: 500 })
  }
}
