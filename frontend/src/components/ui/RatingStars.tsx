import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number; 
  size?: number; 
}

export default function RatingStars({ rating, size = 20 }: RatingStarsProps) {
  const fullStars = Math.floor(rating); 
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); 

  return (
    <div className="flex items-center gap-1">
      {/* Full Stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="text-yellow-400 fill-yellow-400"
          width={size}
          height={size}
        />
      ))}

      {/* Half Star */}
      {halfStar && (
        <div className="relative" style={{ width: size, height: size }}>
          {/* Nửa trái màu vàng */}
          <Star
            className="text-yellow-400 fill-yellow-400 absolute left-0 top-0"
            width={size}
            height={size}
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
          {/* Nửa phải màu xám */}
          <Star
            className="text-gray-300 absolute right-0 top-0"
            width={size}
            height={size}
            style={{ clipPath: "inset(0 0 0 50%)" }}
          />
        </div>
      )}

      {/* Empty Stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="text-gray-300"
          width={size}
          height={size}
        />
      ))}
    </div>
  );
}
