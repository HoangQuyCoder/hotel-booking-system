import { HotelList } from "../hotel/HotelList";
import { type HotelResponse } from "../../types";

interface SearchResultsProps {
  data?: HotelResponse;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = (props) => {
  return <HotelList {...props} skeletonCount={9} />;
};
