import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'role'> {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => (
    <button
      type="button"
      role="switch"
      aria-checked={props.checked}
      data-state={props.checked ? 'checked' : 'unchecked'}
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        className,
      )}
      onClick={() => {
        props.onChange?.({ target: { checked: !props.checked } } as React.ChangeEvent<HTMLInputElement>)
      }}
      disabled={props.disabled}
    >
      <span
        data-state={props.checked ? 'checked' : 'unchecked'}
        className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      />
      <input type="checkbox" className="sr-only" ref={ref} {...props} />
    </button>
  ),
)
Switch.displayName = 'Switch'

export { Switch }
