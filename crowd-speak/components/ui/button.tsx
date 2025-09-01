import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-cyan-500 text-gray-900 hover:bg-cyan-400 focus-visible:ring-cyan-500 shadow-sm hover:shadow-[0_0_10px_rgba(0,255,255,0.4)]",
        outline: "border border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 focus-visible:ring-cyan-500 hover:border-cyan-400/50",
        ghost: "text-gray-300 hover:bg-gray-800 focus-visible:ring-cyan-500",
        link: "text-cyan-400 underline-offset-4 hover:underline focus-visible:ring-cyan-500 hover:text-cyan-300",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm hover:shadow-[0_0_10px_rgba(255,99,71,0.4)]",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
export default Button;


