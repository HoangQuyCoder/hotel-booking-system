// ...existing code...
import type { Hotel } from "../../types";

export default function Map({ hotel }: { hotel: Hotel }) {
  // prefer coordinates if available
  const lat = (hotel as any)?.lat;
  const lng = (hotel as any)?.lng;

  const query =
    lat && lng
      ? `${lat},${lng}`
      : encodeURIComponent(
          [hotel.name, hotel.address, hotel.city].filter(Boolean).join(", ")
        );

  const src =
    lat && lng
      ? `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d0!2d${lng}!3d${lat}`
      : `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_EMBED_KEY&q=${query}`;

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Location</h3>
      <div className="h-64 rounded-xl overflow-hidden shadow-md">
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
// ...existing code...
