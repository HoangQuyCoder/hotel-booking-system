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
  children: React.ReactNode;
}

// Button normal
type ButtonAsButtonProps = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> & {
    to?: never; 
  };

// Button is Link (react-router)
type ButtonAsLinkProps = BaseButtonProps &
  LinkProps & {
    disabled?: boolean;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  const {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    block = false,
    className = "",
    disabled = false,
    ...rest
  } = props;

  const isLink = "to" in props && props.to !== undefined;

  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-cyan-600 hover:bg-cyan-700 text-white focus-visible:ring-cyan-500",
    secondary:
      "bg-gray-600 hover:bg-gray-700 text-white focus-visible:ring-gray-500",
    outline:
      "border border-cyan-600 text-cyan-600 hover:bg-cyan-50 focus-visible:ring-cyan-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const width = block ? "w-full" : "";
  const allClasses =
    `${base} ${variants[variant]} ${sizes[size]} ${width} ${className}`.trim();

  const isDisabled = disabled || loading;

  const content = (
    <>
      {loading ? (
        <Spinner
          size="sm"
          color={
            variant === "outline" || variant === "ghost" ? "primary" : "white"
          }
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

  // Link (have prop to)
  if (isLink) {
    const { to, replace, ...linkProps } = rest as LinkProps;

    // When disabled or loading → render span instead of Link
    if (isDisabled) {
      return (
        <span
          className={`${allClasses} cursor-not-allowed opacity-60`}
          aria-disabled="true"
        >
          {content}
        </span>
      );
    }

    return (
      <Link
        to={to}
        replace={replace}
        {...linkProps}
        className={allClasses}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        aria-disabled={isDisabled || undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      className={allClasses}
      disabled={isDisabled}
      type={props.type ?? "button"}
      aria-disabled={isDisabled || undefined}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";
