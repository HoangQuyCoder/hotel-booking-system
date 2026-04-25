import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import { lazy } from "react";
import PrivacyPolicy from "../pages/Privacy.tsx";
import TermsOfService from "../pages/Terms.tsx";
import HelpCenter from "../pages/HelpCenter.tsx";
import SafetyInformation from "../pages/Safety.tsx";
import Contact from "../pages/Contact.tsx";
import AboutUs from "../pages/AboutUs.tsx";
import AdminDashboard from "../pages/admin/AdminDashboard.tsx";
import AdminHotels from "../pages/admin/AdminHotels.tsx";
import AdminBookings from "../pages/admin/AdminBookings.tsx";

import AdminPromotions from "../pages/admin/AdminPromotions.tsx";
import AdminNotifications from "../pages/admin/AdminNotifications.tsx";
import AdminRooms from "../pages/admin/AdminRooms.tsx";
import AdminUsers from "../pages/admin/AdminUsers.tsx";
import AdminReviews from "../pages/admin/AdminReviews.tsx";
import AdminTransactions from "../pages/admin/AdminTransactions.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import AdminLayout from "../components/layout/AdminLayout.tsx";

// Lazy load pages
const Login = lazy(() => import("../pages/Login.tsx"));
const Register = lazy(() => import("../pages/Register.tsx"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("../pages/ResetPassword.tsx"));
const Home = lazy(() => import("../pages/Home.tsx"));
const Hotels = lazy(() => import("../pages/Hotels.tsx"));
const HotelDetail = lazy(() => import("../pages/HotelDetail.tsx"));
const BookingDetail = lazy(() => import("../pages/BookingDetail.tsx"));
const Profile = lazy(() => import("../pages/Profile.tsx"));
const Bookings = lazy(() => import("../pages/Bookings.tsx"));
const New = lazy(() => import("../pages/New.tsx"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export default function AppRouter() {
  return (
    <Routes>
      {/* === MAIN LAYOUT === */}
      <Route element={<MainLayout />}>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/destination" element={<Hotels />} />
        <Route path="/new" element={<New />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/safety-information" element={<SafetyInformation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about-us" element={<AboutUs />} />

        {/* GUEST */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* PROTECTED USER */}
        <Route element={<ProtectedRoute />}>
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/:id" element={<BookingDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* === ADMIN LAYOUT === */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/hotels" element={<AdminHotels />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/promotions" element={<AdminPromotions />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/hotels/:hotelId/rooms" element={<AdminRooms />} />
        </Route>
      </Route>

      {/* NOT FOUND */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
