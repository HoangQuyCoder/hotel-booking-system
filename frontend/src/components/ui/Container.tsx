import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  fluid = false,
}) => {
  return (
    <div className={`container${fluid ? "-fluid" : ""} ${className}`}>
      {children}
    </div>
  );
};
