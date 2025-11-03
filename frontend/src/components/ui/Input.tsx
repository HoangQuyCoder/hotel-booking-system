import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="form-label fw-semibold d-flex align-items-center">
            {icon}
            {label}
          </label>
        )}
        <input ref={ref} className={`form-control ${className}`} {...props} />
      </div>
    );
  }
);
