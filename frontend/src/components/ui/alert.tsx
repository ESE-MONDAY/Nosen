import * as React from "react"
import { cn } from "../../lib/utils"
import { useTheme } from "../../app/contexts/ThemeContext"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning"
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const { theme } = useTheme();
    
    const variantClasses = {
      default: theme === 'dark'
        ? "border-slate-600 bg-slate-800/50 text-slate-200"
        : "border-slate-200 bg-slate-50 text-slate-700",
      destructive: theme === 'dark'
        ? "border-red-600 bg-red-900/30 text-red-200"
        : "border-red-200 bg-red-50 text-red-700",
      success: theme === 'dark'
        ? "border-green-600 bg-green-900/30 text-green-200"
        : "border-green-200 bg-green-50 text-green-700",
      warning: theme === 'dark'
        ? "border-yellow-600 bg-yellow-900/30 text-yellow-200"
        : "border-yellow-200 bg-yellow-50 text-yellow-700"
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-xl border-2 p-4 transition-all duration-200",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  
  return (
    <h5
      ref={ref}
      className={cn(
        "mb-2 font-semibold leading-none tracking-tight",
        theme === 'dark' ? "text-white" : "text-slate-900",
        className
      )}
      {...props}
    />
  )
})
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  
  return (
    <div
      ref={ref}
      className={cn(
        "text-sm leading-relaxed",
        theme === 'dark' ? "text-slate-300" : "text-slate-600",
        className
      )}
      {...props}
    />
  )
})
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
