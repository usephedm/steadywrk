"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-[180ms] ease-[cubic-bezier(0,0,0.2,1)] outline-none select-none focus-visible:ring-2 focus-visible:ring-[#E58A0F]/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#E58A0F] text-white hover:bg-[#CC7408] hover:scale-[1.02] shadow-sm",
        outline: "border-2 border-[#E58A0F] text-[#E58A0F] hover:bg-[#E58A0F] hover:text-white",
        secondary: "bg-[#F5F5F3] text-[#23211D] hover:bg-[#EAE3D8]",
        ghost: "text-[#6B6B66] hover:text-[#E58A0F]",
        destructive: "bg-[#DC2626]/10 text-[#DC2626] hover:bg-[#DC2626]/20",
        link: "text-[#E58A0F] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-8 py-3",
        sm: "h-8 gap-1.5 px-4 py-2 text-[13px]",
        lg: "h-12 gap-2 px-10 py-3.5 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
