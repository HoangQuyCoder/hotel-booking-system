import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/Spinner";

export default function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner fullscreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}