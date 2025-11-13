import { useState, useRef } from "react";
import { Calendar, Users } from "lucide-react";
import { Button } from "../ui/Button";
import type { Hotel } from "../../types";

function nightsBetween(a?: string, b?: string) {
  if (!a || !b) return 1;
  const d1 = new Date(a);
  const d2 = new Date(b);
  const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

export default function BookingCard({ hotel }: { hotel: Hotel }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  const price = (hotel as any)?.pricePerNight ?? (hotel as any)?.price ?? 299;
  const nights = nightsBetween(checkIn, checkOut);
  const total = price * nights;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-3xl font-bold text-cyan-600">${price}</p>
          <p className="text-sm text-gray-500">per night</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-xl font-bold">${total}</p>
          <p className="text-xs text-gray-500">
            {nights} night{nights > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <div
            className="flex items-center border rounded-lg px-3 py-2 
              hover:border-cyan-400 focus-within:border-cyan-500 
              focus-within:ring-2 focus-within:ring-cyan-100 
              transition duration-200"
          >
            <Calendar
              className="w-5 h-5 text-gray-400 mr-2 cursor-pointer transition-colors duration-200 hover:text-cyan-500"
              onClick={() => checkInRef.current?.showPicker()}
            />
            <input
              ref={checkInRef}
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full outline-none text-sm bg-white text-gray-700
                [appearance:none] [&::-webkit-calendar-picker-indicator]:hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out
          </label>
          <div
            className="flex items-center border rounded-lg px-3 py-2 
              hover:border-cyan-400 focus-within:border-cyan-500 
              focus-within:ring-2 focus-within:ring-cyan-100 
              transition duration-200"
          >
            <Calendar
              className="w-5 h-5 text-gray-400 mr-2 cursor-pointer transition-colors duration-200 hover:text-cyan-500"
              onClick={() => checkOutRef.current?.showPicker()}
            />
            <input
              ref={checkOutRef}
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full outline-none text-sm bg-white text-gray-700
                [appearance:none] [&::-webkit-calendar-picker-indicator]:hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <div
            className="flex items-center border rounded-lg px-3 py-2 
              hover:border-cyan-400 focus-within:border-cyan-500 
              focus-within:ring-2 focus-within:ring-cyan-100 
              transition duration-200"
          >
            <Users className="w-5 h-5 text-gray-400 mr-2 transition-colors duration-200 hover:text-cyan-500" />
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full outline-none text-sm bg-white text-gray-700"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button variant="primary" block>
          Book Now
        </Button>

        <p className="text-xs text-center text-gray-500">
          You won't be charged yet
        </p>
      </div>
    </div>
  );
}
