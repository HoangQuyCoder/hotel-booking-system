import { useState } from "react";
import {
  CalendarCheck,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightLeft,
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

export default function AdminBookings() {
  const { useBookings } = useBookingApi();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: bookingsData, isLoading } = useBookings({
    page,
    size,
    status: (statusFilter as BookingStatus) || undefined,
  });

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: any }
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
    { label: "Booking" },
    { label: "Dates" },
    { label: "Guest" },
    { label: "Status" },
    { label: "Total", className: "text-right" },
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
        {bookingsData?.content?.map((booking: any) => {
          const status = statusConfig[booking.status] || {
            label: booking.status,
            color: "bg-gray-100 text-gray-500 border-gray-200",
            icon: Clock,
          };
          return (
            <tr
              key={booking.id}
              className="hover:bg-gray-50 transition-colors group"
            >
              <td className="px-6 py-4">
                <p className="text-gray-900 font-semibold text-sm group-hover:text-indigo-600 transition-colors">
                  #{booking.confirmationCode}
                </p>
                <p className="text-gray-400 text-[11px] mt-0.5 font-mono">
                  ID: {booking.id.substring(0, 8)}...
                </p>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-700 text-xs font-semibold">
                    {new Date(booking.checkInDate).toLocaleDateString("en-US")}{" "}
                    —{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString("en-US")}
                  </span>
                  <span className="text-gray-400 text-[11px]">
                    Booked:{" "}
                    {new Date(booking.createdAt).toLocaleString("en-US")}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-gray-800 text-sm font-medium">
                  {booking.guestName}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{booking.email}</p>
              </td>
              <td className="px-6 py-4">
                <AdminStatusBadge
                  label={status.label}
                  icon={status.icon}
                  colorClass={status.color}
                />
              </td>
              <td className="px-6 py-4 text-right font-bold text-indigo-600 text-sm">
                {booking.totalAmount?.toLocaleString("en-US")} ₫
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    to={`/bookings/${booking.id}`}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
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
    </div>
  );
}
