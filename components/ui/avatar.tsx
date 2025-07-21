import React from "react";
import clsx from "clsx";

type AvatarSize = "sm" | "md" | "lg" | "xl";

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm", 
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg"
    };

    return (
      <div
        ref={ref}
        className={clsx(
          "relative inline-flex items-center justify-center overflow-hidden rounded-[var(--radius)] bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] font-medium",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Hide image if it fails to load, show fallback
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
        
        {/* Fallback initials - only show if no image or image fails */}
        {!src && fallback && (
          <span className="select-none uppercase">
            {fallback}
          </span>
        )}
        
        {/* Default fallback icon if no image and no fallback text */}
        {!src && !fallback && (
          <svg
            className="h-1/2 w-1/2 text-[var(--color-muted-foreground)]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;