import { useState } from "react";
import {
  CalendarCheck,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightLeft,
  LogIn,
  LogOut,
  StickyNote,
  Users,
  Plus,
  Edit,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useBookingApi } from "../../hooks/useBookingApi";
import { Pagination } from "../../components/ui/Pagination";
import { BookingStatus } from "../../types/enum";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminFilterBar } from "../../components/admin/AdminFilterBar";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminStatusBadge } from "../../components/admin/AdminStatusBadge";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { BookingModal } from "../../components/admin/modal/BookingModal";
import type { BookingListResponse } from "../../types";

export default function AdminBookings() {
  const { useBookings, checkInBooking, checkOutBooking, cancelBooking } =
    useBookingApi();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] =
    useState<BookingListResponse | null>(null);

  const { data: bookingsData, isLoading } = useBookings({
    page,
    size,
    status: (statusFilter as BookingStatus) || undefined,
  });

  const handleCheckIn = async (id: string) => {
    if (window.confirm("Confirm guest check-in?")) {
      await checkInBooking.mutateAsync(id);
    }
  };

  const handleCheckOut = async (id: string) => {
    if (window.confirm("Confirm guest check-out?")) {
      await checkOutBooking.mutateAsync(id);
    }
  };

  const handleCancel = async (id: string) => {
    if (
      window.confirm("Are you sure you want to cancel/delete this booking?")
    ) {
      await cancelBooking.mutateAsync(id);
    }
  };

  const handleEdit = (booking: BookingListResponse) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: LucideIcon }
  > = {
    PENDING: {
      label: "Pending",
      color: "bg-amber-50 text-amber-600 border-amber-200",
      icon: Clock,
    },
    CONFIRMED: {
      label: "Confirmed",
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
      icon: CheckCircle2,
    },
    CHECKED_IN: {
      label: "Checked In",
      color: "bg-sky-50 text-sky-600 border-sky-200",
      icon: ArrowRightLeft,
    },
    CHECKED_OUT: {
      label: "Checked Out",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: CheckCircle2,
    },
    CANCELLED: {
      label: "Cancelled",
      color: "bg-red-50 text-red-500 border-red-200",
      icon: XCircle,
    },
  };

  const filterOptions = Object.values(BookingStatus).map((status) => ({
    value: status,
    label: statusConfig[status]?.label || status,
  }));

  const columns = [
    { label: "Ref Code" },
    { label: "Hotel" },
    { label: "Check-in" },
    { label: "Check-out" },
    { label: "Guests" },
    { label: "Amount", className: "text-right" },
    { label: "Status" },
    { label: "Notes" },
    { label: "Actions", className: "text-right" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Booking Management"
        description="Monitor and manage all hotel bookings"
        icon={CalendarCheck}
      />

      <AdminFilterBar
        searchPlaceHolder="Search by booking code or guest name..."
        searchValue={search}
        onSearchChange={setSearch}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        options={filterOptions}
        filterIcon={Filter}
        statusLabel="All statuses"
        onActionClick={() => {
          setEditingBooking(null);
          setIsModalOpen(true);
        }}
        actionLabel="Add Booking"
        actionIcon={Plus}
      />

      <AdminTable
        columns={columns}
        isLoading={isLoading}
        isEmpty={!bookingsData?.content?.length}
        emptyState={
          <AdminEmptyState
            icon={CalendarCheck}
            message="No bookings found"
            subMessage="Try adjusting your filters or search term"
          />
        }
      >
        {bookingsData?.content?.map((booking: BookingListResponse) => {
          const status = statusConfig[booking.status] || {
            label: booking.status,
            color: "bg-gray-100 text-gray-500 border-gray-200",
            icon: Clock,
          };
          return (
            <tr
              key={booking.id}
              className="hover:bg-gray-50 transition-colors group whitespace-nowrap"
            >
              {/* Code */}
              <td className="px-6 py-4">
                <p className="text-gray-900 font-bold text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                  #{booking.confirmationCode}
                </p>
                <p className="text-gray-400 text-[10px] mt-0.5 font-mono uppercase opacity-60">
                  ID: {booking.id.substring(0, 8)}
                </p>
              </td>

              {/* Hotel */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {booking.hotelName?.charAt(0)}
                  </div>
                  <p className="text-gray-700 text-sm font-semibold max-w-[150px] truncate">
                    {booking.hotelName}
                  </p>
                </div>
              </td>

              {/* Check-in */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <p className="text-gray-900 font-bold text-sm">
                    {new Date(booking.checkInDate).toLocaleDateString("en-GB")}
                  </p>
                  <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                    Check-in
                  </p>
                </div>
              </td>

              {/* Check-out */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <p className="text-gray-900 font-bold text-sm">
                    {new Date(booking.checkOutDate).toLocaleDateString("en-GB")}
                  </p>
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">
                    Check-out
                  </p>
                </div>
              </td>

              {/* Guests */}
              <td className="px-6 py-4">
                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold flex items-center gap-1.5 w-fit">
                  <Users className="w-3 h-3" />
                  {booking.guestCount}
                </span>
              </td>

              {/* Amount */}
              <td className="px-6 py-4 text-right">
                <p className="text-gray-900 font-black text-sm">
                  {booking.totalAmount?.toLocaleString("en-US")} ₫
                </p>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <AdminStatusBadge
                  label={status.label}
                  icon={status.icon}
                  colorClass={status.color}
                />
              </td>

              {/* Notes */}
              <td className="px-6 py-4">
                {booking.notes ? (
                  <div className="flex items-start gap-2 max-w-[200px]">
                    <StickyNote className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 italic line-clamp-1 group-hover:line-clamp-none transition-all duration-300 bg-amber-50/50 px-2 py-1 rounded-lg border border-transparent group-hover:border-amber-100">
                      {booking.notes}
                    </p>
                  </div>
                ) : (
                  <span className="text-gray-300 text-xs">—</span>
                )}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  {booking.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleCheckIn(booking.id)}
                      title="Check-in Guest"
                      className="p-2 text-sky-500 hover:bg-sky-50 rounded-lg transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                    </button>
                  )}
                  {booking.status === "CHECKED_IN" && (
                    <button
                      onClick={() => handleCheckOut(booking.id)}
                      title="Check-out Guest"
                      className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(booking)}
                    title="Edit Booking"
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCancel(booking.id)}
                    title="Cancel Booking"
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/bookings/${booking.id}`}
                    title="View Details"
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </td>
            </tr>
          );
        })}
      </AdminTable>

      {bookingsData && bookingsData.totalPages > 1 && (
        <div className="mt-6 flex justify-center pb-8">
          <Pagination
            currentPage={page}
            totalPages={bookingsData.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBooking(null);
        }}
        booking={editingBooking}
      />
    </div>
  );
}
