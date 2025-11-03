// src/components/ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "btn d-inline-flex align-items-center justify-content-center gap-2 transition-all";
  const variants = {
    primary: "btn-primary text-white",
    secondary: "btn-secondary text-white",
    outline: "btn-outline-primary",
    ghost: "btn-ghost text-muted",
    danger: "btn-danger text-white",
  };
  const sizes = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {icon && !loading && icon}
      {children}
    </button>
  );
};
