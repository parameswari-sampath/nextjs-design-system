import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

// Dropdown Context
type DropdownContextType = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined);

const useDropdownContext = () => {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within a Dropdown provider");
  }
  return context;
};

// Main Dropdown Component
type DropdownProps = {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ children, onOpenChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
      const newState = !isOpen;
      setIsOpen(newState);
      onOpenChange?.(newState);
    };

    const handleClose = () => {
      setIsOpen(false);
      onOpenChange?.(false);
    };

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          handleClose();
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isOpen) {
          handleClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen]);

    return (
      <DropdownContext.Provider value={{ isOpen, onToggle: handleToggle, onClose: handleClose }}>
        <div ref={ref || dropdownRef} className="relative inline-block" {...props}>
          {children}
        </div>
      </DropdownContext.Provider>
    );
  }
);

Dropdown.displayName = "Dropdown";

// Dropdown Trigger Component
type DropdownTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  asChild?: boolean;
};

const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const { onToggle, isOpen } = useDropdownContext();

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...children.props,
        onClick: (e: React.MouseEvent) => {
          children.props.onClick?.(e);
          onToggle();
        },
        "aria-expanded": isOpen,
        "aria-haspopup": "true"
      });
    }

    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2",
          "px-3 py-2 text-sm font-medium",
          "bg-[var(--color-card)] border border-[var(--color-border)]",
          "rounded-[var(--radius)] cursor-pointer",
          "hover:bg-[var(--color-secondary)] hover:border-[var(--color-border)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          isOpen && "bg-[var(--color-secondary)]",
          className
        )}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        {...props}
      >
        {children}
        <svg
          className={clsx(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
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
      </button>
    );
  }
);

DropdownTrigger.displayName = "DropdownTrigger";

// Dropdown Content Component
type DropdownContentProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  sideOffset?: number;
};

const DropdownContent = React.forwardRef<HTMLDivElement, DropdownContentProps>(
  ({ 
    className, 
    children, 
    align = "start", 
    side = "bottom", 
    sideOffset = 4,
    ...props 
  }, ref) => {
    const { isOpen } = useDropdownContext();

    if (!isOpen) return null;

    const alignmentClasses = {
      start: "left-0",
      center: "left-1/2 -translate-x-1/2",
      end: "right-0"
    };

    const sideClasses = {
      top: `bottom-full mb-${sideOffset}`,
      bottom: `top-full mt-${sideOffset}`
    };

    return (
      <div
        ref={ref}
        className={clsx(
          "absolute z-50 min-w-[200px]",
          "bg-[var(--color-card)] border border-[var(--color-border)]",
          "rounded-[var(--radius)] shadow-lg",
          "p-1",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          alignmentClasses[align],
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownContent.displayName = "DropdownContent";

// Dropdown Item Component
type DropdownItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
};

const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, children, destructive = false, disabled = false, onClick, ...props }, ref) => {
    const { onClose } = useDropdownContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        onClick?.(e);
        onClose();
      }
    };

    return (
      <button
        ref={ref}
        className={clsx(
          "relative flex w-full cursor-pointer select-none items-center",
          "rounded-[var(--radius)] px-3 py-2 text-sm outline-none",
          "transition-colors duration-200",
          "focus:bg-[var(--color-secondary)] focus:text-[var(--color-secondary-foreground)]",
          "hover:bg-[var(--color-secondary)] hover:text-[var(--color-secondary-foreground)]",
          "text-left",
          destructive && "text-[var(--color-destructive)] focus:bg-[var(--color-destructive)]/10 hover:bg-[var(--color-destructive)]/10",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownItem.displayName = "DropdownItem";

// Dropdown Separator Component
type DropdownSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const DropdownSeparator = React.forwardRef<HTMLDivElement, DropdownSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "-mx-1 my-1 h-px bg-[var(--color-border)]",
          className
        )}
        {...props}
      />
    );
  }
);

DropdownSeparator.displayName = "DropdownSeparator";

// Dropdown Label Component
type DropdownLabelProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

const DropdownLabel = React.forwardRef<HTMLDivElement, DropdownLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "px-3 py-2 text-xs font-semibold text-[var(--color-muted-foreground)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownLabel.displayName = "DropdownLabel";

export default Dropdown;
export { DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator, DropdownLabel };