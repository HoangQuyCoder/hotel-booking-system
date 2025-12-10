import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "dark";
  fullscreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  fullscreen = false,
}) => {
  const sizes: Record<string, string> = {
    sm: "w-6 h-6 border-4",
    md: "w-12 h-12 border-8",
    lg: "w-16 h-16 border-8",
  };

  const colors: Record<string, string> = {
    primary: "border-cyan-600 border-t-transparent",
    white: "border-white border-t-transparent",
    dark: "border-gray-800 border-t-transparent",
  };

  const spinnerElement = (
    <div
      className={`rounded-full ${sizes[size]} ${colors[color]} border-solid animate-spin`}
      style={{
        animationDuration: "0.9s",
      }}
    ></div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white/90 flex justify-center items-center z-50 transition-opacity duration-500">
        {spinnerElement}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">{spinnerElement}</div>
  );
};
