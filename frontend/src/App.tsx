import { Suspense } from "react";
import Footer from "./components/layout/Footer.tsx";
import Navbar from "./components/layout/Navbar.tsx";
import { Spinner } from "./components/ui/Spinner.tsx";
import { GlobalLoadingOverlay } from "./components/ui/GlobalLoadingOverlay.tsx";
import ScrollToTop from "./components/ui/ScrollToTop";
import AppRouter from "./router/AppRouter.tsx";


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<Spinner fullscreen />}>
          <ScrollToTop />
          <AppRouter />
        </Suspense>
      </main>
      <GlobalLoadingOverlay />
      <Footer />
    </div>
  );
}

export default App;
