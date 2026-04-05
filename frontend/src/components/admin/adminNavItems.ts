import {
  LayoutDashboard,
  Users,
  Hotel,
  CalendarCheck,
  CreditCard,
  Tag,
  Star,
  Bell,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const adminNavItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Hotels",
    path: "/admin/hotels",
    icon: Hotel,
  },
  {
    label: "Bookings",
    path: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    label: "Transactions",
    path: "/admin/transactions",
    icon: CreditCard,
  },
  {
    label: "Promotions",
    path: "/admin/promotions",
    icon: Tag,
  },
  {
    label: "Reviews",
    path: "/admin/reviews",
    icon: Star,
  },
  {
    label: "Notifications",
    path: "/admin/notifications",
    icon: Bell,
  },
];
