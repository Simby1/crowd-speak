import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "rounded-xl border border-gray-800 bg-[#222222] text-card-foreground shadow-sm transition-all duration-300",
        "hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:border-cyan-400/30",
        "backdrop-blur-sm",
        className
      )} 
      {...props} 
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "flex flex-col space-y-2 p-6 pb-4",
        className
      )} 
      {...props} 
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 
      className={cn(
        "text-lg font-semibold leading-tight tracking-tight text-gray-100",
        className
      )} 
      {...props} 
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "px-6 pb-6 pt-0",
        className
      )} 
      {...props} 
    />
  );
}


