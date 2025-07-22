import React from "react";
import clsx from "clsx";

type IconButtonProps = {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "destructive"
    | "warning"
    | "outline"
    | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label": string; // Required for accessibility
};

const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = "ghost",
  size = "md",
  className,
  onClick,
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
}) => {
  const base =
    "inline-flex items-center justify-center rounded-[var(--radius)] font-medium transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes: Record<string, string> = {
    sm: "h-8 w-8 p-1",
    md: "h-10 w-10 p-2",
    lg: "h-12 w-12 p-3",
  };

  const variants: Record<string, string> = {
    primary:
      "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]",
    secondary:
      "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] border border-[var(--color-gray-300)] hover:bg-[var(--color-secondary-hover)]",
    accent:
      "bg-[var(--color-blue-500)]/10 text-[var(--color-blue-700)] border border-[var(--color-blue-500)]/20 hover:bg-[var(--color-blue-500)]/15",
    success:
      "bg-[var(--color-green-500)]/10 text-[var(--color-green-700)] border border-[var(--color-green-500)]/20 hover:bg-[var(--color-green-500)]/15",
    destructive:
      "bg-[var(--color-destructive)]/10 text-[var(--color-red-600)] border border-[var(--color-destructive)]/20 hover:bg-[var(--color-destructive)]/15",
    warning:
      "bg-[var(--color-orange-500)]/10 text-[var(--color-orange-600)] border border-[var(--color-orange-500)]/20 hover:bg-[var(--color-orange-500)]/15",
    outline:
      "border border-[var(--color-border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-secondary-foreground)]",
    ghost:
      "bg-transparent text-[var(--foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-secondary-foreground)]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={clsx(base, sizes[size], variants[variant], className)}
    >
      {children}
    </button>
  );
};

export default IconButton;