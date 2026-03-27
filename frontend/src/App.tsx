import { Suspense } from "react";
import Footer from "./components/layout/Footer.tsx";
import Navbar from "./components/layout/Navbar.tsx";
import { Spinner } from "./components/ui/Spinner.tsx";
import { GlobalLoadingOverlay } from "./components/ui/GlobalLoadingOverlay.tsx";
import ScrollToTop from "./components/ui/ScrollToTop";
import AppRouter from "./router/AppRouter.tsx";


function App() {
  return (
    <>
      <Navbar />

      <Suspense fallback={<Spinner fullscreen />}>
        <ScrollToTop />
        <AppRouter />
      </Suspense>

      <Footer />
      <GlobalLoadingOverlay />
    </>
  );
}

export default App;
