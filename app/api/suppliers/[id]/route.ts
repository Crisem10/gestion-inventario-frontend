import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, phone, address } = body

    const result = await query(
      `UPDATE suppliers SET name = $1, email = $2, phone = $3, address = $4 WHERE id = $5 RETURNING *`,
      [name, email, phone, address, id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("[v0] Error actualizando proveedor:", error)
    return NextResponse.json({ error: "Error al actualizar proveedor" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await query(`DELETE FROM suppliers WHERE id = $1 RETURNING *`, [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Proveedor eliminado exitosamente" })
  } catch (error) {
    console.error("[v0] Error eliminando proveedor:", error)
    return NextResponse.json({ error: "Error al eliminar proveedor" }, { status: 500 })
  }
}
