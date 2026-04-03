import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import HotelCardSkeleton from "../skeleton/HotelCardSkeleton";
import HotelCard from "../hotel/HotelCard";
import { useHotelApi } from "../../hooks/useHotelApi";

export default function TopHotels() {
  const { useFeaturedHotels } = useHotelApi();
  const { data: hotels = [], isLoading, isError } = useFeaturedHotels();

  return (
    <section className="pb-16 md:pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Top Hotels
            </h2>
            <p className="text-gray-500 mt-2">Handpicked luxury stays for you</p>
          </div>

          {/* See All Button */}
          <Link
            to="/hotels"
            className="no-underline group flex items-center text-cyan-600 font-semibold hover:text-cyan-700 transition"
          >
            See all
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Error Message */}
        {isError && (
          <p className="text-center py-8 text-red-500">
            Something went wrong while fetching hotels.
          </p>
        )}

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
              <HotelCardSkeleton key={i} />
            ))
            : hotels.slice(0, 6).map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
        </div>
      </div>
    </section>
  );
}