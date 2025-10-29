import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    password: yup
      .string()
      .min(6, "Mật khẩu ít nhất 6 ký tự")
      .required("Bắt buộc"),
  })
  .required();

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: yupResolver(schema) });
  const { login } = useAuth();

  const onSubmit = (data: LoginForm) => login(data);

  return (
    <div className="container my-5">
      <div className="card mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h3 className="card-title text-center">Đăng nhập</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Email/Username</label>
              <input
                type="text"
                className="form-control"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Đăng nhập
            </button>
          </form>
          <p className="text-center mt-3">
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
