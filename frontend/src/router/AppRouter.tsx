import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import { lazy } from "react";

// Lazy load pages
const Login = lazy(() => import("../pages/Login.tsx"));
const Register = lazy(() => import("../pages/Register.tsx"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("../pages/ResetPassword.tsx"));
const Home = lazy(() => import("../pages/Home.tsx"));
const Hotels = lazy(() => import("../pages/Hotels.tsx"));
const HotelDetail = lazy(() => import("../pages/HotelDetail.tsx"));
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

      {/* GUEST */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* PROTECTED */}
      <Route element={<ProtectedRoute />}>
        {/* <Route path="/admin" element={<Admin />} /> */}
      </Route>

      {/* NOT FOUND */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
