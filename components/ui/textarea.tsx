import React from "react";
import clsx from "clsx";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
  errorMessage?: string;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <textarea
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
            "resize-vertical",
            "min-h-[80px]",
            className
          )}
          aria-invalid={error}
          aria-describedby={errorMessage ? "textarea-error-text" : undefined}
          {...props}
        />
        {error && errorMessage && (
          <p
            id="textarea-error-text"
            className="text-xs text-[var(--color-destructive)]"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;