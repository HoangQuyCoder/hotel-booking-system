import { useState, type JSX } from "react";
import {
  Bed,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Clock,
  Phone,
  Mail,
  Users,
  Square,
  Info,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { BaseRate, DailyOverride, HotelDetailResponse } from "../../types";

interface AmenityItem {
  icon: JSX.Element;
  label: string;
}

function getCurrentPrice(
  baseRates: BaseRate[],
  dailyOverrides: DailyOverride[] = [],
  date: Date = new Date()
): number {
  const today = date.toISOString().split("T")[0]; // YYYY-MM-DD

  const override = dailyOverrides.find((o) => o.date === today);
  if (override) return override.priceAdjustment;

  const activeRate = baseRates.find((rate) => {
    return rate.startDate <= today && today <= rate.endDate;
  });

  return activeRate?.basePrice ?? 0;
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
      default:
        return <Wifi className="w-5 h-5" />;
    }
  }

  // Unique amenities across all room types
  const amenities: AmenityItem[] = Array.from(
    new Set(
      hotel.roomTypes?.flatMap(
        (rt) => rt.amenities?.map((a) => a.name.toLowerCase()) ?? []
      ) ?? []
    )
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
          <div className="space-y-6">
            <div>
              <p className="text-gray-700 leading-relaxed">
                {hotel.description ??
                  "Experience luxury at its finest. Enjoy world-class dining, rejuvenating spa treatments, and endless water activities."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Check-in / Check-out */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  Check-in & Check-out
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Check-in:</span>{" "}
                    {hotel.checkInTime ? (
                      <span className="text-cyan-600">{hotel.checkInTime}</span>
                    ) : (
                      <span className="text-gray-500 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Check-out:</span>{" "}
                    {hotel.checkOutTime ? (
                      <span className="text-cyan-600">
                        {hotel.checkOutTime}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-600" />
                  Contact Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {hotel.contactPhone ? (
                    <p className="text-sm flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <a
                        href={`tel:${hotel.contactPhone}`}
                        className="text-cyan-600 hover:underline"
                      >
                        {hotel.contactPhone}
                      </a>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Phone not available
                    </p>
                  )}
                  {hotel.contactEmail ? (
                    <p className="text-sm flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      <a
                        href={`mailto:${hotel.contactEmail}`}
                        className="text-cyan-600 hover:underline"
                      >
                        {hotel.contactEmail}
                      </a>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Email not available
                    </p>
                  )}
                </div>
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
                  roomType.dailyOverrides
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
                              o.date === new Date().toISOString().split("T")[0]
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

                    {/* Available Rooms */}
                    {roomType.rooms && roomType.rooms.length > 0 ? (
                      <div className="p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Available Rooms:
                        </p>
                        <div className="space-y-1.5">
                          {roomType.rooms.map((room, rIdx) => (
                            <div
                              key={rIdx}
                              className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg text-sm hover:bg-cyan-50 transition"
                            >
                              <div>
                                <span className="font-semibold text-gray-800">
                                  Room {room.roomNumber}
                                </span>
                                {room.desc && (
                                  <span className="text-xs text-gray-600 ml-2 italic">
                                    – {room.desc}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-2.5 text-xs text-gray-500 italic">
                        No room details available.
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
