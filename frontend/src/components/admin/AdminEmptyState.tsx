import React from "react";
import { type LucideIcon } from "lucide-react";

interface AdminEmptyStateProps {
  icon: LucideIcon;
  message: string;
  subMessage?: string;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  icon: Icon,
  message,
  subMessage,
}) => {
  return (
    <div className="py-20 text-center bg-gray-50 border border-gray-100 rounded-2xl mt-4">
      <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-gray-800 font-semibold text-lg mb-1">{message}</h3>
      {subMessage && <p className="text-gray-500 text-sm">{subMessage}</p>}
    </div>
  );
};
