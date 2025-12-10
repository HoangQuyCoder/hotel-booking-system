import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import { LogIn, LogOut, Menu, X, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect: change navbar background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  const handleLinkClick = () => setMenuOpen(false);

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
        >
          ACENDA
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 font-medium">
          <Link
            to="/"
            onClick={handleLinkClick}
            className={`transition no-underline hover:text-cyan-400 ${
              scrolled ? "text-gray-200" : "text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/destinations"
            onClick={handleLinkClick}
            className={`transition no-underline hover:text-cyan-400 ${
              scrolled ? "text-gray-200" : "text-white"
            }`}
          >
            Destinations
          </Link>
          <Link
            to="/news"
            onClick={handleLinkClick}
            className={`transition no-underline hover:text-cyan-400 ${
              scrolled ? "text-gray-200" : "text-white"
            }`}
          >
            News
          </Link>
          <Link
            to="/contact"
            onClick={handleLinkClick}
            className={`transition no-underline hover:text-cyan-400 ${
              scrolled ? "text-gray-200" : "text-white"
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Auth Desktop */}
        <div
          className={`hidden md:flex items-center gap-4 text-sm font-medium relative ${
            scrolled ? "text-gray-200" : "text-white"
          }`}
        >
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setAccountOpen(true)}
              onMouseLeave={() => setAccountOpen(false)}
            >
              <button className="flex items-center gap-2">
                <User size={18} />
                <span>{user.firstName}</span>
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg">
                  <Link
                    to="/profile"
                    onClick={handleLinkClick}
                    className="block px-4 py-2 hover:bg-gray-100 no-underline"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/bookings"
                    onClick={handleLinkClick}
                    className="block px-4 py-2 hover:bg-gray-100 no-underline"
                  >
                    Booking
                  </Link>
                  <hr />
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="inline mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-3 py-2 border rounded-full transition no-underline ${
                  scrolled
                    ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900"
                    : "border-white text-white hover:bg-cyan-400"
                }`}
              >
                <LogIn size={16} className="inline mr-2" />
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white no-underline"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden transition ${
            scrolled ? "text-cyan-400" : "text-white"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-gray-900/90 backdrop-blur-md rounded-lg p-4 text-white text-sm space-y-3">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="block hover:text-cyan-400 no-underline"
          >
            Home
          </Link>
          <Link
            to="/destinations"
            onClick={handleLinkClick}
            className="block hover:text-cyan-400 no-underline"
          >
            Destinations
          </Link>
          <Link
            to="/news"
            onClick={handleLinkClick}
            className="block hover:text-cyan-400 no-underline"
          >
            News
          </Link>
          <Link
            to="/contact"
            onClick={handleLinkClick}
            className="block hover:text-cyan-400 no-underline"
          >
            Contact
          </Link>

          <hr className="border-gray-700" />

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={handleLinkClick}
                className="block hover:text-cyan-400 no-underline"
              >
                Profile
              </Link>
              <Link
                to="/bookings"
                onClick={handleLinkClick}
                className="block hover:text-cyan-400 no-underline"
              >
                Booking
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left text-red-400 hover:text-red-300 transition no-underline"
              >
                <LogOut size={16} className="inline mr-2" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="block px-4 py-2 border border-white rounded-full text-center hover:bg-white hover:text-gray-900 transition no-underline"
              >
                <LogIn size={16} className="inline mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="block px-4 py-2 bg-cyan-500 rounded-full text-center hover:bg-cyan-400 transition no-underline"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
