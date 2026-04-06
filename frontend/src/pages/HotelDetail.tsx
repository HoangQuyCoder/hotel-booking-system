import { useParams } from "react-router-dom";
import Gallery from "../components/hotel/Gallery";
import Info from "../components/hotel/Info";
import TabsContent from "../components/hotel/TabsContent";
import Reviews from "../components/hotel/Reviews";
import BookingCard from "../components/booking/BookingCard";
import { useHotelApi } from "../hooks/useHotelApi";
import HotelDetailSkeleton from "../components/skeleton/HotelDetailSkeleton";

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const { useHotelById } = useHotelApi();

  const { data: hotel, isLoading, isError, error } = useHotelById(id!);

  if (isLoading) return <HotelDetailSkeleton />;

  if (isError) {
    const status = (error as any)?.response?.status;

    if (status === 404) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Hotel not found
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Something went wrong. Please try again later.
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No hotel details found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Gallery hotel={hotel} />

      <div className="max-w-8xl mx-auto px-8 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <Info hotel={hotel} />
          <TabsContent hotel={hotel} />
          <Reviews hotel={hotel} />
        </div>

        <div className="lg:col-span-5">
          <BookingCard hotel={hotel} />
        </div>
      </div>
    </div>
  );
}
