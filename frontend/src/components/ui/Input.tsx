import React, { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn"; 

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string; 
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;  
  containerClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      className,
      containerClassName,
      labelClassName,
      inputWrapperClassName,
      disabled,
      type = "text",
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const hasHelper = !!helperText && !hasError;

    return (
      <div className={cn("w-full flex flex-col", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            className={cn(
              "text-sm font-medium text-gray-700 mb-1.5 select-none",
              disabled && "opacity-60",
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        {/* Input wrapper - for set icon */}
        <div
          className={cn(
            "relative flex items-center",
            inputWrapperClassName
          )}
        >
          {startIcon && (
            <span className="absolute left-3 text-gray-500 pointer-events-none">
              {startIcon}
            </span>
          )}

          <input
            ref={ref}
            type={type}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.id || "input"}-error` : hasHelper ? `${props.id || "input"}-helper` : undefined}
            {...props}
            className={cn(
              // Base styles
              "w-full px-4 py-3 rounded-lg border transition-all duration-200",
              "bg-white text-gray-900 placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",

              // Border & error state
              hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-cyan-500",

              // Padding when icon is present
              startIcon && "pl-10",
              endIcon && "pr-10",

              className
            )}
          />

          {endIcon && (
            <span className="absolute right-3 text-gray-500 pointer-events-none">
              {endIcon}
            </span>
          )}
        </div>

        {/* Helper / Error text */}
        {(hasError || hasHelper) && (
          <p
            id={hasError ? `${props.id || "input"}-error` : `${props.id || "input"}-helper`}
            className={cn(
              "mt-1.5 text-sm",
              hasError ? "text-red-600" : "text-gray-600"
            )}
          >
            {hasError ? error : helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";