import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
// import Dashboard from "../pages/Dashboard";
// import Profile from "../pages/Profile";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROUTE FOR GUESTS */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ROUTE REQUEST LOGIN */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} /> */}
        </Route>

        {/* ROUTE FOR FREE PAGES */}
        {/* <Route path="/about" element={<About />} /> */}
        
      </Routes>
    </BrowserRouter>
  );
}
