import React from "react";
import { cn } from "@/lib/utils";

// DatePicker component
export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(({ className, ...props }, ref) => {
  return (
    <input
      type="date"
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
DatePicker.displayName = "DatePicker";

export { DatePicker };