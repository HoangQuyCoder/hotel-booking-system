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
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export default function AppRouter() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/hotels/:id" element={<HotelDetail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/safety-information" element={<SafetyInformation />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/destinations" element={<Hotels />} />

      {/* GUEST */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* PROTECTED */}
      <Route element={<ProtectedRoute />}>
        {/* <Route path="/admin" element={<Admin />} /> */}
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* NOT FOUND */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
