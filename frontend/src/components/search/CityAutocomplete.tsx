import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCitySuggestions } from "../../api/hotelApi";
import { useDebounce } from "../../hooks/useDebounce";
import { MapPin } from "lucide-react";

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const debouncedQuery = useDebounce(inputValue, 300);

  const { data: cities = [], isFetching } = useQuery({
    queryKey: ["cities", debouncedQuery],
    queryFn: () => getCitySuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className={`w-full ${className}`}
        autoComplete="off"
      />

      {isFetching && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {debouncedQuery.length >= 2 && cities.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 max-h-64 overflow-y-auto">
          {cities.map((city) => (
            <li
              key={city}
              onClick={() => {
                setInputValue(city);
                onChange(city);
              }}
              className="px-4 py-3 hover:bg-violet-50 cursor-pointer flex items-center gap-2 text-gray-700"
            >
              <MapPin className="w-4 h-4 text-violet-600" />
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
