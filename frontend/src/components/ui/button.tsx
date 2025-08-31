import * as React from "react"
import { cn } from "../../lib/utils"
import { useTheme } from "../../app/contexts/ThemeContext"

const buttonVariants = {
  variant: {
    default: "bg-emerald-600 hover:bg-emerald-700 text-white",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border-2 border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700 dark:border-slate-600 dark:hover:bg-slate-800 dark:text-slate-300",
    secondary: "bg-slate-600 hover:bg-slate-700 text-white",
    ghost: "hover:bg-slate-100 text-slate-700 dark:hover:bg-slate-800 dark:text-slate-300",
    link: "text-emerald-600 underline hover:text-emerald-700",
  },
  size: {
    default: "h-12 px-6 py-3 text-base font-semibold",
    sm: "h-9 px-4 py-2 text-sm font-medium",
    lg: "h-14 px-8 py-4 text-lg font-semibold",
    icon: "h-12 w-12",
  },
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const { theme } = useTheme();
    
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
