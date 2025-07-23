import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

// Modal Context
type ModalContextType = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);

const useModalContext = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within a Modal provider");
  }
  return context;
};

// Main Modal Component
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
};

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    isOpen, 
    onClose, 
    children, 
    size = "md",
    closeOnOverlayClick = true,
    closeOnEscape = true,
    ...props 
  }, ref) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (isOpen && closeOnEscape) {
        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            onClose();
          }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
      }
    }, [isOpen, closeOnEscape, onClose]);

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "unset";
        };
      }
    }, [isOpen]);

    const sizeClasses = {
      sm: "max-w-md max-h-[90vh]",
      md: "max-w-lg max-h-[90vh]", 
      lg: "max-w-2xl max-h-[90vh]",
      xl: "max-w-4xl max-h-[90vh]",
      full: "max-w-full max-h-[90vh] m-4"
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    if (!mounted || !isOpen) return null;

    return createPortal(
      <ModalContext.Provider value={{ isOpen, onClose }}>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          
          {/* Modal Content */}
          <div
            ref={ref}
            className={clsx(
              "relative w-full bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)] shadow-lg",
              "animate-in fade-in-0 zoom-in-95 duration-200 flex flex-col overflow-hidden",
              sizeClasses[size]
            )}
            role="dialog"
            aria-modal="true"
            {...props}
          >
            {children}
          </div>
        </div>
      </ModalContext.Provider>,
      document.body
    );
  }
);

Modal.displayName = "Modal";

// Modal Header Component
type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  showCloseButton?: boolean;
};

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, showCloseButton = true, ...props }, ref) => {
    const { onClose } = useModalContext();

    return (
      <div
        ref={ref}
        className={clsx(
          "flex items-center justify-between p-6 border-b border-[var(--color-border)]",
          className
        )}
        {...props}
      >
        <div>{children}</div>
        {showCloseButton && (
          <button
            onClick={onClose}
            className={clsx(
              "rounded-[var(--radius)] p-1 text-[var(--color-muted-foreground)]",
              "hover:text-[var(--foreground)] hover:bg-[var(--color-secondary)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
            )}
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = "ModalHeader";

// Modal Title Component
type ModalTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode;
};

const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={clsx(
          "text-lg font-semibold text-[var(--foreground)]",
          className
        )}
        {...props}
      >
        {children}
      </h2>
    );
  }
);

ModalTitle.displayName = "ModalTitle";

// Modal Description Component
type ModalDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  children: React.ReactNode;
};

const ModalDescription = React.forwardRef<HTMLParagraphElement, ModalDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={clsx(
          "text-sm text-[var(--color-muted-foreground)]",
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

ModalDescription.displayName = "ModalDescription";

// Modal Body Component
type ModalBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("p-6 overflow-y-auto flex-1", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalBody.displayName = "ModalBody";

// Modal Footer Component
type ModalFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-secondary)]/30",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = "ModalFooter";

export default Modal;
export { ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter };