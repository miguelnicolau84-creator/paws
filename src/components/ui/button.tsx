import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] px-5',
  {
    variants: {
      variant: {
        default: 'bg-warm-500 text-white hover:bg-warm-600 active:scale-[0.98] shadow-sm',
        secondary: 'bg-sage-100 text-sage-800 hover:bg-sage-200',
        outline: 'border-2 border-sage-200 bg-white hover:bg-sage-50 text-sage-800',
        ghost: 'hover:bg-sage-100 text-sage-700',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-600 text-white hover:bg-green-700',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-3 text-xs rounded-lg min-h-[36px]',
        lg: 'h-14 px-8 text-base rounded-2xl min-h-[56px]',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
