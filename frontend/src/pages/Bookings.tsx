import { useAuth } from "../hooks/useAuth";
import { useBookingApi } from "../hooks/useBookingApi";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  CheckCircle2,
  XSquare,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function Bookings() {
  const { user } = useAuth();
  const { useBookings } = useBookingApi();

  const { data, isLoading, isError } = useBookings({ userId: user?.id });
  const bookings = data?.content || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full uppercase tracking-wider">
            <CheckCircle2 size={12} />
            Confirmed
          </span>
        );
      case "PENDING":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-black rounded-full uppercase tracking-wider">
            <Clock size={12} />
            Pending Payment
          </span>
        );
      case "CANCELLED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs font-black rounded-full uppercase tracking-wider">
            <XSquare size={12} />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-black rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl text-white font-black tracking-tight mb-2">
              My Bookings
            </h1>
            <p className="text-gray-400 font-medium italic">
              Track your luxury stays and travel experiences
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
            <span className="text-sm font-bold text-gray-400">TOTAL:</span>
            <span className="text-xl font-black text-cyan-600">
              {bookings.length}
            </span>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
              Loading your adventures...
            </p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100 flex items-center gap-6 text-red-700">
            <AlertCircle size={48} />
            <div>
              <h4 className="text-xl font-black uppercase">
                Something went wrong
              </h4>
              <p>
                We couldn't load your bookings. Pull to refresh or try again
                later.
              </p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center shadow-xl border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
              <CalendarDays size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              No bookings found yet
            </h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">
              Ready to start your next adventure? Explore our luxury destination
              selections.
            </p>
            <Button to="/hotels" variant="primary" size="lg">
              Explore Hotels
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col md:flex-row"
              >
                {/* Visual side bar */}
                <div
                  className={`w-2 h-auto ${
                    booking.status === "CONFIRMED"
                      ? "bg-green-500"
                      : booking.status === "PENDING"
                        ? "bg-amber-500"
                        : "bg-gray-300"
                  }`}
                />

                <div className="flex-1 p-8 flex flex-col md:flex-row items-center gap-8">
                  {/* Info Part */}
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                        {booking.hotelName}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-cyan-600" />
                        <span className="font-bold">{booking.checkInDate}</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {booking.checkOutDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Part */}
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Total Stay
                      </p>
                      <p className="text-3xl font-black text-gray-900">
                        ${booking.totalAmount}
                      </p>
                    </div>

                    <Link
                      to={`/bookings/${booking.id}`}
                      className="p-4 bg-gray-50 rounded-full text-gray-400 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-inner"
                    >
                      <ChevronRight size={24} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
