import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

type Step = 1 | 2 | 3;

export default function Register() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  // Temporary stored data
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    password: "",
  });

  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);

  // Countdown
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  // Re-send verification code
  const handleResendCode = async () => {
    setResending(true);
    setError("");
    try {
      await authApi.sendVerificationCode({ email });
      setCountdown(60);
      setVerificationCode("");
      toast.success("Verification code has been resent!");
    } catch (err: any) {
      toast.error("Failed to resend verification code.");
    } finally {
      setResending(false);
    }
  };

  // Step 1: Send code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.sendVerificationCode({ email });
      setStep(2);
      toast.success("Verification code sent!");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to send code. Email may already exist."
      );
      toast.error("Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.verifyCode({ email, code: verificationCode });
      setStep(3);
      toast.success("Verification successful!");
    } catch (err: any) {
      setError("Invalid or expired verification code.");
      toast.error("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Register account
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || "",
        address: formData.address || "",
      });

      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setError("");
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1f2f] to-[#12131f] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Create an Account
          </h2>
          <p className="text-gray-600 mt-2">Step {step} / 3</p>

          <div className="flex justify-center mt-4 gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 w-16 rounded-full transition-all ${
                  i <= step ? "bg-cyan-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to receive verification code"
                className="w-full px-4 py-3 bg-[#f8f9ff] text-gray-900 border rounded-lg
             focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                autoFocus
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2: Verification Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">We sent a 6-digit code to</p>
              <p className="font-semibold text-cyan-600 text-lg">{email}</p>
            </div>

            {/* Code input */}
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setVerificationCode(value);
                }}
                placeholder="------"
                className="w-full text-center text-3xl bg-[#f8f9ff] font-bold tracking-widest px-4 py-5 
                border-2 rounded-xl focus:ring-4 focus:ring-cyan-500 focus:border-cyan-500"
                required
                autoFocus
              />

              {/* Fake boxes */}
              <div className="absolute inset-0 pointer-events-none flex justify-center items-center px-8">
                <div className="flex gap-3">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-12 h-14 border-2 rounded-lg ${
                        verificationCode[i]
                          ? "border-cyan-600 bg-cyan-50"
                          : "border-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-600">
                  Resend code in{" "}
                  <span className="font-bold text-cyan-600 text-lg">
                    {countdown}s
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  disabled={resending}
                  onClick={handleResendCode}
                  className="text-cyan-600 font-semibold hover:underline disabled:text-gray-400"
                >
                  {resending ? "Resending..." : "Resend verification code"}
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 border py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="flex-1 bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-400"
              >
                {loading ? "Verifying..." : "Continue"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: User info */}
        {step === 3 && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First name *"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#f8f9ff] text-gray-900 border rounded-lg
             focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />

              <input
                name="lastName"
                placeholder="Last name *"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <input
              type="password"
              placeholder="Password *"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              required
              minLength={6}
            />

            <input
              placeholder="Phone number (optional)"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <input
              placeholder="Address (optional)"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 border py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-400"
              >
                {loading ? "Creating account..." : "Finish"}
              </button>
            </div>
          </form>
        )}

        <p className="text-center mt-8 text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-cyan-600 font-semibold hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
