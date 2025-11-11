import { Search, MapPin, Calendar, Users } from "lucide-react";

export function SearchBar() {
  return (
    <form className="flex flex-col md:flex-row items-stretch bg-white border border-gray-200 rounded-full shadow-sm overflow-hidden">
      {/* Location */}
      <div className="flex items-center flex-1 px-6 py-4 gap-3">
        <MapPin className="text-gray-500" size={22} />
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-800">Location</div>
          <div className="text-gray-400 text-sm">Add destination</div>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px bg-gray-200"></div>

      {/* Check-in */}
      <div className="flex items-center flex-1 px-6 py-4 gap-3">
        <Calendar className="text-gray-500" size={22} />
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-800">Check in</div>
          <div className="text-gray-400 text-sm">Add dates</div>
        </div>
      </div>

      <div className="hidden md:block w-px bg-gray-200"></div>

      {/* Check-out */}
      <div className="flex items-center flex-1 px-6 py-4 gap-3">
        <Calendar className="text-gray-500" size={22} />
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-800">Check out</div>
          <div className="text-gray-400 text-sm">Add dates</div>
        </div>
      </div>

      <div className="hidden md:block w-px bg-gray-200"></div>

      {/* Guests */}
      <div className="flex items-center flex-1 px-6 py-4 gap-3">
        <Users className="text-gray-500" size={22} />
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-800">Guests</div>
          <div className="text-gray-400 text-sm">Add guests</div>
        </div>
      </div>

      {/* Search button */}
      <button
        type="submit"
        className="bg-sky-600 text-white flex items-center justify-center px-6 md:px-8 hover:bg-sky-700 transition"
      >
        <Search size={22} />
      </button>
    </form>
  );
}
