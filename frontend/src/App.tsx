import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Header } from "./components/layout/Header.tsx";
import { Footer } from "./components/layout/Footer.tsx";
import { Spinner } from "./components//ui/Spinner.tsx";

// Lazy load pages
const Login = lazy(() => import("./pages/Login.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const Home = lazy(() => import("./pages/Home.tsx"));
const HotelDetail = lazy(() => import("./pages/HotelDetail.tsx"));

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
