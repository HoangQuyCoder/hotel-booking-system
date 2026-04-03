import { useParams } from "react-router-dom";
import Gallery from "../components/hotel/Gallery";
import Info from "../components/hotel/Info";
import TabsContent from "../components/hotel/TabsContent";
import Reviews from "../components/hotel/Reviews";
import BookingCard from "../components/booking/BookingCard";
import Map from "../components/hotel/Map";
import { useHotelApi } from "../hooks/useHotelApi";
import HotelDetailSkeleton from "../components/skeleton/HotelDetailSkeleton";
import NotFoundPage from "./NotFoundPage";

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const { useHotelById } = useHotelApi();

  const { data: hotel, isLoading, isError, error } = useHotelById(id!);

  if (isLoading) return <HotelDetailSkeleton />;

  if (isError) {
    const status = (error as any)?.response?.status;

    if (status === 404) {
      return <NotFoundPage />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        "Something went wrong"
      </div>
    );
  }

  if (!hotel) return <NotFoundPage />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Gallery hotel={hotel} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Info hotel={hotel} />
          <TabsContent hotel={hotel} />
          <Reviews hotel={hotel} />
        </div>

        <div className="space-y-8">
          <BookingCard hotel={hotel} />
          <Map hotel={hotel} />
        </div>
      </div>
    </div>
  );
}