import React from "react";
import clsx from "clsx";

type ToggleProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, label, error, errorMessage, checked = false, onChange, ...props }, ref) => {
    return (
      <div className="w-full space-y-1 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            ref={ref}
            className={clsx(
              "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              checked 
                ? "bg-[var(--color-primary)] border-[var(--color-primary)]" 
                : "bg-[var(--color-gray-100)] border-[var(--color-border)]",
              error && !checked && "border-[var(--color-destructive)]",
              "focus-visible:ring-[var(--color-primary)]",
              className
            )}
            onClick={() => onChange?.(!checked)}
            aria-invalid={error}
            aria-describedby={errorMessage ? "toggle-error-text" : undefined}
            {...props}
          >
            <span
              className={clsx(
                "pointer-events-none block h-3.5 w-3.5 rounded-full bg-white border border-[var(--color-border)] ring-0 transition-transform ml-0.5",
                checked ? "translate-x-3.5" : "translate-x-0"
              )}
            />
          </button>
          {label && (
            <span className="text-[var(--foreground)]">{label}</span>
          )}
        </label>

        {error && errorMessage && (
          <p
            id="toggle-error-text"
            className="text-xs text-[var(--color-destructive)]"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";
export default Toggle;