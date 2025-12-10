import { useState } from "react";
import { useAuthApi } from "../hooks/useAuthApi";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthApi();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/");
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
            <h2 className="text-3xl font-bold text-center mb-8">Sign In</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" block disabled={login.isPending}>
                {login.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-cyan-600 font-medium hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
