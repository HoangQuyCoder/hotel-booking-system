import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPages = 5,
}) => {
  if (totalPages <= 1) return null;

  const pages: Array<number | "..."> = [];
  const start = Math.max(0, currentPage - Math.floor(showPages / 2));
  const end = Math.min(totalPages, start + showPages);

  if (start > 0) {
    pages.push(1);
    if (start > 1) pages.push("...");
  }

  for (let i = start; i < end; i++) {
    pages.push(i + 1);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex justify-center mt-8" aria-label="Pagination">
      <ul className="inline-flex items-center -space-x-px">
        {/* Previous */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </li>

        {/* Pages */}
        {pages.map((page, index) =>
          page === "..." ? (
            <li key={`ellipsis-${index}`}>
              <span className="px-3 py-2 text-gray-500">...</span>
            </li>
          ) : (
            <li key={page}>
              <button
                onClick={() => onPageChange((page as number) - 1)}
                className={`px-3 py-2 leading-tight border ${
                  currentPage === page - 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {page}
              </button>
            </li>
          )
        )}

        {/* Next */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </li>
      </ul>
    </nav>
  );
};
