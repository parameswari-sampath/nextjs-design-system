import React from "react";
import clsx from "clsx";

// Spinner Component
type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "warning" | "destructive" | "white";
  variant?: "spin" | "pulse" | "bounce" | "dots";
};

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", color = "primary", variant = "spin", ...props }, ref) => {
    const sizeClasses = {
      xs: "w-3 h-3",
      sm: "w-4 h-4", 
      md: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-12 h-12"
    };

    const colorClasses = {
      primary: "text-[var(--color-primary)]",
      secondary: "text-[var(--color-muted-foreground)]",
      success: "text-[var(--color-green-500)]",
      warning: "text-[var(--color-yellow-500)]",
      destructive: "text-[var(--color-destructive)]",
      white: "text-white"
    };

    if (variant === "spin") {
      return (
        <div
          ref={ref}
          className={clsx(
            "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
            sizeClasses[size],
            colorClasses[color],
            className
          )}
          role="status"
          aria-label="Loading"
          {...props}
        >
          <span className="sr-only">Loading...</span>
        </div>
      );
    }

    if (variant === "pulse") {
      return (
        <div
          ref={ref}
          className={clsx(
            "inline-block rounded-full animate-pulse",
            sizeClasses[size],
            colorClasses[color],
            "bg-current",
            className
          )}
          role="status"
          aria-label="Loading"
          {...props}
        >
          <span className="sr-only">Loading...</span>
        </div>
      );
    }

    if (variant === "bounce") {
      const dotSize = {
        xs: "w-1 h-1",
        sm: "w-1.5 h-1.5",
        md: "w-2 h-2", 
        lg: "w-2.5 h-2.5",
        xl: "w-3 h-3"
      };

      return (
        <div
          ref={ref}
          className={clsx("inline-flex space-x-1", className)}
          role="status"
          aria-label="Loading"
          {...props}
        >
          <div className={clsx(dotSize[size], "bg-current rounded-full animate-bounce", colorClasses[color])} style={{ animationDelay: "0ms" }}></div>
          <div className={clsx(dotSize[size], "bg-current rounded-full animate-bounce", colorClasses[color])} style={{ animationDelay: "150ms" }}></div>
          <div className={clsx(dotSize[size], "bg-current rounded-full animate-bounce", colorClasses[color])} style={{ animationDelay: "300ms" }}></div>
          <span className="sr-only">Loading...</span>
        </div>
      );
    }

    if (variant === "dots") {
      const dotSize = {
        xs: "w-1 h-1",
        sm: "w-1.5 h-1.5",
        md: "w-2 h-2",
        lg: "w-2.5 h-2.5", 
        xl: "w-3 h-3"
      };

      return (
        <div
          ref={ref}
          className={clsx("inline-flex space-x-1", className)}
          role="status"
          aria-label="Loading"
          {...props}
        >
          <div 
            className={clsx(dotSize[size], "bg-current rounded-full", colorClasses[color])}
            style={{ 
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: "0ms" 
            }}
          ></div>
          <div 
            className={clsx(dotSize[size], "bg-current rounded-full", colorClasses[color])}
            style={{ 
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: "200ms" 
            }}
          ></div>
          <div 
            className={clsx(dotSize[size], "bg-current rounded-full", colorClasses[color])}
            style={{ 
              animation: "pulse 1.5s ease-in-out infinite", 
              animationDelay: "400ms" 
            }}
          ></div>
          <span className="sr-only">Loading...</span>
        </div>
      );
    }

    return null;
  }
);

Spinner.displayName = "Spinner";

// Loading Button Wrapper Component
type LoadingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  spinnerSize?: SpinnerProps["size"];
  spinnerColor?: SpinnerProps["color"];
  children: React.ReactNode;
};

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    className, 
    loading = false, 
    spinnerSize = "sm", 
    spinnerColor = "white", 
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "relative inline-flex items-center justify-center gap-2",
          "px-3 py-2 text-sm font-medium rounded-[var(--radius)]",
          "bg-[var(--color-primary)] text-white border border-[var(--color-primary)]",
          "hover:bg-[var(--color-primary)]/90 hover:border-[var(--color-primary)]/90",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          "transition-colors duration-200",
          className
        )}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <Spinner 
            size={spinnerSize} 
            color={spinnerColor}
            className="mr-1" 
          />
        )}
        <span className={clsx(loading && "opacity-75")}>
          {children}
        </span>
      </button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export default Spinner;
export { LoadingButton };