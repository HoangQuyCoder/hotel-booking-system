import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "default";
  size?: "sm" | "md";
  pill?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  pill = false,
}) => {
  const variants = {
    success: "bg-success text-white",
    warning: "bg-warning text-dark",
    danger: "bg-danger text-white",
    info: "bg-info text-white",
    default: "bg-light text-dark border",
  };
  const sizes = {
    sm: "small",
    md: "",
  };

  return (
    <span
      className={`badge ${variants[variant]} ${
        pill ? "rounded-pill" : "rounded"
      } ${sizes[size]}`}
    >
      {children}
    </span>
  );
};
