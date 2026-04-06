import React from "react";

interface Column {
  label: string;
  className?: string;
}

interface AdminTableProps {
  columns: Column[];
  children: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyState?: React.ReactNode;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  columns,
  children,
  isLoading,
  isEmpty,
  emptyState,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-gray-500 font-semibold text-xs uppercase tracking-wider ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={columns.length} className="px-6 py-8">
                    <div className="h-5 bg-gray-100 rounded-lg w-full" />
                  </td>
                </tr>
              ))
            ) : isEmpty ? (
              <tr>
                <td colSpan={columns.length}>{emptyState}</td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
