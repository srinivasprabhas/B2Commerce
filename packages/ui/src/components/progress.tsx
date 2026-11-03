import type * as React from "react"
import { cn } from "../lib/utils"

function Progress({
  value = 0,
  className,
  indicatorClassName,
  ...props
}: React.ComponentProps<"div"> & { value?: number; indicatorClassName?: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      className={cn("relative flex h-1 w-full items-center overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className={cn("h-full bg-primary transition-all", indicatorClassName)}
        style={{ width: `${v}%` }}
      />
    </div>
  )
}

export { Progress }
