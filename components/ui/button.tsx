import React from "react";
import clsx from "clsx";

type ButtonProps = {
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
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className,
  onClick,
  type = "button",
  disabled = false,
}) => {
  const base =
    "inline-flex items-center justify-center px-3 py-1.5 rounded-[var(--radius)] text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<string, string> = {
    primary:
      "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] focus:ring-[var(--color-primary)]",
    secondary:
      "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] border border-[var(--color-gray-300)] hover:bg-[var(--color-secondary-hover)] focus:ring-[var(--color-secondary-hover)]",
    accent:
      "bg-[var(--color-blue-500)]/10 text-[var(--color-blue-700)] border border-[var(--color-blue-500)]/20 hover:bg-[var(--color-blue-500)]/15 focus:ring-[var(--color-blue-500)]",
    success:
      "bg-[var(--color-green-500)]/10 text-[var(--color-green-700)] border border-[var(--color-green-500)]/20 hover:bg-[var(--color-green-500)]/15 focus:ring-[var(--color-green-500)]",
    destructive:
      "bg-[var(--color-destructive)]/10 text-[var(--color-red-600)] border border-[var(--color-destructive)]/20 hover:bg-[var(--color-destructive)]/15 focus:ring-[var(--color-destructive)]",
    warning:
      "bg-[var(--color-orange-500)]/10 text-[var(--color-orange-600)] border border-[var(--color-orange-500)]/20 hover:bg-[var(--color-orange-500)]/15 focus:ring-[var(--color-orange-500)]",
    outline:
      "border border-[var(--color-border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-secondary-foreground)] focus:ring-[var(--color-primary)]",
    ghost:
      "bg-transparent text-[var(--foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-secondary-foreground)] focus:ring-[var(--color-primary)]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, variants[variant], className)}
    >
      {children}
    </button>
  );
};

export default Button;
