import React, { useEffect } from "react";
import { Spinner } from "./Spinner";
import { useLoadingStore } from "../../store/useLoadingStore";

export const GlobalLoadingOverlay: React.FC = () => {
  const loading = useLoadingStore((s) => s.loading);

  useEffect(() => {
    if (loading) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, [loading]);

  if (!loading) return null;

  return <Spinner fullscreen color="primary" />;
};
