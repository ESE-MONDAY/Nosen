import * as React from "react"
import { cn } from "../../lib/utils"
import { useTheme } from "../../app/contexts/ThemeContext"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const { theme } = useTheme();
    
    const variantClasses = {
      default: theme === 'dark' 
        ? "bg-emerald-600 text-white border-emerald-500" 
        : "bg-emerald-600 text-white border-emerald-500",
      secondary: theme === 'dark'
        ? "bg-slate-700 text-slate-200 border-slate-600"
        : "bg-slate-100 text-slate-700 border-slate-300",
      destructive: theme === 'dark'
        ? "bg-red-600 text-white border-red-500"
        : "bg-red-600 text-white border-red-500",
      outline: theme === 'dark'
        ? "border-2 border-slate-600 text-slate-300 bg-transparent"
        : "border-2 border-slate-300 text-slate-700 bg-transparent",
      success: theme === 'dark'
        ? "bg-green-600 text-white border-green-500"
        : "bg-green-600 text-white border-green-500"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-xl border px-3 py-1.5 text-sm font-medium transition-all duration-200",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
