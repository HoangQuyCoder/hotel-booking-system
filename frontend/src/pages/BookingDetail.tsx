import { useParams, useNavigate } from "react-router-dom";
import { useBookingApi } from "../hooks/useBookingApi";
import { useTransactionApi } from "../hooks/useTransactionApi";
import {
  Calendar,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Hotel,
  Bed,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { CurrencyCode, PaymentMethod } from "../types/enum";
import type { TransactionRequest } from "../types";

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useBookingById, cancelBooking } = useBookingApi();
  const { createTransaction } = useTransactionApi();

  const { data: booking, isLoading, isError } = useBookingById(id!);

  const handlePayment = async () => {
    if (!booking) return;

    const payload: TransactionRequest = {
      bookingId: booking.id!,
      amount: booking.totalAmount,
      currency: CurrencyCode.USD,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      gatewayRef: `GTW-${Math.random().toString(36).substring(7).toUpperCase()}`,
    };

    // TODO: Implement payment gateway
    await createTransaction.mutateAsync(payload, {
      onSuccess: () => {
        navigate("/bookings");
      },
    });
    // After payment, the booking status might update via the backend.
    // We can refetch or just wait for the cache invalidation from the transaction hook.
  };

  const handleCancel = async () => {
    if (
      !booking ||
      !window.confirm("Are you sure you want to cancel this booking?")
    )
      return;

    await cancelBooking.mutateAsync(booking.id!, {
      onSuccess: () => {
        navigate("/bookings");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold">Booking not found</h2>
        <Button onClick={() => navigate("/")} variant="outline">
          Back to Home
        </Button>
      </div>
    );
  }

  const isPending = booking.status === "PENDING";
  const isConfirmed = booking.status === "CONFIRMED";

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm">
          {/* Header Status */}
          <div
            className={`px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b transition-colors duration-500 ${
              isConfirmed
                ? "bg-green-50/80 border-green-100"
                : "bg-cyan-50/80 border-cyan-100"
            }`}
          >
            <div className="flex flex-col items-center md:items-start">
              <p className="text-xs font-bold text-cyan-800/60 mb-2 uppercase tracking-[0.2em]">
                Booking Status
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-full ${
                    isConfirmed
                      ? "bg-green-100 text-green-600"
                      : "bg-cyan-100 text-cyan-600"
                  }`}
                >
                  {isConfirmed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Clock className="w-6 h-6 animate-pulse" />
                  )}
                </div>
                <span
                  className={`text-2xl font-black ${
                    isConfirmed ? "text-green-800" : "text-cyan-800"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <p className="text-xs font-bold text-cyan-800/60 mb-2 uppercase tracking-[0.2em]">
                Confirmation Code
              </p>
              <p className="text-3xl font-mono font-black text-gray-900 tracking-tighter">
                {booking.confirmationCode || "Generating..."}
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Balanced Hotel Info Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Hotel Image Card */}
              <div className="lg:col-span-5 h-64 lg:h-auto min-h-[16rem] rounded-3xl overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {booking.hotel?.thumbnailUrl ? (
                  <img
                    src={booking.hotel.thumbnailUrl}
                    alt={booking.hotel.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100/50 flex items-center justify-center">
                    <Hotel className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Hotel & Date Info */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-3">
                    {booking.hotel?.name || "Premium Hotel Selection"}
                  </h3>
                  <div className="flex items-center text-gray-500 gap-2 mb-6">
                    <div className="p-1.5 bg-cyan-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-cyan-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {booking.hotel?.address || "Location detail pending..."}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3 hover:border-cyan-200 transition-colors">
                    {/* Icon */}
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Calendar className="w-5 h-5 text-cyan-600" />
                    </div>

                    {/* Content */}
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                        Check-in
                      </p>
                      <p className="text-base font-semibold text-gray-800">
                        {booking.checkInDate}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3 hover:border-cyan-200 transition-colors">
                    {/* Icon */}
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Calendar className="w-5 h-5 text-cyan-600" />
                    </div>

                    {/* Content */}
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                        Check-out
                      </p>
                      <p className="text-base font-semibold text-gray-800">
                        {booking.checkOutDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Summary & Enhanced RoomType Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cyan-600 rounded-full" />
                  Booking Summary
                </h4>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        Guests
                      </span>
                    </div>
                    <span className="text-lg font-black text-gray-900">
                      {booking.guestCount} guests
                    </span>
                  </div>

                  {/* Rooms listing with more details */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 px-2">
                      Detailed Room Selection
                    </p>
                    {booking.bookingRooms?.map((br, idx) => (
                      <div
                        key={idx}
                        className="group p-5 bg-white border border-gray-100 rounded-3xl hover:border-cyan-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-black text-gray-900 mb-1 flex items-center gap-2">
                              <Bed className="w-5 h-5 text-cyan-600" />
                              {br.roomType?.name}
                            </h5>
                            <div className="flex gap-4 text-[10px] text-gray-500 font-bold uppercase">
                              <span>MAX: {br.roomType?.capacity} GUESTS</span>
                              <span>SIZE: {br.roomType?.sizeSqm}m²</span>
                            </div>
                          </div>
                          <div className="bg-cyan-50 text-cyan-800 px-3 py-1 rounded-xl text-xs font-black">
                            x{br.quantity} Room{br.quantity > 1 ? "s" : ""}
                          </div>
                        </div>
                        {br.roomType?.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed italic">
                            {br.roomType.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="bg-gray-50/50 rounded-[2.5rem] p-8 border border-gray-100 space-y-6">
                  <h4 className="text-xl font-black text-gray-900">
                    Payment Breakdown
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-500 font-medium">
                      <span>Subtotal</span>
                      <span>${booking.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 font-medium">
                      <span>Service Fee</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-500 font-medium">
                      <span>Taxes & Fees</span>
                      <span className="text-green-600">Included</span>
                    </div>
                    <div className="pt-6 border-t-2 border-dashed border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                          Total to Pay
                        </span>
                        <span className="text-4xl font-black text-cyan-700 tracking-tighter">
                          ${booking.totalAmount}
                        </span>
                      </div>
                      <p className="text-[10px] text-right text-gray-400 mt-2 font-bold uppercase">
                        Secure Transaction via GTS Payment Gateway
                      </p>
                    </div>
                  </div>

                  {/* Payment Section */}
                  {isPending && (
                    <div className="space-y-4 mt-6">
                      <Button
                        onClick={handlePayment}
                        disabled={
                          createTransaction.isPending || cancelBooking.isPending
                        }
                        leftIcon={
                          <CreditCard className="w-6 h-6 text-cyan-400" />
                        }
                        className="w-full py-4 bg-gradient-to-r from-gray-900 to-blue-900 hover:scale-[1.02] text-white font-black py-6 rounded-2xl shadow-2xl shadow-blue-900/30 transition-all active:scale-95 text-lg flex items-center justify-center gap-3"
                      >
                        {createTransaction.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>Pay ${booking.totalAmount} Now</>
                        )}
                      </Button>

                      <Button
                        onClick={handleCancel}
                        disabled={
                          cancelBooking.isPending || createTransaction.isPending
                        }
                        leftIcon={<AlertCircle className="w-4 h-4" />}
                        className="w-full border-2 bg-red-400 border-red-200 text-white hover:bg-red-500 hover:border-red-300 font-bold py-2 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        {cancelBooking.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>Cancel Booking</>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {isConfirmed && (
                  <div className="space-y-4">
                    <div className="mt-6 p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4">
                      <div className="p-3 bg-white rounded-full shadow-sm text-green-600">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-green-800 uppercase text-xs tracking-widest">
                          Everything is ready!
                        </p>
                        <p className="text-sm text-green-700 leading-tight">
                          Your booking is confirmed. We've sent the invoice to
                          your email.
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleCancel}
                      disabled={cancelBooking.isPending}
                      variant="outline"
                      className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {cancelBooking.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4" />
                          Cancel Booking
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
