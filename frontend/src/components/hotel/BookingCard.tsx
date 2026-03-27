import { useState, useRef, useMemo } from "react";
import { Calendar, Users, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import type { HotelDetailResponse } from "../../types";
import { calculateTotalPrice } from "../../utils/pricing";
import { useBookingApi } from "../../hooks/useBookingApi";

export default function BookingCard({ hotel }: { hotel: HotelDetailResponse }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  const { createBooking } = useBookingApi();

  // Auto-select first room type
  useMemo(() => {
    if (!selectedRoomTypeId && hotel.roomTypes?.length) {
      setSelectedRoomTypeId(hotel.roomTypes[0].id);
    }
  }, [hotel.roomTypes, selectedRoomTypeId]);

  const selectedRoomType = hotel.roomTypes?.find(
    (rt) => rt.id === selectedRoomTypeId
  );

  // Calculate total price
  const { total, breakdown } = useMemo(() => {
    if (!selectedRoomType || !checkIn || !checkOut) {
      return { total: 0, breakdown: [] };
    }
    return calculateTotalPrice(
      selectedRoomType.baseRates,
      selectedRoomType.dailyOverrides || [],
      checkIn,
      checkOut
    );
  }, [selectedRoomType, checkIn, checkOut]);

  const avgPricePerNight = breakdown.length
    ? Math.round(total / breakdown.length)
    : 0;
  const nights = breakdown.length;

  // Handle booking
  const handleBookNow = async () => {
    if (!selectedRoomType || !checkIn || !checkOut || !hotel.id) {
      setError("Please fill in all required fields.");
      return;
    }

    const guestsNum = Number(guests);
    if (guestsNum > selectedRoomType.capacity) {
      setError(
        `This room allows up to ${selectedRoomType.capacity} guests only.`
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      hotelId: hotel.id,
      roomTypeId: selectedRoomType.id,
      checkIn,
      checkOut,
      guests: guestsNum,
      totalPrice: total,
    };

    // try {
    //   const result = await createBooking(payload);
    //   alert(`Booking successful! ID: ${result.id}`);
    //   // Optional: redirect or reset form
    // } catch (err: unknown) {
    //   const errorMessage =
    //     err instanceof Error
    //       ? err.message
    //       : "Something went wrong. Please try again.";
    //   setError(errorMessage);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
      {/* Price Summary */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-3xl font-bold text-cyan-600">
            ${avgPricePerNight}
          </p>
          <p className="text-sm text-gray-500">avg per night</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-xl font-bold">${total}</p>
          <p className="text-xs text-gray-500">
            {nights} night{nights !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Check-in */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 hover:border-cyan-400 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100 transition">
            <Calendar
              className="w-5 h-5 text-gray-400 mr-2 cursor-pointer hover:text-cyan-500"
              onClick={() => checkInRef.current?.showPicker()}
            />
            <input
              ref={checkInRef}
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full outline-none text-sm bg-white text-gray-700"
            />
          </div>
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 hover:border-cyan-400 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100 transition">
            <Calendar
              className="w-5 h-5 text-gray-400 mr-2 cursor-pointer hover:text-cyan-500"
              onClick={() => checkOutRef.current?.showPicker()}
            />
            <input
              ref={checkOutRef}
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full outline-none text-sm bg-white text-gray-700"
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 hover:border-cyan-400 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100 transition">
            <Users className="w-5 h-5 text-gray-400 mr-2" />
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full outline-none text-sm bg-white text-gray-700"
            >
              {Array.from(
                { length: selectedRoomType?.capacity ?? 2 },
                (_, i) => i + 1
              ).map((n) => (
                <option key={n} value={n}>
                  {n} Guest{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Type
          </label>
          <select
            value={selectedRoomTypeId ?? ""}
            onChange={(e) => setSelectedRoomTypeId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
          >
            {hotel.roomTypes?.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.name} ({rt.capacity} guests, {rt.sizeSqm}m²)
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && <p className="text-xs text-red-600 text-center">{error}</p>}

        {/* Book Button */}
        <Button
          variant="primary"
          block
          onClick={handleBookNow}
          disabled={isSubmitting || !checkIn || !checkOut || total === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Book Now"
          )}
        </Button>

        <p className="text-xs text-center text-gray-500">
          You won't be charged yet
        </p>
      </div>
    </div>
  );
}
