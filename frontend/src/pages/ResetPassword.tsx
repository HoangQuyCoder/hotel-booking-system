import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import apiClient from "../services/apiClient";
import { toast } from "react-toastify";

interface ResetForm {
  newPassword: string;
  confirmPassword: string;
}

const schema = yup
  .object({
    newPassword: yup.string().min(6).required("Bắt buộc"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Mật khẩu không khớp")
      .required("Bắt buộc"),
  })
  .required();

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (token) {
      apiClient
        .get(`/auth/validate-reset-token?token=${token}`)
        .catch(() => toast.error("Token không hợp lệ"));
    }
  }, [token]);

  const onSubmit = async (data: ResetForm) => {
    try {
      await apiClient.post("/auth/reset-password", { ...data, token });
      toast.success("Mật khẩu đã được đặt lại!");
    } catch {
      // toast.error(err.response?.data?.message || "Thất bại");
    }
  };

  if (!token) return <p>Token không tồn tại</p>;

  return (
    <div className="container my-5">
      <div className="card mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h3 className="card-title text-center">Đặt lại mật khẩu</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Mật khẩu mới</label>
              <input
                type="password"
                className="form-control"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-danger">{errors.newPassword.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Xác nhận mật khẩu</label>
              <input
                type="password"
                className="form-control"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-danger">{errors.confirmPassword.message}</p>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Đặt lại
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
