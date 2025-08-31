import * as React from "react"
import { cn } from "../../lib/utils"
import { useTheme } from "../../app/contexts/ThemeContext"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const { theme } = useTheme();
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-xl transition-all duration-200",
          theme === 'dark' ? "bg-slate-700" : "bg-slate-200",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 transition-all duration-300 ease-out",
            theme === 'dark' ? "bg-emerald-500" : "bg-emerald-600"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
