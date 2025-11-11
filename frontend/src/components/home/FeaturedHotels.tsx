import { Star, MapPin } from "lucide-react";

interface HotelCardProps {
  image: string;
  name: string;
  location: string;
  price: string;
  rating: number;
  reviews: number;
}

const HotelCard = ({
  image,
  name,
  location,
  price,
  rating,
  reviews,
}: HotelCardProps) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
    <div className="relative h-48 overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        {rating}
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
        <MapPin className="w-4 h-4" />
        {location}
      </div>
      <div className="flex justify-between items-center mt-3">
        <div>
          <span className="text-2xl font-bold text-cyan-600">{price}</span>
          <span className="text-sm text-gray-500"> / night</span>
        </div>
        <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition">
          View Deal
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">{reviews} reviews</p>
    </div>
  </div>
);

export default function FeaturedHotels() {
  const hotels = [
    {
      image: "/src/assets/images/hotel-1.jpg",
      name: "Sunset Paradise Resort",
      location: "Maldives",
      price: "$299",
      rating: 4.8,
      reviews: 324,
    },
    {
      image: "/src/assets/images/hotel-2.jpg",
      name: "Mountain View Lodge",
      location: "Swiss Alps",
      price: "$189",
      rating: 4.6,
      reviews: 189,
    },
    {
      image: "/src/assets/images/hotel-3.jpg",
      name: "Urban Chic Hotel",
      location: "Tokyo, Japan",
      price: "$159",
      rating: 4.9,
      reviews: 567,
    },
  ];

  return (
    <section className="pb-16 md:pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            FEATURED HOTELS
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel, i) => (
            <HotelCard key={i} {...hotel} />
          ))}
        </div>
      </div>
    </section>
  );
}
