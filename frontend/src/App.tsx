import { Suspense } from "react";
import { Spinner } from "./components/ui/Spinner.tsx";
import { GlobalLoadingOverlay } from "./components/ui/GlobalLoadingOverlay.tsx";

import AppRouter from "./router/AppRouter.tsx";

function App() {
  return (
    <Suspense fallback={<Spinner fullscreen />}>
      <GlobalLoadingOverlay />
      <AppRouter />
    </Suspense>
  );
}

export default App;
