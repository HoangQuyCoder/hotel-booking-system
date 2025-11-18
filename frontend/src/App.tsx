import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Footer from "./components/layout/Footer.tsx";
import Navbar from "./components/layout/Navbar.tsx";
import { Spinner } from "./components/ui/Spinner.tsx";
import { GlobalLoadingOverlay } from "./components/ui/GlobalLoadingOverlay.tsx";
import { useLoadingStore } from "./store/useLoadingStore.ts";
import ScrollToTop from "./components/ui/ScrollToTop";

// Lazy load pages
const Login = lazy(() => import("./pages/Login.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const Home = lazy(() => import("./pages/Home.tsx"));
const HotelDetail = lazy(() => import("./pages/HotelDetail.tsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  const { setLoading } = useLoadingStore();

  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [setLoading]);

  return (
    <>
      <Navbar />

      <Suspense fallback={<Spinner fullscreen />}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
           <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <Footer />
      <GlobalLoadingOverlay />
    </>
  );
}

export default App;
