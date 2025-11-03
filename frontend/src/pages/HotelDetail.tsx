import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/apiClient";
import { Spinner } from "../components/ui/Spinner";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { type LatLngExpression } from "leaflet";

interface Hotel {
  id: string;
  name: string;
  address: string;
  rating: number;
  description: string;
  contactPhone: string;
  contactEmail: string;
  checkInTime: string;
  checkOutTime: string;
  latitude?: number;
  longitude?: number;
}

interface RoomType {
  id: string;
  name: string;
  capacity: number;
  sizeSqm: number;
  description: string;
}

interface Promotion {
  id: string;
  code: string;
  discountPercent: number;
  validFrom: string;
  validTo: string;
}

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // 🔹 Fetch hotel info
  const {
    data: hotel,
    isLoading: hotelLoading,
    isError: hotelError,
  } = useQuery<Hotel>({
    queryKey: ["hotel", id],
    queryFn: async () => {
      const res = await apiClient.get(`/hotels/${id}`);
      return res.data;
    },
    enabled: !!id, // tránh fetch khi id chưa có
  });

  // 🔹 Fetch room types
  const { data: roomTypes } = useQuery<RoomType[]>({
    queryKey: ["roomTypes", id],
    queryFn: async () => {
      const res = await apiClient.get("/room-types", {
        params: { hotelId: id },
      });
      return res.data;
    },
    enabled: !!id,
  });

  // 🔹 Fetch promotions
  const { data: promotions } = useQuery<Promotion[]>({
    queryKey: ["promotions"],
    queryFn: async () => {
      const res = await apiClient.get("/promotions");
      return res.data;
    },
  });

  // 🔹 Handle loading / error
  if (hotelLoading) return <Spinner />;
  if (hotelError || !hotel) return <p>Không tìm thấy khách sạn.</p>;

  // 🔹 Tính toán vị trí bản đồ nếu có
  const position: LatLngExpression | undefined =
    hotel.latitude && hotel.longitude
      ? [hotel.latitude, hotel.longitude]
      : undefined;

  return (
    <div className="container my-5">
      <h1 className="fw-bold mb-3">{hotel.name}</h1>
      <p className="text-muted mb-2">
        <strong>Địa chỉ:</strong> {hotel.address} <br />
        <strong>Đánh giá:</strong> {hotel.rating} ⭐
      </p>

      <p className="mb-3">{hotel.description}</p>

      <p>
        <strong>Liên hệ:</strong> {hotel.contactPhone} / {hotel.contactEmail}
      </p>
      <p>
        <strong>Check-in:</strong> {hotel.checkInTime} —{" "}
        <strong>Check-out:</strong> {hotel.checkOutTime}
      </p>

      {position && (
        <div className="my-4">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "300px", width: "100%", borderRadius: "8px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position}>
              <Popup>{hotel.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <h3 className="mt-5">🏨 Loại phòng</h3>
      <ul className="list-group mb-4">
        {roomTypes?.length ? (
          roomTypes.map((room) => (
            <li key={room.id} className="list-group-item">
              <strong>{room.name}</strong> — Sức chứa: {room.capacity} người —{" "}
              {room.sizeSqm} m² <br />
              <span className="text-muted">{room.description}</span>
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">
            Không có loại phòng nào.
          </li>
        )}
      </ul>

      <h3>🎁 Khuyến mãi</h3>
      <ul className="list-group mb-4">
        {promotions?.length ? (
          promotions.map((promo) => (
            <li key={promo.id} className="list-group-item">
              Mã: <strong>{promo.code}</strong> — Giảm {promo.discountPercent}%{" "}
              <br />
              <small>
                Hiệu lực: {promo.validFrom} → {promo.validTo}
              </small>
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">
            Không có khuyến mãi nào.
          </li>
        )}
      </ul>

      <Link to="/booking" className="btn btn-primary">
        Đặt phòng
      </Link>
    </div>
  );
};

export default HotelDetail;
