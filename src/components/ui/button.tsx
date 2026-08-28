import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - Gradient button (Guide: gradient 135deg #6C3FF5 → #5B2FE5)
        default: "bg-[linear-gradient(135deg,#6C3FF5_0%,#5B2FE5_100%)] text-white shadow-[0_4px_16px_rgba(108,63,245,0.3)] hover:shadow-[0_8px_24px_rgba(108,63,245,0.4)] hover:-translate-y-0.5 active:translate-y-0",
        
        // Secondary - Outline (Guide: 2px solid #6C3FF5, hover bg rgba)
        secondary: "border-2 border-[#6C3FF5] bg-transparent text-[#6C3FF5] hover:bg-[rgba(108,63,245,0.08)]",
        
        // Ghost Button (Guide: transparent, hover bg)
        ghost: "bg-transparent text-muted-foreground hover:bg-[rgba(108,63,245,0.08)] hover:text-[#6C3FF5]",
        
        // CTA Premium Gold (Guide: gradient #FFD700 → #FFB84D, shadow)
        gold: "bg-[linear-gradient(135deg,#FFD700_0%,#FFB84D_100%)] text-[#0A0E27] font-bold shadow-[0_8px_24px_rgba(255,184,77,0.4)] hover:shadow-[0_12px_32px_rgba(255,184,77,0.5)] hover:-translate-y-0.5 active:translate-y-0",
        
        // Destructive
        destructive: "bg-[#FF4757] text-white hover:bg-[#FF4757]/90",
        
        // Outline
        outline: "border-2 border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
        
        // Link
        link: "text-[#6C3FF5] underline-offset-4 hover:underline",
        
        // Glass Effect
        glass: "bg-[rgba(21,25,50,0.8)] backdrop-blur-[20px] text-foreground border border-[rgba(45,51,82,0.5)] hover:bg-[rgba(30,36,66,0.9)]",
        
        // Success
        success: "bg-[#00C896] text-white hover:bg-[#00C896]/90",
        
        // Cyan accent
        cyan: "bg-[linear-gradient(135deg,#00E5FF_0%,#00B8CC_100%)] text-[#0A0E27] font-bold hover:shadow-[0_8px_24px_rgba(0,229,255,0.3)]",
      },
      size: {
        // Sizes from Guide: sm 36px, md 44px, lg 52px, xl 60px
        sm: "h-9 px-4 py-2 text-sm rounded-lg",
        default: "h-11 px-6 py-3 text-base",
        lg: "h-[52px] px-8 py-4 text-base rounded-xl",
        xl: "h-[60px] px-10 py-5 text-lg rounded-2xl",
        icon: "h-11 w-11 rounded-xl",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
