import React from "react";
import clsx from "clsx";

type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type BreadcrumbsProps = React.HTMLAttributes<HTMLElement> & {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
};

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ className, items, separator, ...props }, ref) => {
    const defaultSeparator = (
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
          d="M9 5l7 7-7 7"
        />
      </svg>
    );

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb navigation"
        className={clsx("flex items-center text-sm min-w-0", className)}
        {...props}
      >
        <div className="overflow-x-auto">
          <ol className="flex items-center space-x-1 whitespace-nowrap">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              
              return (
                <li key={index} className="flex items-center space-x-1 flex-shrink-0">
                  {item.href || item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className={clsx(
                        "rounded-[var(--radius)] px-2 py-1 transition-colors hover:bg-[var(--color-secondary)] cursor-pointer whitespace-nowrap",
                        isLast
                          ? "text-[var(--foreground)] font-medium"
                          : "text-[var(--color-muted-foreground)] hover:text-[var(--foreground)]"
                      )}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span
                      className={clsx(
                        "px-2 py-1 whitespace-nowrap",
                        isLast
                          ? "text-[var(--foreground)] font-medium"
                          : "text-[var(--color-muted-foreground)]"
                      )}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                  
                  {!isLast && (
                    <span className="flex items-center flex-shrink-0" aria-hidden="true">
                      {separator || defaultSeparator}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    );
  }
);

Breadcrumbs.displayName = "Breadcrumbs";

export default Breadcrumbs;