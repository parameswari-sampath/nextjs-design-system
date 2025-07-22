import React from "react";
import clsx from "clsx";

// Pagination Component
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    showPrevNext = true,
    maxVisiblePages = 5,
    disabled = false,
    size = "md",
    className,
    ...props
  }, ref) => {
    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base"
    };

    const iconSizes = {
      sm: "h-3 w-3",
      md: "h-4 w-4", 
      lg: "h-5 w-5"
    };

    // Generate page numbers to show
    const getVisiblePages = () => {
      const pages: number[] = [];
      const half = Math.floor(maxVisiblePages / 2);
      
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, currentPage + half);
      
      // Adjust if we're near the beginning or end
      if (end - start + 1 < maxVisiblePages) {
        if (start === 1) {
          end = Math.min(totalPages, start + maxVisiblePages - 1);
        } else if (end === totalPages) {
          start = Math.max(1, end - maxVisiblePages + 1);
        }
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    };

    const visiblePages = getVisiblePages();
    const showStartEllipsis = visiblePages[0] > 1;
    const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage && !disabled) {
        onPageChange(page);
      }
    };

    const renderPageButton = (page: number, isActive = false) => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        disabled={disabled || isActive}
        className={clsx(
          "relative inline-flex items-center justify-center",
          "border border-[var(--color-border)] font-medium rounded-[var(--radius)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2",
          "transition-colors duration-200",
          sizeClasses[size],
          isActive
            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] cursor-default"
            : "bg-[var(--color-card)] text-[var(--foreground)] hover:bg-[var(--color-secondary)] hover:border-[var(--color-border)]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-current={isActive ? "page" : undefined}
        aria-label={`Go to page ${page}`}
      >
        {page}
      </button>
    );

    const renderNavButton = (
      direction: "first" | "prev" | "next" | "last",
      targetPage: number,
      isDisabled: boolean,
      children: React.ReactNode
    ) => (
      <button
        onClick={() => handlePageChange(targetPage)}
        disabled={disabled || isDisabled}
        className={clsx(
          "relative inline-flex items-center justify-center",
          "border border-[var(--color-border)] font-medium rounded-[var(--radius)]",
          "bg-[var(--color-card)] text-[var(--foreground)]",
          "hover:bg-[var(--color-secondary)] hover:border-[var(--color-border)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2",
          "transition-colors duration-200",
          sizeClasses[size],
          (disabled || isDisabled) && "opacity-50 cursor-not-allowed"
        )}
        aria-label={
          direction === "first" ? "Go to first page" :
          direction === "prev" ? "Go to previous page" :
          direction === "next" ? "Go to next page" :
          "Go to last page"
        }
      >
        {children}
      </button>
    );

    const renderEllipsis = (key: string) => (
      <span
        key={key}
        className={clsx(
          "relative inline-flex items-center justify-center",
          sizeClasses[size],
          "text-[var(--color-muted-foreground)]"
        )}
      >
        ...
      </span>
    );

    if (totalPages <= 1) return null;

    return (
      <nav
        ref={ref}
        className={clsx("flex items-center justify-center", className)}
        aria-label="Pagination navigation"
        {...props}
      >
        <div className="flex items-center space-x-1">
          {/* First page button */}
          {showFirstLast && (
            <>
              {renderNavButton(
                "first",
                1,
                currentPage === 1,
                <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              )}
            </>
          )}

          {/* Previous page button */}
          {showPrevNext && (
            <>
              {renderNavButton(
                "prev",
                currentPage - 1,
                currentPage === 1,
                <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              )}
            </>
          )}

          {/* Start ellipsis */}
          {showStartEllipsis && renderEllipsis("start")}

          {/* Page numbers */}
          {visiblePages.map(page => renderPageButton(page, page === currentPage))}

          {/* End ellipsis */}
          {showEndEllipsis && renderEllipsis("end")}

          {/* Next page button */}
          {showPrevNext && (
            <>
              {renderNavButton(
                "next",
                currentPage + 1,
                currentPage === totalPages,
                <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </>
          )}

          {/* Last page button */}
          {showFirstLast && (
            <>
              {renderNavButton(
                "last",
                totalPages,
                currentPage === totalPages,
                <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </>
          )}
        </div>
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

// Pagination Info Component
type PaginationInfoProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
};

const PaginationInfo = React.forwardRef<HTMLDivElement, PaginationInfoProps>(
  ({ currentPage, totalPages, totalItems, itemsPerPage, className, ...props }, ref) => {
    const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div
        ref={ref}
        className={clsx(
          "text-sm text-[var(--color-muted-foreground)]",
          className
        )}
        {...props}
      >
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> results
      </div>
    );
  }
);

PaginationInfo.displayName = "PaginationInfo";

// Items Per Page Selector using our custom Select component
type ItemsPerPageProps = {
  value: number;
  options: number[];
  onValueChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
};

// Import Select component inline (we'll need to add import at top)
const ItemsPerPage = React.forwardRef<HTMLDivElement, ItemsPerPageProps>(
  ({ value, options, onValueChange, disabled = false, className, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx("flex items-center gap-2", className)} {...props}>
        <span className="text-sm text-[var(--color-muted-foreground)] whitespace-nowrap">Show</span>
        <div className="w-20 relative">
          <select
            value={value}
            onChange={(e) => onValueChange(Number(e.target.value))}
            disabled={disabled}
            className={clsx(
              "w-full px-3 py-1.5 pr-10 text-sm rounded-[var(--radius)] appearance-none",
              "bg-[var(--color-input)] text-[var(--foreground)] border cursor-pointer",
              "focus:outline-none focus:ring-2 focus:border-transparent",
              "border-[var(--color-border)] focus:ring-[var(--color-primary)]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <span className="text-sm text-[var(--color-muted-foreground)] whitespace-nowrap">per page</span>
      </div>
    );
  }
);

ItemsPerPage.displayName = "ItemsPerPage";

export default Pagination;
export { PaginationInfo, ItemsPerPage };