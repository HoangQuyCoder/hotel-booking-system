import { useForm, Controller } from "react-hook-form";
import { type SearchFilters } from "../../types";
import { CityAutocomplete } from "./CityAutocomplete";
import { Calendar, Users } from "lucide-react";
import { format } from "date-fns";

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  initialValues?: Partial<SearchFilters>;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  initialValues,
}) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const { control, register, handleSubmit, watch } = useForm<SearchFilters>({
    defaultValues: {
      guests: 2,
      ...initialValues,
    },
  });

  const checkIn = watch("checkIn");

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      className="bg-white p-4 rounded-3 shadow-lg"
    >
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label fw-semibold d-flex align-items-center">
            Địa điểm
          </label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <CityAutocomplete
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold d-flex align-items-center">
            <Calendar size={16} className="me-2" />
            Nhận phòng
          </label>
          <input
            type="date"
            min={today}
            className="form-control"
            {...register("checkIn")}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold d-flex align-items-center">
            <Calendar size={16} className="me-2" />
            Trả phòng
          </label>
          <input
            type="date"
            min={checkIn || today}
            className="form-control"
            {...register("checkOut")}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label fw-semibold d-flex align-items-center">
            <Users size={16} className="me-2" />
            Khách
          </label>
          <select className="form-select" {...register("guests")}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} khách
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3 d-flex align-items-end">
          <button
            type="submit"
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
            style={{ height: "48px" }}
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </form>
  );
};
