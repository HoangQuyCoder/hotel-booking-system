import { Activity } from "lucide-react";
import { useUserApi } from "../../hooks/useUserApi";
import { useBookingApi } from "../../hooks/useBookingApi";
import { useHotelApi } from "../../hooks/useHotelApi";
import { useTransactionApi } from "../../hooks/useTransactionApi";
import { usePromotionApi } from "../../hooks/usePromotionApi";
import { useReviewApi } from "../../hooks/useReviewApi";

import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import RecentBookings from "../../components/admin/dashboard/RecentBookings";
import QuickActions from "../../components/admin/dashboard/QuickActions";
import StatCard from "../../components/admin/dashboard/StatCard";
import DashboardCharts from "../../components/admin/dashboard/DashboardCharts";
import {
  Users,
  Hotel,
  CalendarCheck,
  CreditCard,
  Tag,
  Star,
} from "lucide-react";

export default function AdminDashboard() {
  const { useUsers } = useUserApi();
  const { useBookings } = useBookingApi();
  const { useHotels } = useHotelApi();
  const { useTransactions } = useTransactionApi();
  const { usePromotions } = usePromotionApi();
  const { useReviews } = useReviewApi();

  const { data: usersData } = useUsers({ page: 0, size: 1 });
  const { data: bookingsData } = useBookings({ page: 0, size: 1 });
  const { data: hotelsData } = useHotels({ page: 0, size: 1 });
  const { data: transactionsData } = useTransactions({ page: 0, size: 1 });
  const { data: promotionsData } = usePromotions({ page: 0, size: 1 });
  const { data: reviewsData } = useReviews({ page: 0, size: 1 });

  const { data: recentBookingsData } = useBookings({
    page: 0,
    size: 5,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  const stats = [
    {
      title: "Users",
      value: usersData?.totalElements ?? "—",
      icon: Users,
      trend: "up" as const,
      trendValue: "+12%",
      gradient: "from-indigo-500 to-indigo-600",
      color: "#4F46E5",
      link: "/admin/users",
      chartData: [
        { value: 400 }, { value: 300 }, { value: 500 }, { value: 450 }, { value: 600 }, { value: 700 }
      ],
    },
    {
      title: "Hotels",
      value: hotelsData?.totalElements ?? "—",
      icon: Hotel,
      trend: "up" as const,
      trendValue: "+3%",
      gradient: "from-violet-500 to-violet-600",
      color: "#8B5CF6",
      link: "/admin/hotels",
      chartData: [
        { value: 100 }, { value: 120 }, { value: 115 }, { value: 130 }, { value: 140 }, { value: 150 }
      ],
    },
    {
      title: "Bookings",
      value: bookingsData?.totalElements ?? "—",
      icon: CalendarCheck,
      trend: "up" as const,
      trendValue: "+8%",
      gradient: "from-sky-500 to-sky-600",
      color: "#0EA5E9",
      link: "/admin/bookings",
      chartData: [
        { value: 200 }, { value: 400 }, { value: 300 }, { value: 500 }, { value: 450 }, { value: 600 }
      ],
    },
    {
      title: "Transactions",
      value: transactionsData?.totalElements ?? "—",
      icon: CreditCard,
      trend: "up" as const,
      trendValue: "+15%",
      gradient: "from-emerald-500 to-emerald-600",
      color: "#10B981",
      link: "/admin/transactions",
      chartData: [
        { value: 50 }, { value: 80 }, { value: 70 }, { value: 100 }, { value: 90 }, { value: 120 }
      ],
    },
    {
      title: "Promotions",
      value: promotionsData?.totalElements ?? "—",
      icon: Tag,
      gradient: "from-amber-500 to-amber-600",
      color: "#F59E0B",
      link: "/admin/promotions",
      chartData: [
        { value: 10 }, { value: 15 }, { value: 12 }, { value: 20 }, { value: 18 }, { value: 25 }
      ],
    },
    {
      title: "Reviews",
      value: reviewsData?.totalElements ?? "—",
      icon: Star,
      gradient: "from-pink-500 to-pink-600",
      color: "#EC4899",
      link: "/admin/reviews",
      chartData: [
        { value: 300 }, { value: 250 }, { value: 350 }, { value: 320 }, { value: 400 }, { value: 450 }
      ],
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Hotel management system overview"
        icon={Activity}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        <RecentBookings bookings={recentBookingsData?.content || []} />
        <QuickActions />
      </div>
    </div>
  );
}
