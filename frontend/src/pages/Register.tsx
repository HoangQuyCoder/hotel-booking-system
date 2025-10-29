import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../hooks/useAuth";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  preferredLanguage: string;
}

const schema = yup
  .object({
    username: yup.string().required("Bắt buộc"),
    email: yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    password: yup.string().min(6).required("Bắt buộc"),
    firstName: yup.string().required("Bắt buộc"),
    lastName: yup.string().required("Bắt buộc"),
    phoneNumber: yup.string().required("Bắt buộc"),
    address: yup.string().required("Bắt buộc"),
    preferredLanguage: yup.string().required("Bắt buộc"),
  })
  .required();

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: yupResolver(schema) });
  const { register: registerUser } = useAuth();

  const onSubmit = (data: RegisterForm) => registerUser(data);

  return (
    <div className="container my-5">
      <div className="card mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h3 className="card-title text-center">Đăng ký</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-danger">{errors.username.message}</p>
              )}
            </div>
            {/* Thêm các field khác tương tự: email, password, firstName, v.v. */}
            <button type="submit" className="btn btn-primary w-100">
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
