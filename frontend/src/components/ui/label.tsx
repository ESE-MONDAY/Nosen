import * as React from "react"
import { cn } from "../../lib/utils"
import { useTheme } from "../../app/contexts/ThemeContext"

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    const { theme } = useTheme();
    
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block",
          theme === 'dark' ? "text-slate-200" : "text-slate-700",
          className
        )}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
