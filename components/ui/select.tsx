import React from "react";
import clsx from "clsx";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
  errorMessage?: string;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <div className="relative">
          <select
            ref={ref}
            className={clsx(
              "w-full",
              "px-3 py-1.5 pr-10", // Added pr-10 for arrow space
              "text-sm",
              "rounded-[var(--radius)]",
              "appearance-none", // key for Safari
              "bg-[var(--color-input)]",
              "text-[var(--foreground)]",
              "border",
              "cursor-pointer",
              "focus:outline-none focus:ring-2 focus:border-transparent",
              error
                ? "border-[var(--color-destructive)] focus:ring-[var(--color-destructive)]"
                : "border-[var(--color-border)] focus:ring-[var(--color-primary)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            aria-invalid={error}
            aria-describedby={errorMessage ? "select-error-text" : undefined}
            {...props}
          >
            {children}
          </select>
          {/* Down arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-4 w-4 text-[var(--color-muted-foreground)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && errorMessage && (
          <p
            id="select-error-text"
            className="text-xs text-[var(--color-destructive,#e2445c)]"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
