import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LogOut, Menu, X, User, ChevronDown, CalendarDays } from "lucide-react";
import { Button } from "../ui/Button";

export default function Navbar() {
  const { user, logoutWithRedirect } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  const textColor = scrolled ? "text-gray-200" : "text-white";
  const hoverColor = "hover:text-cyan-400";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 lg:px-20 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeAll}
          className={`text-2xl font-bold no-underline ${
            scrolled ? "text-cyan-400" : "text-white"
          }`}
        >
          THEODORE
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 font-medium">
          {["Home", "Destinations", "News", "Contact"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              onClick={closeAll}
              className={`no-underline transition ${hoverColor} ${textColor}`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-2" ref={dropdownRef}>
          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 flex items-center gap-2"
                onClick={() => setAccountOpen(!accountOpen)}
                rightIcon={
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${accountOpen ? "rotate-180" : ""}`}
                  />
                }
              >
                <User size={18} />
                <span>Hi, {user.firstName || "User"}</span>
              </Button>

              {/* Dropdown */}
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-3 border-b border-gray-800">
                    <p className="text-sm text-gray-400">Signed in as</p>
                    <p className="font-semibold text-white truncate">
                      {user.firstName + " " + user.lastName}
                    </p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>

                  <Button
                    to="/profile"
                    variant="ghost"
                    block
                    leftIcon={<User size={18} />}
                    className="justify-start text-gray-200 hover:bg-gray-800 no-underline"
                    onClick={closeAll}
                  >
                    Profile
                  </Button>

                  <Button
                    to="/bookings"
                    variant="ghost"
                    block
                    leftIcon={<CalendarDays size={18} />}
                    className="justify-start text-gray-200 hover:bg-gray-800 no-underline"
                    onClick={closeAll}
                  >
                    My Bookings
                  </Button>

                  <div className="border-t border-gray-800">
                    <Button
                      variant="danger"
                      block
                      leftIcon={<LogOut size={18} />}
                      className="justify-start rounded-none"
                      onClick={() => {
                        logoutWithRedirect();
                        closeAll();
                      }}
                    >
                      Sign out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                to="/login"
                variant="outline"
                className="no-underline px-4"
              >
                Login
              </Button>

              <Button
                to="/register"
                variant="primary"
                className="no-underline px-4"
              >
                Register
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden ${scrolled ? "text-cyan-400" : "text-white"}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-6 bg-gray-900/95 backdrop-blur-md rounded-xl p-6 space-y-6 border border-gray-800">
          {/* Navigation */}
          <div className="space-y-4">
            {["Home", "Destinations", "News", "Contact"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                onClick={closeAll}
                className="block text-lg font-medium text-white hover:text-cyan-400 no-underline"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-6 space-y-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{user.firstName || "User"}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>

                <Button
                  to="/profile"
                  variant="outline"
                  size="lg"
                  block
                  leftIcon={<User size={18} />}
                  onClick={closeAll}
                >
                  Profile
                </Button>

                <Button
                  to="/bookings"
                  variant="outline"
                  size="lg"
                  block
                  leftIcon={<CalendarDays size={18} />}
                  onClick={closeAll}
                >
                  My Bookings
                </Button>

                <Button
                  variant="danger"
                  size="lg"
                  block
                  leftIcon={<LogOut size={18} />}
                  onClick={() => {
                    logoutWithRedirect();
                    closeAll();
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  to="/login"
                  variant="outline"
                  size="lg"
                  block
                  className="bg-white text-gray-900 border-white hover:bg-gray-100"
                  onClick={closeAll}
                >
                  Login
                </Button>

                <Button
                  to="/register"
                  variant="primary"
                  size="lg"
                  block
                  onClick={closeAll}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
