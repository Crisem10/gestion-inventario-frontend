"use client"

import { useEffect } from "react"

export default function ErrorListener() {
  useEffect(() => {
    function handleError(e: ErrorEvent) {
      // Registra el error con contexto útil
      // e.error puede ser undefined para algunos fallos de recursos (Event)
      console.error("[v0] window error event:", e.error ?? e.message, e)
    }

    function handleRejection(e: PromiseRejectionEvent) {
      try {
        console.error("[v0] unhandledrejection:", e.reason)

        // Si la razón del rechazo es un Evento DOM (ej. error de carga de recurso),
        // intenta extraer el recurso que falló e impide el overlay por defecto.
        if (e.reason instanceof Event) {
          const target: any = (e.reason as any).target || (e.reason as any).srcElement
          if (target) {
            const info = {
              tagName: target.tagName,
              src: target.src || target.href,
              outerHTML: typeof target.outerHTML === "string" ? target.outerHTML.slice(0, 300) : undefined,
            }
            console.error("[v0] Resource error event info:", info)
          }
          // Impide el manejo por defecto del navegador/overlay para este rechazo
          e.preventDefault()
        }
      } catch (err) {
        // Registro de mejor esfuerzo
        console.error("[v0] Error in rejection handler:", err)
      }
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  return null
}
