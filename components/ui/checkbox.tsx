import React from "react";
import clsx from "clsx";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: boolean;
  errorMessage?: string;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full space-y-1 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className={clsx(
              "h-4 w-4",
              "appearance-none",
              "rounded-[var(--radius-check-box)]",
              "border",
              "bg-[var(--color-input)]",
              "checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)]",
              "focus:outline-none focus:ring-2 focus:border-transparent",
              error
                ? "border-[var(--color-destructive)] focus:ring-[var(--color-destructive)]"
                : "border-[var(--color-border)] focus:ring-[var(--color-primary)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "relative",
              "after:content-['✓'] after:text-white after:text-xs after:absolute after:inset-0 after:flex after:items-center after:justify-center after:opacity-0 checked:after:opacity-100",
              className
            )}
            aria-invalid={error}
            aria-describedby={errorMessage ? "checkbox-error-text" : undefined}
            {...props}
          />
          {label && (
            <span className="text-[var(--foreground)]">{label}</span>
          )}
        </label>

        {error && errorMessage && (
          <p
            id="checkbox-error-text"
            className="text-xs text-[var(--color-destructive)]"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;