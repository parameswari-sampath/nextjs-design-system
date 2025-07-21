import React from "react";
import clsx from "clsx";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "animate-pulse rounded-[var(--radius)] bg-[var(--color-secondary)]",
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export default Skeleton;