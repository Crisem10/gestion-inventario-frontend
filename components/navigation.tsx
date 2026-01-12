"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, FolderTree, Truck } from "lucide-react"

const navItems = [
  {
    name: "Panel",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Productos",
    href: "/products",
    icon: Package,
  },
  {
    name: "Categorías",
    href: "/categories",
    icon: FolderTree,
  },
  {
    name: "Proveedores",
    href: "/suppliers",
    icon: Truck,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
