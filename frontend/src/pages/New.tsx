import { useEffect } from "react";
import { Sparkles, ArrowRight, X, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useHotelApi } from "../hooks/useHotelApi";
import HotelCardSkeleton from "../components/skeleton/HotelCardSkeleton";
import HotelCard from "../components/hotel/HotelCard";

export default function New() {
  const { useNewestHotels } = useHotelApi();
  const { data: hotels, isLoading, isError } = useNewestHotels();

  useEffect(() => {
    document.title = "Newest Hotels | Hotel Booking System";
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative h-[75vh] min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image with Zoom effect */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-new.png" 
            alt="Newest Hotels" 
            className="w-full h-full object-cover"
          />
          {/* Overlay for readability and navbar contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/20 z-10" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md text-cyan-200 text-sm font-semibold mb-6 border border-cyan-400/30">
              <Sparkles className="w-4 h-4" />
              <span>Just Added</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
              Discover Our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                Newest
              </span> Destinations
            </h1>
            
            <p className="text-xl text-slate-100 leading-relaxed mb-10 max-w-2xl drop-shadow-sm">
              Be the first to experience our latest additions. From boutique urban escapes to tranquil coastal retreats, explore our freshest listings curated just for you.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/hotels" 
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-cyan-50 transition-all shadow-xl no-underline"
              >
                Explore All Hotels
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2 font-display">
              New Arrivals
            </h2>
            <p className="text-slate-500">
              Hand-picked hotels that recently joined our network
            </p>
          </div>

          <div className="text-sm font-medium text-slate-400">
            Showing {hotels?.length || 0} latest properties
          </div>
        </div>

        {isError && (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Failed to load new hotels
            </h3>
            <p className="text-slate-500 mb-6">
              We're having trouble fetching the latest listings. Please try
              again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white border border-slate-200 px-6 py-2 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <HotelCardSkeleton key={i} />
              ))
            : hotels?.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
        </div>

        {!isLoading && hotels?.length === 0 && (
          <div className="bg-slate-50 rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No new hotels yet
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Check back soon! We're constantly adding premium destinations to
              our collection.
            </p>
            <Link
              to="/hotels"
              className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors no-underline"
            >
              Browse existing hotels instead
            </Link>
          </div>
        )}
      </main>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
            Don't miss a single opening
          </h3>
          <p className="text-cyan-50 text-lg mb-8 max-w-xl mx-auto relative z-10">
            Join our newsletter to get exclusive early access to new hotel
            openings and special member-only deals.
          </p>

          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 relative z-10">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
            <button className="bg-white text-cyan-700 px-8 py-4 rounded-2xl font-bold hover:bg-cyan-50 transition-all whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
