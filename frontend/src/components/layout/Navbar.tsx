import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LogIn, LogOut, Menu, X, User, ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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
          className={`text-2xl font-bold transition no-underline ${
            scrolled ? "text-cyan-400" : "text-white"
          }`}
          onClick={closeAll}
        >
          ACENDA
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 font-medium">
          {["Home", "Destinations", "News", "Contact"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              onClick={closeAll}
              className={`transition no-underline ${hoverColor} ${textColor}`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3" ref={dropdownRef}>
          {user ? (
            <div className="relative">
              {/* Nút mở dropdown - dùng Button variant ghost */}
              <Button
                variant="ghost"
                size="md"
                className="text-white hover:bg-white/10"
                onClick={() => setAccountOpen(!accountOpen)}
                rightIcon={
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${accountOpen ? "rotate-180" : ""}`}
                  />
                }
              >
                <User size={20} />
                {user.firstName || "User"}
              </Button>

              {/* Dropdown Menu */}
              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
                  <div className="p-3 border-b border-gray-800">
                    <p className="text-sm text-gray-400">Signed in as</p>
                    <p className="font-semibold text-white truncate">
                      {user.email || user.firstName}
                    </p>
                  </div>

                  <Link to="/profile" onClick={closeAll}>
                    <Button
                      variant="ghost"
                      size="md"
                      block
                      leftIcon={<User size={18} />}
                      className="justify-start text-gray-200 hover:bg-gray-800"
                    >
                      Profile
                    </Button>
                  </Link>

                  <Link to="/bookings" onClick={closeAll}>
                    <Button
                      variant="ghost"
                      size="md"
                      block
                      leftIcon={<LogIn size={18} />}
                      className="justify-start text-gray-200 hover:bg-gray-800"
                    >
                      My Bookings
                    </Button>
                  </Link>

                  <div className="border-t border-gray-800">
                    <Button
                      variant="danger"
                      size="md"
                      block
                      leftIcon={<LogOut size={18} />}
                      onClick={() => {
                        logout();
                        closeAll();
                      }}
                      className="justify-start rounded-none"
                    >
                      Sign out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button asChild variant="outline" size="md">
                <Link to="/login">
                  <LogIn size={18} />
                  Login
                </Link>
              </Button>

              <Button asChild variant="primary" size="md">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden ${scrolled ? "text-cyan-400" : "text-white"} transition`}
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
                className="block text-lg font-medium text-white hover:text-cyan-400 transition"
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

                <Button asChild variant="outline" size="lg" block>
                  <Link to="/profile" onClick={closeAll}>
                    <User size={18} />
                    Profile
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" block>
                  <Link to="/bookings" onClick={closeAll}>
                    My Bookings
                  </Link>
                </Button>

                <Button
                  variant="danger"
                  size="lg"
                  block
                  leftIcon={<LogOut size={18} />}
                  onClick={() => {
                    logout();
                    closeAll();
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="lg" block>
                  <Link to="/login" onClick={closeAll}>
                    <LogIn size={18} />
                    Login
                  </Link>
                </Button>

                <Button asChild variant="primary" size="lg" block>
                  <Link to="/register" onClick={closeAll}>
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}