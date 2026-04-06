import { useState } from "react";
import { MessageSquare, Plus, Edit, Trash2, Star, Hotel } from "lucide-react";
import { useReviewApi } from "../../hooks/useReviewApi";
import { Pagination } from "../../components/ui/Pagination";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminFilterBar } from "../../components/admin/AdminFilterBar";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { ReviewModal } from "../../components/admin/modal/ReviewModal";
import type { ReviewResponse } from "../../types";

export default function AdminReviews() {
  const { useReviews, deleteReview } = useReviewApi();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewResponse | null>(
    null,
  );

  const { data: reviewsData, isLoading } = useReviews({
    page,
    size,
    name: search || undefined,
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview.mutateAsync(id);
    }
  };

  const handleEdit = (review: ReviewResponse) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const columns = [
    { label: "Guest" },
    { label: "Hotel" },
    { label: "Rating" },
    { label: "Comment" },
    { label: "Date" },
    { label: "Actions", className: "text-right" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Guest Reviews"
        description="Monitor and manage hotel feedback"
        icon={MessageSquare}
      />

      <AdminFilterBar
        searchPlaceHolder="Search reviewers..."
        searchValue={search}
        onSearchChange={setSearch}
        onActionClick={() => {
          setEditingReview(null);
          setIsModalOpen(true);
        }}
        actionLabel="Add Review"
        actionIcon={Plus}
      />

      <AdminTable
        columns={columns}
        isLoading={isLoading}
        isEmpty={!reviewsData?.content?.length}
        emptyState={
          <AdminEmptyState
            icon={MessageSquare}
            message="No reviews found"
            subMessage="Reviews from guests will appear here"
          />
        }
      >
        {reviewsData?.content?.map((review: ReviewResponse) => (
          <tr
            key={review.id}
            className="hover:bg-gray-50 transition-colors group"
          >
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {review.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm tracking-tight capitalize group-hover:text-indigo-600 transition-colors">
                    {review.name || `User: ${review.userId.substring(0, 8)}`}
                  </p>
                  <p className="text-gray-400 text-[10px] uppercase font-semibold">
                    Guest
                  </p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2 text-gray-700 text-xs font-semibold">
                <Hotel className="w-3.5 h-3.5 text-gray-400" />
                Hotel: {review.hotelId.substring(0, 8)}...
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </td>
            <td className="px-6 py-4">
              <p className="text-gray-600 text-xs italic leading-relaxed line-clamp-2 max-w-[250px] bg-gray-50 px-2.5 py-1.5 rounded-lg border border-transparent group-hover:bg-white group-hover:border-gray-100 transition-all">
                "{review.text}"
              </p>
            </td>
            <td className="px-6 py-4 text-gray-400 text-[11px] font-semibold">
              {new Date(review.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => handleEdit(review)}
                  title="Edit Review"
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  title="Delete Review"
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      {reviewsData && reviewsData.totalPages > 1 && (
        <div className="mt-6 flex justify-center pb-8">
          <Pagination
            currentPage={page}
            totalPages={reviewsData.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReview(null);
        }}
        review={editingReview}
      />
    </div>
  );
}
