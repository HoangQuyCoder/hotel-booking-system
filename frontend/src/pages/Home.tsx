import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchHotels } from "../api/hotelApi";
import { type SearchFilters } from "../types";
import { SearchForm } from "../components/search/SearchForm";
import { HotelList } from "../components/hotel/HotelList";
import { Pagination } from "../components/ui/Pagination";

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [page, setPage] = useState(0);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["hotels", filters, page],
    queryFn: () => searchHotels(filters, page).then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-96 flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/images/hero-hotel.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tìm khách sạn tốt nhất cho kỳ nghỉ của bạn
          </h1>
          <p className="text-lg mb-8">
            Hơn 10.000 khách sạn • Giá tốt nhất • Đặt phòng dễ dàng
          </p>
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <SearchForm
              onSearch={(f) => {
                setFilters(f);
                setPage(0);
              }}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {isFetching ? (
              <span className="text-gray-500">Đang tìm kiếm...</span>
            ) : (
              `Tìm thấy ${data?.totalElements || 0} khách sạn`
            )}
          </h2>
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>Sắp xếp: Đánh giá cao nhất</option>
            <option>Giá thấp nhất</option>
            <option>Tên A-Z</option>
          </select>
        </div>

        {/* Hotel List */}
        <HotelList
          data={data}
          isLoading={isLoading || isFetching}
          skeletonCount={9}
        />

        {/* Pagination */}
        {data && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
      </section>
    </>
  );
}
