import { Container } from "../ui/Container";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-light border-top mt-auto py-5">
      <Container>
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">HotelBooking</h5>
            <p className="text-muted small">
              Đặt phòng khách sạn dễ dàng, giá tốt nhất.
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h6>Thông tin</h6>
            <ul className="list-unstyled text-small">
              <li>
                <a className="text-muted" href="#">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a className="text-muted" href="#">
                  Liên hệ
                </a>
              </li>
              <li>
                <a className="text-muted" href="#">
                  Điều khoản
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6>Theo dõi</h6>
            <div className="d-flex gap-2">
              <a href="#" className="text-muted">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <hr />
        <p className="text-center text-muted small mb-0">
          © 2025 HotelBooking. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};
