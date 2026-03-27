import { useEffect, useState } from "react";
import { useAuthApi } from "../hooks/useAuthApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ArrowLeft, RefreshCw } from "lucide-react";

type Step = 1 | 2 | 3;

export default function Register() {
  const [step, setStep] = useState<Step>(1);
  const navigate = useNavigate();

  const {
    sendCode,
    verifyCode,
    register: registerMutation,
  } = useAuthApi();

  // Form data
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });

  const [countdown, setCountdown] = useState(0);

  // Countdown for OTP
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  // ========== STEP 1: Send verification code ==========
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return toast.error("Please enter your email");

    await sendCode.mutateAsync(
      { email },
      {
        onSuccess: () => {
          setCountdown(60);
          setStep(2);
        },
      }
    );
  };

  // Resend code
  const handleResendCode = async () => {
    await sendCode.mutateAsync({ email });
    setCountdown(60);
    setVerificationCode("");
  };

  // ========== STEP 2: Verify code ==========
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      return toast.error("Please enter the full 6-digit code");
    }

    await verifyCode.mutateAsync(
      { email, code: verificationCode },
      {
        onSuccess: () => setStep(3),
      }
    );
  };

  // ========== STEP 3: Register ==========
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.password) {
      return toast.error("Please fill in all fields");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    await registerMutation.mutateAsync(
      {
        email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      },
      {
        onSuccess: () => navigate("/"),
      }
    );
  };

  const goBack = () =>
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));

  return (
    <div className="min-h-screen font-sans overflow-x-hidden">
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center px-4"
        style={{ backgroundImage: "url('/src/assets/images/maldives.jpg')" }}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Create an Account
            </h2>
            <p className="text-gray-600 mt-2">Step {step} of 3</p>
            <div className="flex justify-center gap-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-20 rounded-full transition-all duration-300 ${i <= step ? "bg-cyan-600" : "bg-gray-300"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <Input
                label="Your Email"
                type="email"
                placeholder="Enter your email to receive the code"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />

              <Button type="submit" loading={sendCode.isPending} block>
                Continue
              </Button>
            </form>
          )}

          {/* STEP 2: Enter OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  We've sent a <strong>6-digit verification code</strong> to:
                </p>
                <p className="font-bold text-cyan-600 text-lg mt-1 break-all">
                  {email}
                </p>
              </div>

              {/* 6-digit OTP input */}
              <div className="flex justify-center gap-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={verificationCode[i] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (!val) return;
                      const newCode = verificationCode.split("");
                      newCode[i] = val;
                      setVerificationCode(newCode.join("").slice(0, 6));
                      if (i < 5)
                        document.getElementById(`otp-${i + 1}`)?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" &&
                        !verificationCode[i] &&
                        i > 0
                      ) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    id={`otp-${i}`}
                    className="w-12 h-14 text-2xl font-bold text-center border-2 rounded-lg outline-none transition-all focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100 bg-gray-50"
                    autoFocus={i === 0}
                    onPaste={(e) => {
                      const paste = e.clipboardData.getData("text").replace(/\D/g, "");
                      if (paste.length === 6) {
                        setVerificationCode(paste);
                      }
                    }}
                  />
                ))}
              </div>

              {/* Resend logic */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-600">
                    Resend code in{" "}
                    <strong className="text-cyan-600 text-lg">
                      {countdown}s
                    </strong>
                  </p>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleResendCode}
                    loading={sendCode.isPending}
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                  >
                    Resend verification code
                  </Button>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={goBack}
                  block
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  loading={verifyCode.isPending}
                  disabled={verificationCode.length !== 6}
                  block
                >
                  Verify
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: Personal Information */}
          {step === 3 && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="e.g. John"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>

              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                minLength={6}
                required
              />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={goBack}
                  block
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button type="submit" loading={registerMutation.isPending} block>
                  Complete Registration
                </Button>
              </div>
            </form>
          )}

          {/* Login link */}
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
      </section>
    </div>
  );
}
