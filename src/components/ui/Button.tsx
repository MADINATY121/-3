import * as React from "react"
import { cn } from "@/src/lib/utils"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" | "destructive" | "glass", size?: "default" | "sm" | "lg" | "icon" }>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95",
          {
            "bg-gradient-brand hover:opacity-90 text-white shadow-lg shadow-purple-500/25": variant === "default",
            "border-2 border-slate-700 hover:bg-slate-800 text-slate-200": variant === "outline",
            "hover:bg-white/10 text-slate-300": variant === "ghost",
            "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white": variant === "destructive",
            "glass-panel hover:bg-white/10 text-white": variant === "glass",
            "h-12 py-2 px-6 rounded-2xl": size === "default",
            "h-9 px-4 rounded-xl text-sm": size === "sm",
            "h-14 px-8 text-lg rounded-3xl": size === "lg",
            "h-12 w-12 rounded-2xl p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
