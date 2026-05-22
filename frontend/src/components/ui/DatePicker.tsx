import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "../../lib/utils"

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-8 w-full">
        {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
        <div className="relative">
          <CalendarIcon className="absolute left-12 top-12 h-16 w-16 text-slate-400 pointer-events-none" />
          <input
            type="date"
            ref={ref}
            className={cn(
              "flex h-12 w-full rounded-8 border border-slate-200 bg-white pl-36 pr-12 text-sm transition-normal focus:outline-none focus:shadow-focus [appearance:none] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
              className
            )}
            {...props}
          />
        </div>
      </div>
    )
  }
)
DatePicker.displayName = "DatePicker"

export { DatePicker }
