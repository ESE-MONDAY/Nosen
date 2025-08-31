import * as React from "react"
import { cn } from "../../lib/utils"
import { useTheme } from "../../app/contexts/ThemeContext"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const { theme } = useTheme();
    
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border-2 px-4 py-3 text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          theme === 'dark'
            ? "bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
            : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
