import React from "react";
import { type LucideIcon } from "lucide-react";
import { Button } from "../ui/Button";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  actionLabel?: string;
  onActionClick?: () => void;
  actionIcon?: LucideIcon;
  iconGradient?: string;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  onActionClick,
  actionIcon: ActionIcon,
  iconGradient = "from-indigo-500 to-purple-600",
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 bg-gradient-to-br ${iconGradient} rounded-xl flex items-center justify-center shadow-md`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-gray-500 text-sm mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {actionLabel && (
        <Button
          onClick={onActionClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 font-semibold text-sm"
        >
          {ActionIcon && <ActionIcon className="w-4 h-4" />}
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};
