import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Settings } from "lucide-react"
import type { StockMovement } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface RecentMovementsProps {
  movements: StockMovement[]
}

export function RecentMovements({ movements }: RecentMovementsProps) {
  const getMovementIcon = (type: string) => {
    switch (type) {
      case "IN":
        return <ArrowDown className="h-4 w-4 text-green-600" />
      case "OUT":
        return <ArrowUp className="h-4 w-4 text-red-600" />
      default:
        return <Settings className="h-4 w-4 text-blue-600" />
    }
  }

  const getMovementBadge = (type: string) => {
    switch (type) {
      case "IN":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Entrada
          </Badge>
        )
      case "OUT":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Salida
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Ajuste
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimientos recientes de inventario</CardTitle>
        <CardDescription>Últimos cambios en el inventario</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {movements.map((movement) => (
            <div key={movement.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  {getMovementIcon(movement.movement_type)}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{movement.product_name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{movement.notes || "Sin notas"}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {getMovementBadge(movement.movement_type)}
                <span className="text-sm font-medium">
                  {movement.movement_type === "OUT" ? "-" : "+"}
                  {Math.abs(movement.quantity)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(movement.created_at), { addSuffix: true, locale: es })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
