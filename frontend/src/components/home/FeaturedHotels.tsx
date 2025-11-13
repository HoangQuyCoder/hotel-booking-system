import { useEffect, useState } from "react";
import type { Hotel } from "../../types";
import { searchHotels } from "../../api/hotelApi";
import HotelCard from "../hotel/HotelCard";
import HotelCardSkeleton from "../hotel/HotelCardSkeleton";

export default function FeaturedHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await searchHotels({}, 0, 9);
        setHotels(response.data.content || []);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <section className="pb-16 md:pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            FEATURED HOTELS
          </h2>
        </div>

        {error && <p className="text-center py-8 text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <HotelCardSkeleton key={i} />
              ))
            : hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
        </div>
      </div>
    </section>
  );
}
