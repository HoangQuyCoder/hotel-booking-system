// src/components/search/HotelSearchForm.tsx
import { useForm, Controller } from "react-hook-form";
import { Search, Users, Calendar } from "lucide-react";
import { CityAutocomplete } from "./CityAutocomplete";
import { type SearchFilters } from "../../types";

interface HotelSearchFormProps {
  onSearch: (filters: SearchFilters) => void;
}

export const HotelSearchForm: React.FC<HotelSearchFormProps> = ({
  onSearch,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const { control, register, handleSubmit, watch } = useForm<SearchFilters>({
    defaultValues: { guests: 2 },
  });

  const checkIn = watch("checkIn");

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      className="bg-white p-6 rounded-3xl shadow-xl space-y-4"
    >
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        {/* <Hotel className="w-6 h-6 text-violet-600" /> */}
        Hotel Booking
      </h3>

      {/* Search Hotel */}
      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <CityAutocomplete
              value={field.value || ""}
              onChange={field.onChange}
              placeholder="Search hotel"
              className="pl-12 pr-4 py-4 text-lg rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all"
            />
          </div>
        )}
      />

      {/* Row: Occupant, Check-in, Check-out */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Occupant */}
        <div className="relative">
          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            {...register("guests")}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all appearance-none bg-white"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} occupant{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in */}
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            min={today}
            {...register("checkIn")}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all"
          />
        </div>

        {/* Check-out */}
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            min={checkIn || today}
            {...register("checkOut")}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all"
          />
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full bg-violet-600 text-white py-4 rounded-full font-semibold text-lg hover:bg-violet-700 transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        <Search className="w-5 h-5" />
        Search Hotel
      </button>
    </form>
  );
};
