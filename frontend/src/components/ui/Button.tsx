import React from "react";
import { Link, type LinkProps } from "react-router-dom";
import { Spinner } from "./Spinner";

interface BaseButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  block?: boolean;
  className?: string;
  disabled?: boolean;
}

// Button HTML
type ButtonAsButton = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

// Button as Link
type ButtonAsLink = BaseButtonProps & LinkProps & { as: typeof Link };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  block = false,
  className = "",
  as,
  disabled = false,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    outline:
      "border border-cyan-600 text-cyan-600 hover:bg-cyan-50 focus:ring-cyan-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const width = block ? "w-full" : "";
  const allClasses = `${base} ${variants[variant]} ${sizes[size]} ${width} ${className}`;

  const content = (
    <>
      {loading ? (
        <Spinner
          size="sm"
          color={variant === "outline" ? "primary" : "white"}
        />
      ) : (
        <>
          {leftIcon && <span className="flex items-center">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </>
      )}
    </>
  );

  if (as === Link) {
    const { to, ...restProps } = props as LinkProps;

    if (disabled || loading) {
      return (
        <span className={`${allClasses} cursor-not-allowed opacity-60`}>
          {content}
        </span>
      );
    }

    return (
      <Link to={to} className={allClasses} {...restProps}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={allClasses}
      disabled={disabled || loading}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
};
