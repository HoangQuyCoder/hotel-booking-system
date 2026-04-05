import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Bed,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useRoomApi } from "../../hooks/useRoomApi";
import { useHotelApi } from "../../hooks/useHotelApi";
import { Pagination } from "../../components/ui/Pagination";
import { useDebounce } from "../../hooks/useDebounce";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminFilterBar } from "../../components/admin/AdminFilterBar";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminStatusBadge } from "../../components/admin/AdminStatusBadge";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";

export default function AdminRooms() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const { useHotelById } = useHotelApi();
  const { useRooms, deleteRoom } = useRoomApi();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: hotel } = useHotelById(hotelId!);
  const { data: roomsData, isLoading } = useRooms({
    page,
    size,
    keyword: debouncedSearch,
    hotelId: hotelId,
  } as any);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      await deleteRoom.mutateAsync(id);
    }
  };

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: any }
  > = {
    AVAILABLE: {
      label: "Available",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: CheckCircle2,
    },
    BOOKED: {
      label: "Booked",
      color: "bg-amber-50 text-amber-600 border-amber-200",
      icon: Clock,
    },
    MAINTENANCE: {
      label: "Maintenance",
      color: "bg-red-50 text-red-500 border-red-200",
      icon: XCircle,
    },
  };

  const columns = [
    { label: "Room" },
    { label: "Room Type" },
    { label: "Price" },
    { label: "Status" },
    { label: "Actions", className: "text-right" },
  ];

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/admin/hotels"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors mb-4 text-xs font-semibold uppercase tracking-wider bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-indigo-200 group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Hotels
        </Link>

        <AdminPageHeader
          title="Room Management"
          description={`Hotel: ${hotel?.name || "Loading..."}`}
          icon={Bed}
          iconGradient="from-sky-500 to-indigo-600"
        />
      </div>

      <AdminFilterBar
        searchPlaceHolder="Search by room number or type..."
        searchValue={search}
        onSearchChange={setSearch}
        onActionClick={() => console.log("Add Room")}
        actionLabel="Add Room"
        actionIcon={Plus}
      />

      <AdminTable
        columns={columns}
        isLoading={isLoading}
        isEmpty={!roomsData?.content?.length}
        emptyState={
          <AdminEmptyState
            icon={Bed}
            message="No rooms found"
            subMessage="Click 'Add Room' to create the first room"
          />
        }
      >
        {roomsData?.content?.map((room: any) => {
          const status = statusConfig[room.status] || {
            label: room.status,
            color: "bg-gray-100 text-gray-500 border-gray-200",
            icon: Clock,
          };
          return (
            <tr
              key={room.id}
              className="hover:bg-gray-50 transition-colors group"
            >
              <td className="px-6 py-4">
                <p className="text-gray-900 font-bold text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                  {room.roomNumber}
                </p>
                <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest mt-0.5">
                  Floor: {room.roomNumber?.charAt(0) || "1"}
                </p>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-700 text-sm font-semibold bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                  {room.roomTypeName || room.roomTypeId}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <p className="text-indigo-600 font-bold text-base">
                    {room.price?.toLocaleString("en-US")} ₫
                  </p>
                  <p className="text-gray-400 text-[11px] font-semibold uppercase">
                    per night
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <AdminStatusBadge
                  label={status.label}
                  icon={status.icon}
                  colorClass={status.color}
                />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </AdminTable>

      {roomsData && roomsData.totalPages > 1 && (
        <div className="mt-6 flex justify-center pb-8">
          <Pagination
            currentPage={page}
            totalPages={roomsData.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
