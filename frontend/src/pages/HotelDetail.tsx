import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Gallery from "../components/hotel/Gallery";
import Info from "../components/hotel/Info";
import TabsContent from "../components/hotel/TabsContent";
import Reviews from "../components/hotel/Reviews";
import BookingCard from "../components/hotel/BookingCard";
import Map from "../components/hotel/Map";
import { getHotelById } from "../api/hotelApi";
import type { Hotel } from "../types";

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    getHotelById(id)
      .then((res) => {
        setHotel(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.message ?? "Không thể tải dữ liệu khách sạn.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen font-sans bg-gray-50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded mb-6" />
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-40 bg-gray-200 rounded" />
                <div className="h-40 bg-gray-200 rounded" />
                <div className="h-40 bg-gray-200 rounded" />
              </div>
              <div className="lg:col-span-1 space-y-4">
                <div className="h-40 bg-gray-200 rounded" />
                <div className="h-40 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen font-sans bg-gray-50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="text-red-600">Lỗi: {error}</div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return null;
  }

  return (
    <div className="min-h-screen font-sans bg-gray-50 overflow-x-hidden">
      <div className="">
        <Gallery hotel={hotel} />
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 a">
            <Info hotel={hotel} />
            <TabsContent hotel={hotel} />
            <Reviews hotel={hotel} />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <BookingCard hotel={hotel} />
            <Map hotel={hotel} />
          </div>
        </div>
      </div>
    </div>
  );
}
