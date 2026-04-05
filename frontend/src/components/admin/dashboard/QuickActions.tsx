import { Link } from "react-router-dom";
import {
  Hotel,
  CalendarCheck,
  Users,
  Tag,
  CreditCard,
  Star,
  TrendingUp,
} from "lucide-react";

const quickActions = [
  {
    label: "Hotels",
    path: "/admin/hotels",
    icon: Hotel,
    bg: "bg-violet-50 hover:bg-violet-100",
    border: "border-violet-200 hover:border-violet-300",
    text: "text-violet-600",
    iconBg: "bg-violet-100",
  },
  {
    label: "Bookings",
    path: "/admin/bookings",
    icon: CalendarCheck,
    bg: "bg-sky-50 hover:bg-sky-100",
    border: "border-sky-200 hover:border-sky-300",
    text: "text-sky-600",
    iconBg: "bg-sky-100",
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
    bg: "bg-indigo-50 hover:bg-indigo-100",
    border: "border-indigo-200 hover:border-indigo-300",
    text: "text-indigo-600",
    iconBg: "bg-indigo-100",
  },
  {
    label: "Promotions",
    path: "/admin/promotions",
    icon: Tag,
    bg: "bg-amber-50 hover:bg-amber-100",
    border: "border-amber-200 hover:border-amber-300",
    text: "text-amber-600",
    iconBg: "bg-amber-100",
  },
  {
    label: "Transactions",
    path: "/admin/transactions",
    icon: CreditCard,
    bg: "bg-emerald-50 hover:bg-emerald-100",
    border: "border-emerald-200 hover:border-emerald-300",
    text: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  {
    label: "Reviews",
    path: "/admin/reviews",
    icon: Star,
    bg: "bg-pink-50 hover:bg-pink-100",
    border: "border-pink-200 hover:border-pink-300",
    text: "text-pink-600",
    iconBg: "bg-pink-100",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        </div>
        <h2 className="text-gray-800 font-bold text-sm uppercase tracking-wider">
          Quick Actions
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.path}
              to={action.path}
              className={`no-underline ${action.bg} border ${action.border} rounded-xl p-4 flex flex-col items-center justify-center gap-2.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm group`}
            >
              <div
                className={`p-2.5 rounded-lg ${action.iconBg} ${action.text} group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${action.text}`}>
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
