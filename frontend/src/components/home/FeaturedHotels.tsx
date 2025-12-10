import HotelCard from "../hotel/HotelCard";
import HotelCardSkeleton from "../hotel/HotelCardSkeleton";
import { useHotelApi } from "../../hooks/useHotelApi";

export default function FeaturedHotels() {
  const { useAllHotels } = useHotelApi();

  const { data, isLoading, isError } = useAllHotels({
    page: 0,
    size: 9,
  });

  const hotels = data?.content ?? [];

  return (
    <section className="pb-16 md:pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            FEATURED HOTELS
          </h2>
        </div>

        {isError && (
          <p className="text-center py-8 text-red-500">Something went wrong</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <HotelCardSkeleton key={i} />
              ))
            : hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
        </div>
      </div>
    </section>
  );
}
