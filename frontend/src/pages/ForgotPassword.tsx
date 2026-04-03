import { useState } from "react";
import { useAuthApi } from "../hooks/useAuthApi";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword } = useAuthApi();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    forgotPassword.mutate(
      { email },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      }
    );
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden">
      <section
        className="relative h-screen bg-cover bg-center flex flex-col justify-center"
        style={{ backgroundImage: "url('/src/assets/images/maldives.jpg')" }}
      >
        <div className="flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            {!submitted ? (
              <>
                <h2 className="text-3xl font-bold text-center mb-2">
                  Forgot Password
                </h2>
                <p className="text-center text-gray-500 text-sm mb-8">
                  Enter your email and we'll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />

                  <Button
                    type="submit"
                    block
                    loading={forgotPassword.isPending}
                  >
                    Send Reset Link
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="bg-cyan-50 p-4 rounded-full">
                    <Mail className="w-10 h-10 text-cyan-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Check your inbox
                </h2>
                <p className="text-gray-500 text-sm">
                  If an account with{" "}
                  <strong className="text-cyan-600">{email}</strong> exists,
                  you'll receive a password reset email shortly.
                </p>
              </div>
            )}

            <p className="text-center mt-6 text-sm text-gray-600">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-1 text-cyan-600 font-medium hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
