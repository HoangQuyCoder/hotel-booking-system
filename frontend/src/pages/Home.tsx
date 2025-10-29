import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/apiClient.ts";
import Spinner from "../components/Spinner.tsx";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

interface Hotel {
  id: string;
  name: string;
  city: string;
  rating: number;
  description: string;
  // Thêm fields khác
}

interface SearchFilters {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

const Home: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const { register, handleSubmit } = useForm<SearchFilters>();

  const { data: hotels, isLoading } = useQuery<Hotel[]>({
    queryKey: ["hotels", filters],
    queryFn: () =>
      api.get("/hotels", { params: filters }).then((res) => res.data),
  });

  const onSubmit = (data: SearchFilters) => setFilters(data);

  if (isLoading) return <Spinner />;

  return (
    <div className="container my-5">
      <div className="hero bg-light p-5 text-center">
        <h1>Tìm kiếm khách sạn</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex justify-content-center"
        >
          <input
            type="text"
            placeholder="City"
            className="form-control me-2"
            {...register("city")}
          />
          <input
            type="date"
            className="form-control me-2"
            {...register("checkIn")}
          />
          <input
            type="date"
            className="form-control me-2"
            {...register("checkOut")}
          />
          <input
            type="number"
            placeholder="Guests"
            className="form-control me-2"
            {...register("guests")}
          />
          <button type="submit" className="btn btn-primary">
            Tìm
          </button>
        </form>
      </div>
      <div className="row">
        {hotels?.map((hotel) => (
          <div key={hotel.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{hotel.name}</h5>
                <p>
                  {hotel.city} - Rating: {hotel.rating}
                </p>
                <p>{hotel.description}</p>
                <Link to={`/hotels/${hotel.id}`} className="btn btn-primary">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
