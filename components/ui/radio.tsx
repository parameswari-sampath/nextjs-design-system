import React from "react";
import clsx from "clsx";

type RadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: boolean;
  errorMessage?: string;
};

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full space-y-1 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            ref={ref}
            type="radio"
            className={clsx(
              "h-4 w-4",
              "appearance-none",
              "rounded-full",
              "border",
              "bg-[var(--color-input)]",
              "checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)]",
              "focus:outline-none focus:ring-2 focus:border-transparent",
              error
                ? "border-[var(--color-destructive)] focus:ring-[var(--color-destructive)]"
                : "border-[var(--color-border)] focus:ring-[var(--color-primary)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "relative",
              "after:content-[''] after:w-2 after:h-2 after:bg-white after:rounded-full after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100",
              className
            )}
            aria-invalid={error}
            aria-describedby={errorMessage ? "radio-error-text" : undefined}
            {...props}
          />
          {label && (
            <span className="text-[var(--foreground)]">{label}</span>
          )}
        </label>

        {error && errorMessage && (
          <p
            id="radio-error-text"
            className="text-xs text-[var(--color-destructive)]"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";
export default Radio;