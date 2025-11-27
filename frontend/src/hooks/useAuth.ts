import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");

  const logoutWithRedirect = async () => {
    context.logout();
    navigate("/login");
  };

  return {
    ...context,
    logout: logoutWithRedirect,
  };
};
