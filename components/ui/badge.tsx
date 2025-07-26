import React from "react";
import clsx from "clsx";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "destructive" | "info" | "secondary";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: BadgeVariant;
  children: React.ReactNode;
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "inline-flex items-center rounded-[var(--radius)] px-3 py-1 text-xs font-medium transition-colors",
          {
            // Default variant
            "bg-[var(--color-card)] text-[var(--color-card-foreground)] border border-[var(--color-border)]": variant === "default",
            
            // Primary variant
            "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]": variant === "primary",
            
            // Secondary variant
            "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] border border-[var(--color-border)]": variant === "secondary",
            
            // Success variant
            "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20": variant === "success",
            
            // Warning variant
            "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20": variant === "warning",
            
            // Destructive/Error variant
            "bg-[var(--color-destructive)]/10 text-[var(--color-destructive)] border border-[var(--color-destructive)]/20": variant === "destructive",
            
            // Info variant
            "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20": variant === "info",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;