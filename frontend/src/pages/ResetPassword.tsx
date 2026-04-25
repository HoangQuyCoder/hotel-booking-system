import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthApi } from "../hooks/useAuthApi";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();

  const { useValidateToken, resetPassword } = useAuthApi();
  const { isPending: isValidating, isError: isTokenInvalid } =
    useValidateToken(token);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 6) {
      return setPasswordError("Password must be at least 6 characters.");
    }

    if (newPassword !== confirmPassword) {
      return setPasswordError("Passwords do not match.");
    }

    resetPassword.mutate(
      { token, password: newPassword, confirmPassword },
      {
        onSuccess: () => {
          setSuccess(true);
        },
      },
    );
  };

  // ── Loading: validating token ──
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
          <p className="text-sm">Validating reset link…</p>
        </div>
      </div>
    );
  }

  // ── Invalid / expired token ──
  if (isTokenInvalid || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <section
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/maldives.jpg')" }}
        />
        <div className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-50 p-4 rounded-full">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Link expired</h2>
          <p className="text-gray-500 text-sm">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Button block onClick={() => navigate("/forgot-password")}>
            Request new link
          </Button>
        </div>
      </div>
    );
  }

  // ── Success ──
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <section
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/maldives.jpg')" }}
        />
        <div className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-50 p-4 rounded-full">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Password reset!</h2>
          <p className="text-gray-500 text-sm">
            Your password has been updated successfully.
          </p>
          <Button block onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // ── Main form ──
  return (
    <div className="min-h-screen font-sans overflow-x-hidden">
      <section
        className="relative h-screen bg-cover bg-center flex flex-col justify-center"
        style={{ backgroundImage: "url('/images/maldives.jpg')" }}
      >
        <div className="flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-2">
              Reset Password
            </h2>
            <p className="text-center text-gray-500 text-sm mb-8">
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError("");
                }}
                required
                autoFocus
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError("");
                }}
                required
              />

              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}

              <Button type="submit" block loading={resetPassword.isPending}>
                Reset Password
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
