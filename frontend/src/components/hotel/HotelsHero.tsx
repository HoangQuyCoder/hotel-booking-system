import { MapPin, X } from "lucide-react";

interface HotelsHeroProps {
  city?: string;
  keyword?: string;
  totalElements: number;
  isLoading: boolean;
  onClearKeyword: () => void;
}

export default function HotelsHero({
  city,
  keyword,
  totalElements,
  isLoading,
  onClearKeyword,
}: HotelsHeroProps) {
  const displayLocation = city || keyword;

  return (
    <div className="bg-gradient-to-r from-sky-600 to-cyan-500 pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {displayLocation
            ? `Hotels in "${displayLocation}"`
            : "All Hotels"}
        </h1>

        {!isLoading && (
          <p className="text-sky-100 text-sm">
            {totalElements} hotel{totalElements !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Active filter badge */}
        {displayLocation && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full">
            <MapPin size={14} />
            {displayLocation}
            <button
              onClick={onClearKeyword}
              className="hover:bg-white/30 rounded-full p-0.5 transition"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}