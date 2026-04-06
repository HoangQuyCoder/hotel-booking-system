import React from "react";
import { Link, type LinkProps } from "react-router-dom";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  block?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps =
  | (BaseProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      to?: undefined;
    })
  | (BaseProps &
    Omit<LinkProps, "className" | "children"> & {
      to: LinkProps["to"];
      disabled?: boolean;
    });

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    block,
    className = "",
    children,
    ...rest
  } = props;

  const isLink = "to" in props && props.to;
  const disabled = (props as any).disabled || false;
  const isDisabled = disabled || loading;

  // Base
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

  // Variant
  const variantStyles: Record<Variant, string> = {
    primary:
      "bg-cyan-600 text-white hover:bg-cyan-700",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700",
    outline:
      "border border-cyan-600 text-white hover:bg-cyan-700",
    ghost:
      "text-gray-600 hover:bg-gray-100",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  // Size
  const sizeStyles: Record<Size, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-3 text-lg",
  };

  const classes = [
    base,
    variantStyles[variant],
    sizeStyles[size],
    block && "w-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = loading ? (
    <Spinner size="sm" color="white" />
  ) : (
    <>
      {leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span>{rightIcon}</span>}
    </>
  );

  // Link mode
  if (isLink) {
    if (isDisabled) {
      return (
        <span className={classes + " opacity-60 cursor-not-allowed"}>
          {content}
        </span>
      );
    }

    return (
      <Link
        to={props.to}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...(rest as Omit<LinkProps, "to">)}
      >
        {content}
      </Link>
    );
  }

  // Button mode
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={isDisabled}
      type={(rest as any).type ?? "button"}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";