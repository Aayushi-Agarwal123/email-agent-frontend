import * as React from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  /** The hint text shown on hover/focus. */
  label: React.ReactNode
  /** The trigger; should be a focusable element for keyboard users. */
  children: React.ReactNode
  side?: 'top' | 'bottom'
  className?: string
}

/**
 * Dependency-free tooltip (the project hand-rolls its primitives rather than
 * pulling in Radix). Shows on hover and on keyboard focus-within; CSS-only, so
 * there is no portal — keep triggers out of `overflow-hidden` containers.
 */
export function Tooltip({ label, children, side = 'top', className }: TooltipProps) {
  return (
    <span className="group/tt relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 z-50 w-max max-w-[220px] -translate-x-1/2',
          'whitespace-normal rounded-md border bg-popover px-2 py-1 text-left text-xs font-normal',
          'text-popover-foreground opacity-0 shadow-md transition-opacity duration-150',
          'group-hover/tt:opacity-100 group-focus-within/tt:opacity-100',
          side === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
          className,
        )}
      >
        {label}
      </span>
    </span>
  )
}
