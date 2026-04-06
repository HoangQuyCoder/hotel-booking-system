import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Spinner } from "./Spinner";

export const GlobalLoadingOverlay = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const loading = isFetching > 0 || isMutating > 0;

  if (!loading) return null;

  return <Spinner fullscreen />;
};