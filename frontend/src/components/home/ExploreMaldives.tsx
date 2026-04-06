import { ArrowRight } from "lucide-react";
import { useHotelApi } from "../../hooks/useHotelApi";
import { useNavigate } from "react-router-dom";

export default function ExploreMaldives() {
  const navigate = useNavigate();
  const { useDiscoverHotels } = useHotelApi();

  const { data: hotels = [], isLoading } = useDiscoverHotels("Maldives");

  // Only take first 3 for the small preview
  const displayHotels = hotels.slice(0, 3);

  const handleSeeAll = () => {
    navigate(`/hotels?city=Maldives`);
  };

  return (
    <section
      className="relative bg-cover bg-center"
      style={{
        backgroundImage: `url('/images/maldives-explore.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="relative flex flex-col min-h-[600px] md:min-h-screen px-6 md:px-12 lg:px-20 py-16 text-white">
        {/* Text block */}
        <div className="max-w-3xl mt-auto md:mt-0 md:pt-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight uppercase">
            EXPLORE MALDIVES
          </h2>
          <div className="w-24 h-px bg-white mb-6" />
          <p className="text-base md:text-xl mb-8 leading-relaxed max-w-xl text-gray-200">
            Discover the most luxurious and serene islands in the Maldives.
            From overwater villas to underwater restaurants, experience paradise like never before.
          </p>
          <button
            onClick={handleSeeAll}
            className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-100 transition group w-fit"
          >
            See all
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Resort Cards — inline row below text on mobile, absolute bottom-right on desktop */}
        <div className="mt-10 flex gap-4 md:gap-6 justify-start md:justify-end md:absolute md:bottom-10 md:right-10 lg:right-20 flex-wrap md:flex-nowrap">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="w-24 h-32 sm:w-32 sm:h-40 md:w-40 md:h-56 rounded-2xl bg-white/20" />
                <div className="h-4 w-20 mx-auto bg-white/20 rounded" />
              </div>
            ))
          ) : (
            displayHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group cursor-pointer transform transition-all hover:scale-105"
              >
                <div className="w-24 h-32 sm:w-32 sm:h-40 md:w-40 md:h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src={hotel.thumbnailUrl || "/src/assets/images/placeholder-hotel.jpg"}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <p className="text-center mt-3 text-xs sm:text-sm md:text-base font-medium drop-shadow-md">
                  {hotel.name}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
