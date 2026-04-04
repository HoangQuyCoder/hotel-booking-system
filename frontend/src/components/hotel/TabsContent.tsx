import { useState, type JSX } from "react";
import {
  Bed,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Phone,
  Mail,
  Users,
  Square,
  Info,
  DollarSign,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Zap,
  Wind,
  Tv,
  Mountain,
  Key,
} from "lucide-react";
import type { HotelDetailResponse } from "../../types";
import { getCurrentPrice } from "../../utils/pricing";

interface AmenityItem {
  icon: JSX.Element;
  label: string;
}

export default function TabsContent({ hotel }: { hotel: HotelDetailResponse }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Map icon based on amenity name
  function mapIcon(label: string): JSX.Element {
    switch (label.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-5 h-5" />;
      case "parking":
        return <Car className="w-5 h-5" />;
      case "restaurant":
        return <Coffee className="w-5 h-5" />;
      case "gym":
        return <Dumbbell className="w-5 h-5" />;
      case "pool":
        return <Waves className="w-5 h-5" />;
      case "room service":
        return <Bed className="w-5 h-5" />;
      case "air conditioning":
      case "ac":
        return <Wind className="w-5 h-5" />;
      case "tv":
      case "television":
        return <Tv className="w-5 h-5" />;
      case "minibar":
        return <Zap className="w-5 h-5" />;
      case "ocean view":
      case "sea view":
        return <Waves className="w-5 h-5" />;
      case "mountain view":
        return <Mountain className="w-5 h-5" />;
      case "safe":
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  }

  // Unique amenities across all room types
  const amenities: AmenityItem[] = Array.from(
    new Set(
      hotel.roomTypes?.flatMap(
        (rt) => rt.amenities?.map((a) => a.name.toLowerCase()) ?? [],
      ) ?? [],
    ),
  ).map((name) => ({
    icon: mapIcon(name),
    label: name.charAt(0).toUpperCase() + name.slice(1),
  }));

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        {["overview", "amenities", "roomTypes"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              pb-3 capitalize font-medium transition-colors border-b-2 -mb-px
              ${
                activeTab === tab
                  ? "text-cyan-600 border-cyan-600"
                  : "text-gray-500 hover:text-cyan-600 border-transparent"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* Left: Description & General Info */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm leading-relaxed text-gray-700">
              <h4 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-cyan-600" />
                About this Hotel
              </h4>
              <p>
                {hotel.description ??
                  "Experience luxury at its finest. Enjoy world-class dining, rejuvenating spa treatments, and endless water activities."}
              </p>
            </div>

            {/* Policies & Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Policies Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="font-black text-gray-900 flex items-center gap-2 uppercase text-xs tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  Hotel Policies
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Check-in</span>
                    <span className="font-black text-cyan-600">
                      {hotel.checkInTime || "14:00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Check-out</span>
                    <span className="font-black text-cyan-600">
                      {hotel.checkOutTime || "12:00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">
                      Cancellation
                    </span>
                    <span className="font-black text-green-600">
                      Free before 24h
                    </span>
                  </div>
                </div>
              </div>

              {/* Facilities Highlights */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-sm">
                <h4 className="font-black text-gray-900 flex items-center gap-2 uppercase text-xs tracking-widest">
                  <Zap className="w-4 h-4 text-cyan-600" />
                  Highlights
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                    Complimentary high-speed WiFi
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                    Free breakfast for prime members
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                    24/7 Concierge service
                  </li>
                </ul>
              </div>
            </div>

            {/* Need Help - Moved to bottom */}
            <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl">
              <h4 className="text-xl font-black flex items-center gap-2 mb-4">
                <Phone className="w-6 h-6 text-cyan-400" />
                Need Help?
              </h4>
              <p className="text-gray-400 italic mb-6">
                Our staff is available 24/7 to assist with your booking or stay
                inquiries.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotel.contactPhone && (
                  <a
                    href={`tel:${hotel.contactPhone}`}
                    className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    <div className="p-2 bg-cyan-500/20 rounded-xl">
                      <Phone className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="font-bold truncate">
                      {hotel.contactPhone}
                    </span>
                  </a>
                )}

                {hotel.contactEmail && (
                  <a
                    href={`mailto:${hotel.contactEmail}`}
                    className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    <div className="p-2 bg-indigo-500/20 rounded-xl">
                      <Mail className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="font-bold truncate">
                      {hotel.contactEmail}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AMENITIES TAB */}
        {activeTab === "amenities" && (
          <div>
            {amenities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenities.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 text-cyan-600 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No amenities listed.</p>
            )}
          </div>
        )}

        {/* ROOMS TAB */}
        {activeTab === "roomTypes" && (
          <div className="space-y-5">
            {hotel.roomTypes && hotel.roomTypes.length > 0 ? (
              hotel.roomTypes.map((roomType, idx) => {
                const currentPrice = getCurrentPrice(
                  roomType.baseRates,
                  roomType.dailyOverrides,
                );
                const isAvailable = roomType.isAvailable;

                return (
                  <div
                    key={idx}
                    className={`
              border rounded-xl overflow-hidden bg-white shadow-sm transition-all
              ${isAvailable ? "ring-1 ring-cyan-200" : "opacity-75"}
            `}
                  >
                    {/* Header: Name + Price + Availability */}
                    <div className="bg-gradient-to-r from-cyan-50 to-indigo-50 p-3.5">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-bold text-gray-900">
                              {roomType.name}
                            </h4>
                            {isAvailable ? (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Available
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                <XCircle className="w-3 h-3" />
                                Unavailable
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-cyan-600" />
                              {roomType.capacity} guests
                            </span>
                            <span className="flex items-center gap-1">
                              <Square className="w-3.5 h-3.5 text-cyan-600" />
                              {roomType.sizeSqm} m²
                            </span>
                            <span className="flex items-center gap-1">
                              <Info className="w-3.5 h-3.5 text-cyan-600" />
                              {roomType.totalRooms} rooms
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-cyan-600 flex items-center justify-end gap-1">
                            <DollarSign className="w-5 h-5" />
                            {currentPrice}
                          </p>
                          <p className="text-xs text-gray-500">per night</p>
                          {roomType.dailyOverrides.some(
                            (o) =>
                              o.date === new Date().toISOString().split("T")[0],
                          ) && (
                            <p className="text-xs text-amber-600 font-medium">
                              Special rate today!
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {roomType.description && (
                      <div className="px-4 py-2.5 bg-gray-50 border-b">
                        <p className="text-sm text-gray-700 leading-snug">
                          {roomType.description}
                        </p>
                      </div>
                    )}

                    {/* Available Rooms Grid */}
                    {roomType.rooms && roomType.rooms.length > 0 ? (
                      <div className="p-6">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Key className="w-4 h-4 text-cyan-600" />
                          Specific Room Locations
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {roomType.rooms.map((room, rIdx) => (
                            <div
                              key={rIdx}
                              className="group/room relative flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-cyan-600 hover:text-white transition-all duration-300"
                            >
                              <span className="text-lg font-black">
                                {room.roomNumber}
                              </span>
                              <span className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">
                                {room.status || "Ready"}
                              </span>

                              {/* Pulse indicator for availability */}
                              {room.status === "AVAILABLE" || !room.status ? (
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-500 rounded-full group-hover/room:bg-white animate-pulse" />
                              ) : (
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-500 rounded-full group-hover/room:bg-white" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-xs text-gray-500 italic flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Detailed occupancy coming soon for {roomType.name}.
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 italic text-sm">
                No room types available.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
