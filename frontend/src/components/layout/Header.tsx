import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { LogIn, User, LogOut } from "lucide-react";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-bottom sticky-top">
      <Container>
        <nav className="navbar navbar-expand-lg">
          <Link className="navbar-brand fw-bold text-primary" to="/">
            HotelBooking
          </Link>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              {user ? (
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      <User size={18} />
                      {user.firstName}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          Hồ sơ
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/bookings">
                          Đặt phòng
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={logout}
                        >
                          <LogOut size={16} className="me-2" />
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<LogIn size={16} />}
                      >
                        Đăng nhập
                      </Button>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register">
                      <Button size="sm">Đăng ký</Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </Container>
    </header>
  );
};
