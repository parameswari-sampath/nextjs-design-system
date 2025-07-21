import React from "react";
import clsx from "clsx";

type ProgressSize = "sm" | "md" | "lg";

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number;
  max?: number;
  size?: ProgressSize;
  showLabel?: boolean;
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, size = "md", showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: "h-1",
      md: "h-2", 
      lg: "h-3"
    };

    return (
      <div className="w-full space-y-1" {...props}>
        {showLabel && (
          <div className="flex justify-between text-xs text-[var(--color-muted-foreground)]">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={clsx(
            "w-full rounded-[var(--radius)] overflow-hidden bg-[var(--color-secondary)]",
            sizeClasses[size],
            className
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${Math.round(percentage)}% complete`}
        >
          <div
            className="h-full rounded-[var(--radius)] bg-[var(--color-primary)] transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";

export default Progress;