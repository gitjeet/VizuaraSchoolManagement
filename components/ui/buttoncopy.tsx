import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Define button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean; // Add loading prop to indicate whether the button is in loading state
  progress?: number; // Progress state to indicate upload progress
  onFileInputChange?: (files: FileList | null) => void; // Callback for handling file input change
  fileType?: "image" | "video"; // Specify accepted file type
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, progress = 0, onFileInputChange, fileType = "image", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // Determine classes based on loading state
    const classNames = cn(buttonVariants({ variant, size, className }), {
      "cursor-not-allowed": loading, // Disable cursor when loading
      "opacity-70": loading, // Reduce opacity when loading
    });

    const handleFileInputClick = () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = fileType === "image" ? "image/*" : "video/*"; // Set accept attribute based on fileType prop
      fileInput.multiple = true; // Allow multiple files to be selected
      fileInput.style.display = "none";
      fileInput.addEventListener("change", (event) => {
        const files = (event.target as HTMLInputElement).files;
        if (onFileInputChange && files) {
          onFileInputChange(files);
        }
      });
      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);
    };

    return (
      <Comp
        className={classNames}
        ref={ref}
        disabled={loading} // Disable the button when loading
        onClick={handleFileInputClick} // Trigger file input click event
        {...props}
      >
        {loading ? (
          // Show progress bar and percentage when loading
          <div className="flex items-center justify-between w-full">
            <div className="flex-1 mr-2">
              <div className="w-full h-1 bg-primary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${Math.floor(progress)}%` }} // Set width based on rounded down progress
                ></div>
              </div>
            </div>
            <div className="text-xs font-medium text-gray-500">{Math.floor(progress)}%</div>
          </div>
        ) : (
          // Show button content when not loading
          props.children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
