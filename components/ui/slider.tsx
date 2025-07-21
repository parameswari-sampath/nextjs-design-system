import React from "react";
import clsx from "clsx";

type SliderProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: boolean;
  errorMessage?: string;
};

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full space-y-1 text-sm">
        {label && (
          <label className="text-[var(--foreground)] font-medium">{label}</label>
        )}
        <input
          ref={ref}
          type="range"
          className={clsx(
            "w-full h-2 appearance-none cursor-pointer rounded-[var(--radius)]",
            "bg-[var(--color-gray-200)]",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            error
              ? "focus:ring-[var(--color-destructive)]"
              : "focus:ring-[var(--color-primary)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            // Webkit thumb styling
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:h-5",
            "[&::-webkit-slider-thumb]:w-5",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-white",
            "[&::-webkit-slider-thumb]:border-2",
            error 
              ? "[&::-webkit-slider-thumb]:border-[var(--color-destructive)]"
              : "[&::-webkit-slider-thumb]:border-[var(--color-primary)]",
            "[&::-webkit-slider-thumb]:cursor-pointer",
            "[&::-webkit-slider-thumb]:transition-all",
            "[&::-webkit-slider-thumb]:hover:scale-110",
            // Firefox thumb styling
            "[&::-moz-range-thumb]:appearance-none",
            "[&::-moz-range-thumb]:h-5",
            "[&::-moz-range-thumb]:w-5",
            "[&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:bg-white",
            "[&::-moz-range-thumb]:border-2",
            error 
              ? "[&::-moz-range-thumb]:border-[var(--color-destructive)]"
              : "[&::-moz-range-thumb]:border-[var(--color-primary)]",
            "[&::-moz-range-thumb]:cursor-pointer",
            "[&::-moz-range-thumb]:transition-all",
            // Firefox track styling
            "[&::-moz-range-track]:bg-[var(--color-gray-200)]",
            "[&::-moz-range-track]:h-2",
            "[&::-moz-range-track]:rounded-[var(--radius)]",
            className
          )}
          aria-invalid={error}
          aria-describedby={errorMessage ? "slider-error-text" : undefined}
          {...props}
        />
        {error && errorMessage && (
          <p
            id="slider-error-text"
            className="text-xs text-[var(--color-destructive)]"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";
export default Slider;