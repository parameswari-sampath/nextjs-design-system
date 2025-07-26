import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  errorMessage?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <input
          ref={ref}
          className={clsx(
            "w-full",
            "px-3 py-1.5",
            "text-sm",
            "rounded-[var(--radius)]",
            "appearance-none",
            "bg-[var(--color-input)]",
            "text-[var(--foreground)]",
            "border",
            "placeholder:text-[var(--color-muted-foreground)]",
            "focus:outline-none focus:ring-2 focus:border-transparent",
            error
              ? "border-[var(--color-destructive)] focus:ring-[var(--color-destructive)]"
              : "border-[var(--color-border)] focus:ring-[var(--color-primary)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          aria-invalid={error}
          aria-describedby={errorMessage ? "input-error-text" : undefined}
          {...props}
        />
        {error && errorMessage && (
          <p
            id="input-error-text"
            className="text-xs text-[var(--color-destructive)]"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
