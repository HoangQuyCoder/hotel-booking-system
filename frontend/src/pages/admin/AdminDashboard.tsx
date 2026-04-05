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
      color: "text-indigo-600",
      link: "/admin/users",
    },
    {
      title: "Hotels",
      value: hotelsData?.totalElements ?? "—",
      icon: Hotel,
      trend: "up" as const,
      trendValue: "+3%",
      gradient: "from-violet-500 to-violet-600",
      color: "text-violet-600",
      link: "/admin/hotels",
    },
    {
      title: "Bookings",
      value: bookingsData?.totalElements ?? "—",
      icon: CalendarCheck,
      trend: "up" as const,
      trendValue: "+8%",
      gradient: "from-sky-500 to-sky-600",
      color: "text-sky-600",
      link: "/admin/bookings",
    },
    {
      title: "Transactions",
      value: transactionsData?.totalElements ?? "—",
      icon: CreditCard,
      trend: "up" as const,
      trendValue: "+15%",
      gradient: "from-emerald-500 to-emerald-600",
      color: "text-emerald-600",
      link: "/admin/transactions",
    },
    {
      title: "Promotions",
      value: promotionsData?.totalElements ?? "—",
      icon: Tag,
      gradient: "from-amber-500 to-amber-600",
      color: "text-amber-600",
      link: "/admin/promotions",
    },
    {
      title: "Reviews",
      value: reviewsData?.totalElements ?? "—",
      icon: Star,
      gradient: "from-pink-500 to-pink-600",
      color: "text-pink-600",
      link: "/admin/reviews",
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        <RecentBookings bookings={recentBookingsData?.content || []} />
        <QuickActions />
      </div>
    </div>
  );
}
