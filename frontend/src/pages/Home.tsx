// import { useState } from "react";
// import { useQuery, keepPreviousData } from "@tanstack/react-query";
// import { searchHotels } from "../api/hotelApi";
// import { type SearchFilters } from "../types";
// import { HotelSearchForm } from "../components/search/HotelSearchForm";
// import { HotelList } from "../components/hotel/HotelList";
// import { Pagination } from "../components/ui/Pagination";

import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/home/HeroSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Partners from "../components/home/Partners";
import FeaturedHotels from "../components/home/FeaturedHotels";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import ExploreMaldives from "../components/home/ExploreMaldives";
import FeatureNews from "../components/home/FeatureNews";

export default function Home() {
  // const [filters, setFilters] = useState<SearchFilters>({});
  // const [page, setPage] = useState(0);

  // const { data, isLoading, isFetching } = useQuery({
  //   queryKey: ["hotels", filters, page],
  //   queryFn: () => searchHotels(filters, page).then((res) => res.data),
  //   placeholderData: keepPreviousData,
  // });

  return (
    <div className="min-h-screen font-sans bg-gray-50 overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <WhyChooseUs />
      <Partners />
      <ExploreMaldives />
      <FeatureNews />
      <FeaturedHotels />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
