import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "dark";
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
}) => {
  const sizes = {
    sm: "spinner-border-sm",
    md: "",
    lg: "spinner-border-lg",
  };
  const colors = {
    primary: "text-primary",
    white: "text-white",
    dark: "text-dark",
  };

  return (
    <div
      className={`spinner-border ${sizes[size]} ${colors[color]}`}
      role="status"
      style={{
        width: size === "sm" ? "1rem" : size === "lg" ? "3rem" : "2rem",
        height: "auto",
      }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};
