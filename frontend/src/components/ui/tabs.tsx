import * as React from "react"
import { cn } from "../../lib/utils"
import { useTheme } from "../../app/contexts/ThemeContext"

export interface TabsProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  defaultValue?: string
}

const Tabs = ({ value, onValueChange, children, defaultValue }: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || "")
  
  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div className="w-full">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            activeTab,
            onTabChange: handleTabChange
          } as any)
        }
        return child
      })}
    </div>
  )
}

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-xl p-1 transition-all duration-200",
        theme === 'dark' 
          ? "bg-slate-800 text-slate-400" 
          : "bg-slate-100 text-slate-600",
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string
    activeTab?: string
    onTabChange?: (value: string) => void
  }
>(({ className, value, activeTab, onTabChange, ...props }, ref) => {
  const { theme } = useTheme();
  
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        activeTab === value
          ? theme === 'dark'
            ? "bg-slate-700 text-white shadow-sm"
            : "bg-white text-slate-900 shadow-sm"
          : theme === 'dark'
            ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200",
        className
      )}
      onClick={() => onTabChange?.(value)}
      {...props}
    />
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
    activeTab?: string
  }
>(({ className, value, activeTab, ...props }, ref) => {
  if (activeTab !== value) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "mt-4 transition-all duration-200",
        className
      )}
      {...props}
    />
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
