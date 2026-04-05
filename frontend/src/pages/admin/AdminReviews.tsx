import { useState } from "react";
import { Star, Trash2, Hotel, MessageSquare, Calendar } from "lucide-react";
import { useReviewApi } from "../../hooks/useReviewApi";
import { Pagination } from "../../components/ui/Pagination";
import { useDebounce } from "../../hooks/useDebounce";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminFilterBar } from "../../components/admin/AdminFilterBar";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";

export default function AdminReviews() {
  const { useReviews, deleteReview } = useReviewApi();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: reviewsData, isLoading } = useReviews({
    page,
    size,
    // keyword: debouncedSearch,
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview.mutateAsync(id);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Review Management"
        description="View and moderate customer reviews"
        icon={Star}
      />

      <AdminFilterBar
        searchPlaceHolder="Search by content or hotel name..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-6 h-36 animate-pulse shadow-sm"
            />
          ))
        ) : reviewsData?.content?.length ? (
          reviewsData.content.map((review: any) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  {/* Rating + Date row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-0.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(review.createdAt).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Hotel label */}
                  <div className="flex items-center gap-2 mb-3 text-indigo-600 text-xs font-semibold bg-indigo-50 w-fit px-3 py-1 rounded-lg border border-indigo-100">
                    <Hotel className="w-3.5 h-3.5" />
                    <span>Hotel ID: {review.hotelId.substring(0, 12)}...</span>
                  </div>

                  {/* Comment */}
                  <div className="relative pl-3 border-l-2 border-indigo-200 group-hover:border-indigo-400 transition-colors">
                    <p className="text-gray-700 text-sm leading-relaxed italic">
                      "{review.comment || "No detailed comment provided"}"
                    </p>
                  </div>

                  {/* User tag */}
                  <div className="flex items-center gap-2 mt-4 text-gray-400 text-xs bg-gray-50 w-fit px-3 py-1.5 rounded-xl border border-gray-200">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center font-bold text-[10px] text-gray-500">
                      U
                    </div>
                    <span className="font-mono">
                      User ID: {review.userId.substring(0, 12)}...
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div className="flex flex-row md:flex-col items-center justify-end gap-2 shrink-0">
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-200 rounded-xl transition-all text-xs font-semibold active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <AdminEmptyState
            icon={MessageSquare}
            message="No customer reviews yet"
            subMessage="New reviews will appear here after guests complete their stay"
          />
        )}
      </div>

      {reviewsData && reviewsData.totalPages > 1 && (
        <div className="mt-8 flex justify-center pb-8">
          <Pagination
            currentPage={page}
            totalPages={reviewsData.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
