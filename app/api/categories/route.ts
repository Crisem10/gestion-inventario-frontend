import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query(
      `SELECT c.*, COUNT(p.id) as cantidad_productos
       FROM categorias c
       LEFT JOIN productos p ON c.id = p.categoria_id
       GROUP BY c.id
       ORDER BY c.nombre ASC`,
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[v0] Error al obtener categorias:", error)
    return NextResponse.json({ error: "No se pudieron obtener las categorias" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, descripcion } = body

    const result = await query(
      `INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *`,
      [nombre, descripcion]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error al crear categoria:", error)
    if (error.code === "23505") {
      return NextResponse.json({ error: "Ya existe una categoria con ese nombre" }, { status: 400 })
    }
    return NextResponse.json({ error: "No se pudo crear la categoria" }, { status: 500 })
  }
}
