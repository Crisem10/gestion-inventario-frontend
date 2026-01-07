"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

interface StockTrendsChartProps {
  data: Array<{ date: string; in: number; out: number }>
}

export function StockTrendsChart({ data }: StockTrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencias de movimiento de stock</CardTitle>
        <CardDescription>Entradas vs salidas de stock en los últimos 7 días</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Bar dataKey="in" fill="#10b981" name="Entradas" radius={[4, 4, 0, 0]} />
            <Bar dataKey="out" fill="#ef4444" name="Salidas" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
