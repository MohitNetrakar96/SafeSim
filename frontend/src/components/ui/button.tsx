import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105",
                outline:
                    "border-2 border-white/20 backdrop-blur-xl bg-white/5 text-white hover:bg-white/10 hover:border-white/30",
                ghost: "hover:bg-white/10 text-white",
                metamask:
                    "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-10 px-4 py-2 text-sm",
                lg: "h-14 px-8 py-4 text-lg",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
