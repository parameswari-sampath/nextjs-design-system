import React from "react";
import clsx from "clsx";

type AlertVariant = "default" | "success" | "warning" | "destructive" | "info";

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  children: React.ReactNode;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={clsx(
          "relative w-full rounded-[var(--radius)] border px-4 py-3 text-sm",
          {
            // Default variant
            "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)]": variant === "default",
            
            // Success variant
            "border-[var(--color-green-600)] bg-[var(--color-green-500)]/10 text-[var(--color-green-700)]": variant === "success",
            
            // Warning variant
            "border-[var(--color-orange-600)] bg-[var(--color-orange-500)]/10 text-[var(--color-orange-600)]": variant === "warning",
            
            // Destructive/Error variant
            "border-[var(--color-destructive)] bg-[var(--color-destructive)]/10 text-[var(--color-red-600)]": variant === "destructive",
            
            // Info variant
            "border-[var(--color-blue-600)] bg-[var(--color-blue-500)]/10 text-[var(--color-blue-700)]": variant === "info",
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

Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={clsx("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx("text-sm opacity-90", className)}
      {...props}
    />
  )
);
AlertDescription.displayName = "AlertDescription";

export default Alert;
export { AlertTitle, AlertDescription };