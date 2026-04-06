import { useState, useEffect } from "react";
import {
  Hotel,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Star,
  ExternalLink,
} from "lucide-react";
import { useHotelApi } from "../../hooks/useHotelApi";
import { Pagination } from "../../components/ui/Pagination";
import { useDebounce } from "../../hooks/useDebounce";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminFilterBar } from "../../components/admin/AdminFilterBar";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { HotelModal } from "../../components/admin/modal/HotelModal";
import type { HotelDetailResponse } from "../../types";

export default function AdminHotels() {
  const { useHotels, deleteHotel, useHotelById } = useHotelApi();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);

  // Fetch full data for editing if an ID is selected
  const { data: hotelDetail } = useHotelById(editingHotelId || "");

  const { data: hotelsData, isLoading } = useHotels({
    page,
    size,
    keyword: debouncedSearch,
  });

  // Reset page when search changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      await deleteHotel.mutateAsync(id);
    }
  };

  const handleEdit = (id: string) => {
    setEditingHotelId(id);
    setIsModalOpen(true);
  };

  const handleAddHotel = () => {
    setEditingHotelId(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <AdminPageHeader
        title="Hotel Management"
        description="All hotels registered in the system"
        icon={Hotel}
      />

      <AdminFilterBar
        searchPlaceHolder="Search by hotel name or address..."
        searchValue={search}
        onSearchChange={setSearch}
        onActionClick={handleAddHotel}
        actionLabel="Add Hotel"
        actionIcon={Plus}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl h-72 animate-pulse shadow-sm"
            />
          ))
        ) : hotelsData?.content?.length ? (
          hotelsData.content.map((hotel: any) => (
            <div
              key={hotel.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden group hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-44 overflow-hidden flex-shrink-0">
                <img
                  src={hotel.thumbnailUrl || "/images/hotel-placeholder.png"}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-200 px-2.5 py-1 rounded-xl flex items-center gap-1 text-xs font-bold shadow-sm">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  {hotel.rating || "N/A"}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-gray-900 font-bold text-base truncate flex-1 group-hover:text-indigo-600 transition-colors">
                      {hotel.name}
                    </h3>
                    <Link
                      to={`/hotels/${hotel.id}`}
                      target="_blank"
                      className="no-underline p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500" />
                    <span className="truncate">
                      {hotel.city}, {hotel.address}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {hotel.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(hotel.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-600 text-xs font-semibold rounded-lg transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hotel.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 text-xs font-semibold rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                  <Link
                    to={`/admin/hotels/${hotel.id}/rooms`}
                    className="no-underline text-indigo-600 text-xs font-bold hover:text-indigo-700 transition-colors uppercase tracking-wider bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-200"
                  >
                    Rooms
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <AdminEmptyState
              icon={Hotel}
              message="No hotels found"
              subMessage="Click 'Add Hotel' to register the first hotel"
            />
          </div>
        )}
      </div>

      {hotelsData && hotelsData.totalPages > 1 && (
        <div className="flex justify-center mb-8">
          <Pagination
            currentPage={page}
            totalPages={hotelsData.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Hotel Management Modal */}
      <HotelModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHotelId(null);
        }}
        hotel={editingHotelId ? (hotelDetail as HotelDetailResponse) : null}
      />
    </div>
  );
}
