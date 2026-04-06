import React from "react";
import { type LucideIcon } from "lucide-react";

interface AdminStatusBadgeProps {
  label: string;
  colorClass: string;
  icon: LucideIcon;
  className?: string;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({
  label,
  colorClass,
  icon: Icon,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${colorClass} ${className}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};
