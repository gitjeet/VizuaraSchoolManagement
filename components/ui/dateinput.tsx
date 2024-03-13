import * as React from "react";
import { cn } from "@/lib/utils";

export interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(({ className, ...props }, ref) => {
  return (
    <input
      type="date"
      className={cn(
        "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

DateInput.displayName = "DateInput";

export { DateInput };