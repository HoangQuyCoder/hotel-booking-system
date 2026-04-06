import { useState, useEffect } from "react";
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
  Layers,
  Sparkles,
} from "lucide-react";
import { useRoomApi } from "../../hooks/useRoomApi";
import { useHotelApi } from "../../hooks/useHotelApi";
import { useRoomTypeApi } from "../../hooks/useRoomTypeApi";
import { useRoomAmenityApi } from "../../hooks/useRoomAmenityApi";
import { Pagination } from "../../components/ui/Pagination";
import { useDebounce } from "../../hooks/useDebounce";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminFilterBar } from "../../components/admin/AdminFilterBar";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminStatusBadge } from "../../components/admin/AdminStatusBadge";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { RoomModal } from "../../components/admin/modal/RoomModal";
import { RoomTypeModal } from "../../components/admin/modal/RoomTypeModal";
import { RoomAmenityModal } from "../../components/admin/modal/RoomAmenityModal";
import type {
  RoomResponse,
  RoomTypeResponse,
  RoomAmenityResponse,
} from "../../types";

export default function AdminRooms() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const { useHotelById } = useHotelApi();
  const { useRooms, deleteRoom } = useRoomApi();
  const { useRoomTypes, deleteRoomType } = useRoomTypeApi();
  const { useRoomAmenities, deleteRoomAmenity } = useRoomAmenityApi();

  const [activeTab, setActiveTab] = useState<
    "rooms" | "roomTypes" | "amenities"
  >("rooms");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Modals state
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomResponse | null>(null);
  const [isRoomTypeModalOpen, setIsRoomTypeModalOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] =
    useState<RoomTypeResponse | null>(null);
  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] =
    useState<RoomAmenityResponse | null>(null);

  const { data: hotel } = useHotelById(hotelId!);

  // Rooms Data
  const { data: roomsData, isLoading: isRoomsLoading } = useRooms({
    page,
    size,
    roomNumber: activeTab === "rooms" ? debouncedSearch : "",
    hotelId: hotelId,
  });

  // RoomTypes Data
  const { data: roomTypesData, isLoading: isRoomTypesLoading } = useRoomTypes({
    page,
    size,
    name: activeTab === "roomTypes" ? debouncedSearch : "",
    hotelId: hotelId,
  });

  // Amenities Data
  const { data: amenitiesData, isLoading: isAmenitiesLoading } =
    useRoomAmenities({
      page,
      size,
      name: activeTab === "amenities" ? debouncedSearch : "",
      hotelId: hotelId,
    });

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, activeTab]);

  const handleDeleteRoom = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      await deleteRoom.mutateAsync(id);
    }
  };

  const handleDeleteRoomType = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this room type? It will affect all rooms of this type.",
      )
    ) {
      await deleteRoomType.mutateAsync(id);
    }
  };

  const handleDeleteAmenity = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this amenity?")) {
      await deleteRoomAmenity.mutateAsync(id);
    }
  };

  const handleEditRoom = (room: RoomResponse) => {
    setEditingRoom(room);
    setIsRoomModalOpen(true);
  };

  const handleEditRoomType = (rt: RoomTypeResponse) => {
    setEditingRoomType(rt);
    setIsRoomTypeModalOpen(true);
  };

  const handleEditAmenity = (amenity: RoomAmenityResponse) => {
    setEditingAmenity(amenity);
    setIsAmenityModalOpen(true);
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

  return (
    <div className="pb-10">
      <div className="mb-6">
        <Link
          to="/admin/hotels"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors mb-4 text-xs font-semibold uppercase tracking-wider bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-indigo-200 group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Hotels
        </Link>

        <AdminPageHeader
          title="Inventory Management"
          description={`Hotel: ${hotel?.name || "Loading..."}`}
          icon={
            activeTab === "rooms"
              ? Bed
              : activeTab === "roomTypes"
                ? Layers
                : Sparkles
          }
          iconGradient="from-sky-500 to-indigo-600"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 bg-white p-1 rounded-xl border border-gray-200 w-fit shadow-sm overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab("rooms")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "rooms"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          <Bed className="w-4 h-4" />
          Rooms Management
        </button>
        <button
          onClick={() => setActiveTab("roomTypes")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "roomTypes"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          <Layers className="w-4 h-4" />
          Room Types
        </button>
        <button
          onClick={() => setActiveTab("amenities")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "amenities"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Amenities
        </button>
      </div>

      <AdminFilterBar
        searchPlaceHolder={
          activeTab === "rooms"
            ? "Search room number..."
            : activeTab === "roomTypes"
              ? "Search room type..."
              : "Search amenity..."
        }
        searchValue={search}
        onSearchChange={setSearch}
        onActionClick={() =>
          activeTab === "rooms"
            ? setIsRoomModalOpen(true)
            : activeTab === "roomTypes"
              ? setIsRoomTypeModalOpen(true)
              : setIsAmenityModalOpen(true)
        }
        actionLabel={
          activeTab === "rooms"
            ? "Add Room"
            : activeTab === "roomTypes"
              ? "Add Type"
              : "Add Amenity"
        }
        actionIcon={Plus}
      />

      {activeTab === "rooms" ? (
        <AdminTable
          columns={[
            { label: "Room" },
            { label: "Room Type" },
            { label: "Status" },
            { label: "Actions", className: "text-right" },
          ]}
          isLoading={isRoomsLoading}
          isEmpty={!roomsData?.content?.length}
          emptyState={
            <AdminEmptyState
              icon={Bed}
              message="No rooms found"
              subMessage="Click 'Add Room' to start"
            />
          }
        >
          {roomsData?.content?.map((room: RoomResponse) => {
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
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-700 text-sm font-semibold bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 uppercase tracking-wide">
                    {room.roomTypeName || "N/A"}
                  </span>
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
                    <button
                      onClick={() => handleEditRoom(room)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
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
      ) : activeTab === "roomTypes" ? (
        <AdminTable
          columns={[
            { label: "Type Name" },
            { label: "Info" },
            { label: "Status" },
            { label: "Actions", className: "text-right" },
          ]}
          isLoading={isRoomTypesLoading}
          isEmpty={!roomTypesData?.content?.length}
          emptyState={
            <AdminEmptyState
              icon={Layers}
              message="No room types found"
              subMessage="Click 'Add Type' to start"
            />
          }
        >
          {roomTypesData?.content?.map((rt: any) => (
            <tr
              key={rt.id}
              className="hover:bg-gray-50 transition-colors group"
            >
              <td className="px-6 py-4">
                <p className="text-gray-900 font-bold text-base truncate group-hover:text-indigo-600 transition-colors">
                  {rt.name}
                </p>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  <span className="bg-gray-50 border border-gray-100 px-2 py-1 rounded">
                    Size: {rt.sizeSqm}m²
                  </span>
                  <span className="bg-gray-50 border border-gray-100 px-2 py-1 rounded">
                    Cap: {rt.capacity} Guests
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <AdminStatusBadge
                  label={rt.isAvailable ? "Active" : "Disabled"}
                  icon={rt.isAvailable ? CheckCircle2 : XCircle}
                  colorClass={
                    rt.isAvailable
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-red-50 text-red-500 border-red-200"
                  }
                />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleEditRoomType(rt)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRoomType(rt.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      ) : (
        <AdminTable
          columns={[
            { label: "Amenity Name" },
            { label: "Category" },
            { label: "Actions", className: "text-right" },
          ]}
          isLoading={isAmenitiesLoading}
          isEmpty={!amenitiesData?.content?.length}
          emptyState={
            <AdminEmptyState
              icon={Sparkles}
              message="No amenities found"
              subMessage="Click 'Add Amenity' to start"
            />
          }
        >
          {amenitiesData?.content?.map((amenity: RoomAmenityResponse) => (
            <tr
              key={amenity.id}
              className="hover:bg-gray-50 transition-colors group"
            >
              <td className="px-6 py-4">
                <p className="text-gray-900 font-bold text-base group-hover:text-indigo-600 transition-colors">
                  {amenity.name}
                </p>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-600 text-xs font-bold bg-gray-100 px-2 py-1 rounded-lg border border-gray-200 uppercase tracking-wider">
                  {amenity.category}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleEditAmenity(amenity)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAmenity(amenity.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      {(activeTab === "rooms"
        ? roomsData?.totalPages
        : activeTab === "roomTypes"
          ? roomTypesData?.totalPages
          : amenitiesData?.totalPages) &&
        (activeTab === "rooms"
          ? roomsData!.totalPages
          : activeTab === "roomTypes"
            ? roomTypesData!.totalPages
            : amenitiesData!.totalPages) > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={
                activeTab === "rooms"
                  ? roomsData?.totalPages || 0
                  : activeTab === "roomTypes"
                    ? roomTypesData?.totalPages || 0
                    : amenitiesData?.totalPages || 0
              }
              onPageChange={setPage}
            />
          </div>
        )}

      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => {
          setIsRoomModalOpen(false);
          setEditingRoom(null);
        }}
        hotelId={hotelId!}
        room={editingRoom}
      />
      <RoomTypeModal
        isOpen={isRoomTypeModalOpen}
        onClose={() => {
          setIsRoomTypeModalOpen(false);
          setEditingRoomType(null);
        }}
        hotelId={hotelId!}
        roomType={editingRoomType}
      />
      <RoomAmenityModal
        isOpen={isAmenityModalOpen}
        onClose={() => {
          setIsAmenityModalOpen(false);
          setEditingAmenity(null);
        }}
        hotelId={hotelId!}
        amenity={editingAmenity}
      />
    </div>
  );
}
