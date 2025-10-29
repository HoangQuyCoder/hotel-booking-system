import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import apiClient from "../services/apiClient";
import { toast } from "react-toastify";

interface ForgotForm {
  email: string;
}

const schema = yup
  .object({
    email: yup.string().email("Email không hợp lệ").required("Bắt buộc"),
  })
  .required();

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: ForgotForm) => {
    try {
      await apiClient.post("/auth/forgot-password", data);
      toast.success("Email sent if account exists.");
    } catch {
      /* empty */
    }
  };

  return (
    <div className="container my-5">
      <div className="card mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h3 className="card-title text-center">Quên mật khẩu</h3>
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
            <button type="submit" className="btn btn-primary w-100">
              Gửi yêu cầu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
