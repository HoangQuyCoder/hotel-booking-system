import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHotelApi } from "../../hooks/useHotelApi";
import { useDebounce } from "../../hooks/useDebounce";
import { formatDisplayDate } from "../../utils/format";

export function SearchBar() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  // Suggested Cities
  const [showCities, setShowCities] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const debouncedLocation = useDebounce(location, 300);
  const { useCities } = useHotelApi();
  const { data: cities, isLoading: loadingCities } =
    useCities(debouncedLocation);
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCities(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("city", location.trim());
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests > 0) params.set("guests", String(guests));
    navigate(`/hotels?${params.toString()}`);
  };

  const handleSelectCity = (city: string) => {
    setLocation(city);
    setShowCities(false);
  };

  const displayCheckIn = checkIn ? formatDisplayDate(checkIn) : "Select date";
  const displayCheckOut = checkOut
    ? formatDisplayDate(checkOut)
    : "Select date";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row items-stretch bg-white border 
          border-gray-200 rounded-3xl md:rounded-full shadow-sm"
    >
      {/* ==================== LOCATION ==================== */}
      <div
        ref={cityDropdownRef}
        className="flex-1 relative flex items-center px-5 py-4 md:py-3 gap-3 
             hover:bg-gray-50 transition 
             rounded-t-2xl md:rounded-l-full md:rounded-r-none"
      >
        <MapPin className="text-sky-500 shrink-0" size={20} />
        <div className="text-left flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-700 mb-0.5">
            Location
          </div>
          <input
            type="text"
            value={location}
            onFocus={() => setShowCities(true)}
            onChange={(e) => {
              setLocation(e.target.value);
              setShowCities(true);
            }}
            placeholder="Where are you going?"
            className="w-full text-base md:text-sm text-gray-700 
                 placeholder-gray-400 outline-none bg-transparent 
                 pr-2 md:pr-4 truncate"
          />
        </div>

        {/* Suggestion Dropdown - Đưa ra ngoài overflow-hidden */}
        {showCities && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl z-[100] max-h-60 overflow-y-auto py-2">
            {loadingCities ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
              </div>
            ) : cities && cities.length > 0 ? (
              cities.map((city, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-sky-50 text-left transition"
                >
                  <MapPin size={16} className="text-gray-400" />
                  <span className="truncate">{city}</span>
                </button>
              ))
            ) : location.trim() ? (
              <div className="px-5 py-3 text-sm text-gray-400 italic">
                No cities found
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="hidden md:block w-px bg-gray-200 self-stretch" />
      <div className="md:hidden h-px bg-gray-100 mx-4" />

      {/* ==================== CHECK-IN ==================== */}
      <label className="flex-1 flex items-center px-5 py-4 md:py-3 gap-3 cursor-pointer hover:bg-gray-50 transition relative md:border-r md:border-gray-200">
        <Calendar className="text-sky-500 shrink-0" size={20} />
        <div className="text-left flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-700 mb-0.5">
            Check-in
          </div>
          <div
            onClick={() => checkInRef.current?.showPicker()}
            className="text-sm text-gray-700 cursor-pointer select-none"
          >
            {displayCheckIn}
          </div>
        </div>
        <input
          ref={checkInRef}
          type="date"
          value={checkIn}
          min={today}
          onChange={(e) => {
            const newCheckIn = e.target.value;
            setCheckIn(newCheckIn);

            // Automatically suggest check-out +7 days if there is none or if the check-out is older than the check-in
            if (!checkOut || newCheckIn > checkOut) {
              const date = new Date(newCheckIn);
              date.setDate(date.getDate() + 7);
              setCheckOut(date.toISOString().split("T")[0]);
            }
          }}
          className="absolute inset-0 opacity-0 cursor-pointer pointer-events-none"
        />
      </label>

      <div className="hidden md:block w-px bg-gray-200 self-stretch" />
      <div className="md:hidden h-px bg-gray-100 mx-4" />

      {/* ==================== CHECK-OUT ==================== */}
      <label className="flex-1 flex items-center px-5 py-4 md:py-3 gap-3 cursor-pointer hover:bg-gray-50 transition relative">
        <Calendar className="text-sky-500 shrink-0" size={20} />
        <div className="text-left flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-700 mb-0.5">
            Check-out
          </div>
          <div
            onClick={() => checkOutRef.current?.showPicker()}
            className="text-sm text-gray-700 cursor-pointer select-none"
          >
            {displayCheckOut}
          </div>
        </div>
        <input
          ref={checkOutRef}
          type="date"
          value={checkOut}
          min={checkIn || today}
          onChange={(e) => setCheckOut(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer pointer-events-none"
        />
      </label>

      <div className="hidden md:block w-px bg-gray-200 self-stretch" />
      <div className="md:hidden h-px bg-gray-100 mx-4" />

      {/* ==================== GUESTS ==================== */}
      <label className="flex items-center flex-1 px-5 py-4 md:py-3 gap-3 cursor-pointer hover:bg-gray-50 transition relative">
        <Users className="text-sky-500 shrink-0" size={20} />
        <div className="text-left flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-700 mb-0.5">
            Guests
          </div>
          <input
            type="number"
            value={guests}
            min={1}
            max={20}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="text-sm text-gray-700 outline-none bg-transparent"
          />
        </div>
      </label>

      <button
        type="submit"
        className="bg-sky-600 text-white flex items-center justify-center gap-2 px-8 py-4 md:py-0 hover:bg-sky-700 active:bg-sky-800 transition font-semibold text-sm md:rounded-r-full rounded-b-2xl md:rounded-bl-none"
      >
        <Search size={20} />
        <span className="md:hidden">Search Hotels</span>
      </button>
    </form>
  );
}
