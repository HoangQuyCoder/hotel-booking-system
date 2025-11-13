import { useState } from "react";
import { Bed, Wifi, Car, Coffee, Dumbbell, Waves } from "lucide-react";
import type { Hotel } from "../../types";

const defaultAmenities = [
  { icon: <Wifi />, label: "Free WiFi" },
  { icon: <Car />, label: "Parking" },
  { icon: <Coffee />, label: "Restaurant" },
  { icon: <Dumbbell />, label: "Gym" },
  { icon: <Waves />, label: "Pool" },
  { icon: <Bed />, label: "Room Service" },
];

export default function TabsContent({ hotel }: { hotel: Hotel }) {
  const [activeTab, setActiveTab] = useState("overview");
  const amenities =
    hotel?.amenities && hotel.amenities.length > 0
      ? hotel.amenities.map((a: string) => ({ icon: <Wifi />, label: a }))
      : defaultAmenities;

  const rooms = hotel?.rooms ?? [
    {
      name: "Overwater Villa",
      desc: "King bed • 85m² • Ocean view",
      price: (hotel as any)?.pricePerNight ?? (hotel as any)?.price ?? 599,
    },
  ];

  return (
    <div>
      <div className="flex gap-6 border-b">
        {["overview", "amenities", "rooms"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize font-medium transition bg-gray-900 ${
              activeTab === tab
                ? "text-cyan-600 border-b-2 border-cyan-600"
                : "text-gray-400 hover:text-cyan-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "overview" && (
          <p className="text-gray-700 leading-relaxed">
            {hotel?.description ??
              "Experience luxury at its finest. Enjoy world-class dining, rejuvenating spa treatments, and endless water activities."}
          </p>
        )}

        {activeTab === "amenities" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 text-cyan-600">{item.icon}</div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "rooms" && (
          <div className="space-y-4">
            {rooms.map((r: any, idx: number) => (
              <div
                key={idx}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{r.name}</h4>
                  <p className="text-sm text-gray-600">{r.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-cyan-600">${r.price}</p>
                  <p className="text-xs text-gray-500">per night</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
