import { useState, useRef, useMemo, useEffect } from "react";
import { Calendar, Users, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import type { HotelDetailResponse, RoomTypeResponse } from "../../types";
import { calculateTotalPrice } from "../../utils/pricing";
import { useBookingApi } from "../../hooks/useBookingApi";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { BookingRequest } from "../../types";

type SelectedRoom = {
  roomTypeId: string;
  quantity: number;
};

type RoomCalculation = {
  roomTypeId: string;
  quantity: number;
  roomType: RoomTypeResponse | null;
  total: number;
  nights: number;
  avgPrice: number;
};

export default function BookingCard({ hotel }: { hotel: HotelDetailResponse }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([
    {
      roomTypeId: hotel.roomTypes?.[0]?.id || "",
      quantity: 1,
    },
  ]);

  const [error, setError] = useState<string | null>(null);

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  const { createBooking } = useBookingApi();

  // Calculate total price for each room type
  const roomCalculations = useMemo<RoomCalculation[]>(() => {
    if (!checkIn || !checkOut) {
      return selectedRooms.map((sel) => ({
        ...sel,
        roomType: null,
        total: 0,
        nights: 0,
        avgPrice: 0,
      }));
    }

    return selectedRooms.map((sel) => {
      const roomType = hotel.roomTypes?.find((rt) => rt.id === sel.roomTypeId);

      if (!roomType) {
        return {
          ...sel,
          roomType: null,
          total: 0,
          nights: 0,
          avgPrice: 0,
        };
      }

      const { total: singleRoomTotal, breakdown } = calculateTotalPrice(
        roomType.baseRates,
        roomType.dailyOverrides || [],
        checkIn,
        checkOut,
      );

      const total = singleRoomTotal * sel.quantity;
      const nights = breakdown.length;
      const avgPricePerNight = nights ? Math.round(total / nights) : 0;

      return {
        ...sel,
        roomType,
        total,
        nights,
        avgPrice: avgPricePerNight,
      };
    });
  }, [selectedRooms, checkIn, checkOut, hotel.roomTypes]);

  // Total price & general information
  const grandTotal = roomCalculations.reduce(
    (sum, item) => sum + item.total,
    0,
  );
  const totalNights = roomCalculations[0]?.nights || 0;

  const maxGuests = roomCalculations.reduce((sum, item) => {
    return sum + (item.roomType?.capacity || 0) * item.quantity;
  }, 0);

  // Auto adjust number of guests if it exceeds the capacity
  useEffect(() => {
    const currentGuests = Number(guests);
    if (currentGuests > maxGuests && maxGuests > 0) {
      setGuests(maxGuests.toString());
    }
  }, [maxGuests]);

  // Add new roomtype
  const addRoomSelection = () => {
    if (!hotel.roomTypes?.length) return;

    const usedIds = new Set(selectedRooms.map((r) => r.roomTypeId));
    const availableRoom = hotel.roomTypes.find((rt) => !usedIds.has(rt.id));

    if (availableRoom) {
      setSelectedRooms([
        ...selectedRooms,
        { roomTypeId: availableRoom.id, quantity: 1 },
      ]);
    }
  };

  const updateRoomSelection = (
    index: number,
    updates: Partial<SelectedRoom>,
  ) => {
    const newRooms = [...selectedRooms];
    newRooms[index] = { ...newRooms[index], ...updates };
    setSelectedRooms(newRooms);
  };

  const removeRoomSelection = (index: number) => {
    if (selectedRooms.length === 1) return;
    setSelectedRooms(selectedRooms.filter((_, i) => i !== index));
  };

  const getAvailableOptions = (currentIndex: number) => {
    const usedIds = new Set(
      selectedRooms
        .filter((_, i) => i !== currentIndex)
        .map((r) => r.roomTypeId),
    );
    return hotel.roomTypes?.filter((rt) => !usedIds.has(rt.id)) || [];
  };

  const isAddDisabled = selectedRooms.length >= (hotel.roomTypes?.length || 0);

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    if (!checkIn || !checkOut || selectedRooms.length === 0) {
      setError("Please fill in all required fields.");
      return;
    }

    const guestsNum = Number(guests);
    if (guestsNum > maxGuests) {
      setError(`This selection allows up to ${maxGuests} guests.`);
      return;
    }

    const payload: BookingRequest = {
      hotelId: hotel.id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestCount: guestsNum,
      bookingRooms: selectedRooms.map((room) => ({
        roomTypeId: room.roomTypeId,
        quantity: room.quantity,
      })),
    };

    try {
      const res = await createBooking.mutateAsync(payload);
      navigate(`/bookings/${res.data.id}`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err.message || "Failed to book";
      setError(msg);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
      {/* Price Summary */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-3xl font-bold text-cyan-600">
            ${totalNights ? Math.round(grandTotal / totalNights) : 0}
          </p>
          <p className="text-sm text-gray-500">avg per night</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold">${grandTotal}</p>
          <p className="text-xs text-gray-500">
            {totalNights} night{totalNights !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 hover:border-cyan-400 focus-within:border-cyan-500 transition">
              <Calendar
                className="w-5 h-5 text-gray-400 mr-2 cursor-pointer"
                onClick={() => checkInRef.current?.showPicker()}
              />
              <input
                ref={checkInRef}
                type="date"
                value={checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full outline-none text-sm bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 hover:border-cyan-400 focus-within:border-cyan-500 transition">
              <Calendar
                className="w-5 h-5 text-gray-400 mr-2 cursor-pointer"
                onClick={() => checkOutRef.current?.showPicker()}
              />
              <input
                ref={checkOutRef}
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full outline-none text-sm bg-white"
              />
            </div>
          </div>
        </div>

        {/* Room Types */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Room Types
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRoomSelection}
              disabled={isAddDisabled}
              className="flex items-center gap-1 text-xs bg-cyan-500"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Room Type
            </Button>
          </div>

          <div className="space-y-3">
            {selectedRooms.map((sel, index) => {
              const calc = roomCalculations[index];
              const availableOptions = getAvailableOptions(index);

              return (
                <div key={index} className="border rounded-xl p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <select
                      value={sel.roomTypeId}
                      onChange={(e) =>
                        updateRoomSelection(index, {
                          roomTypeId: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                    >
                      {availableOptions.map((rt) => (
                        <option key={rt.id} value={rt.id}>
                          {rt.name} ({rt.capacity} guests, {rt.sizeSqm}m²)
                        </option>
                      ))}
                    </select>

                    {selectedRooms.length > 1 && (
                      <button
                        onClick={() => removeRoomSelection(index)}
                        className="ml-2 text-red-500 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">
                        Number of Rooms
                      </label>
                      <select
                        value={sel.quantity}
                        onChange={(e) =>
                          updateRoomSelection(index, {
                            quantity: Number(e.target.value),
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-white mt-1"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} Room{n > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {calc?.roomType && (
                      <div className="flex-1 text-right">
                        <p className="text-sm font-medium">${calc.total}</p>
                        <p className="text-xs text-gray-500">
                          ${calc.avgPrice} avg/night
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Guests
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Users className="w-5 h-5 text-gray-400 mr-2" />
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full outline-none text-sm bg-white font-medium"
            >
              {Array.from(
                { length: Math.max(maxGuests, 1) },
                (_, i) => i + 1,
              ).map((n) => (
                <option key={n} value={n}>
                  {n} Guest{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Maximum capacity: {maxGuests} guests
          </p>
        </div>

        {error && <p className="text-xs text-red-600 text-center">{error}</p>}

        <Button
          variant="primary"
          block
          onClick={handleBookNow}
          disabled={
            createBooking.isPending || !checkIn || !checkOut || grandTotal === 0
          }
        >
          {createBooking.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Book Now - $${grandTotal}`
          )}
        </Button>

        <p className="text-xs text-center text-gray-500">
          You won't be charged yet
        </p>
      </div>
    </div>
  );
}
