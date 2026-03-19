import { useParams } from "react-router-dom";
import Gallery from "../components/hotel/Gallery";
import Info from "../components/hotel/Info";
import TabsContent from "../components/hotel/TabsContent";
import Reviews from "../components/hotel/Reviews";
import BookingCard from "../components/hotel/BookingCard";
import Map from "../components/hotel/Map";
import { useHotelApi } from "../hooks/useHotelApi";

export default function HotelDetail() {
  const { id } = useParams();
  const { useHotel } = useHotelApi();

  const { data: hotel, isLoading, isError, error } = useHotel(id);

  // LOADING UI
  if (isLoading) {
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

  // ERROR UI
  if (isError) {
    return (
      <div className="min-h-screen font-sans bg-gray-50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="text-red-600">
            Lỗi: {(error as Error)?.message ?? "Không thể tải dữ liệu"}
          </div>
        </div>
      </div>
    );
  }

  // Không có data
  if (!hotel) return null;

  return (
    <div className="min-h-screen font-sans bg-gray-50 overflow-x-hidden">
      <div>
        <Gallery hotel={hotel} />
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
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
