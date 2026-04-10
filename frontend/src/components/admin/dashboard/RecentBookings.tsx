import { Link } from "react-router-dom";
import { Clock, type LucideIcon } from "lucide-react";
import type { BookingListResponse } from "../../../types";
import { AdminStatusBadge } from "../AdminStatusBadge";

interface RecentBookingsProps {
  bookings: BookingListResponse[];
  isLoading?: boolean;
}

export default function RecentBookings({
  bookings = [],
  isLoading = false,
}: RecentBookingsProps) {
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
      icon: Clock,
    },
    CHECKED_IN: {
      label: "Checked In",
      color: "bg-sky-50 text-sky-600 border-sky-200",
      icon: Clock,
    },
    CHECKED_OUT: {
      label: "Checked Out",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: Clock,
    },
    CANCELLED: {
      label: "Cancelled",
      color: "bg-red-50 text-red-500 border-red-200",
      icon: Clock,
    },
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm">Loading...</div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
            <Clock className="w-4.5 h-4.5 text-indigo-500" />
          </div>
          <h2 className="text-gray-800 font-bold text-sm uppercase tracking-wider">
            Recent Bookings
          </h2>
        </div>
        <Link
          to="/admin/bookings"
          className="text-indigo-600 text-xs font-semibold hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-200"
        >
          View all →
        </Link>
      </div>

      {/* List */}
      <div className="space-y-3">
        {bookings.length > 0 ? (
          bookings.map((booking: BookingListResponse) => {
            const status = statusConfig[booking.status] || {
              label: booking.status,
              color: "bg-gray-100 text-gray-500 border-gray-200",
              icon: Clock,
            };

            return (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200 group"
              >
                <div className="min-w-0">
                  <p className="text-gray-800 text-sm font-semibold mb-0.5 group-hover:text-indigo-600 transition-colors">
                    #{booking.confirmationCode}
                  </p>
                  <p className="text-gray-400 text-[11px] font-medium">
                    {new Date(booking.createdAt).toLocaleDateString("en-US")}
                  </p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-gray-800 text-sm font-bold">
                      {booking.totalAmount?.toLocaleString("en-US")} ₫
                    </p>
                  </div>
                  <AdminStatusBadge
                    label={status.label}
                    icon={status.icon}
                    colorClass={status.color}
                    className="!px-2 !py-0.5 !text-[10px]"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-400 font-medium text-sm">
              No recent bookings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
