import { cn } from "../lib/utils"

export function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'outline' | 'danger' | 'success' }) {
  const variants = {
    default: "bg-slate-900 text-white shadow-sm",
    secondary: "bg-slate-100 text-slate-900",
    outline: "text-slate-900 border border-slate-200",
    danger: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
  }
  return (
    <div className={cn("inline-flex items-center rounded-full px-8 py-4 text-xs font-semibold transition-normal", variants[variant], className)} {...props} />
  )
}

export function Avatar({ className, src, alt, fallback }: { className?: string, src?: string, alt?: string, fallback: string }) {
  return (
    <div className={cn("relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100", className)}>
      {src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs font-medium uppercase">
          {fallback.substring(0, 2)}
        </div>
      )}
    </div>
  )
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-4 bg-slate-100", className)} {...props} />
  )
}
