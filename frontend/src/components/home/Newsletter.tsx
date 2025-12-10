import { useState } from "react";
import { Mail, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail("");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Card Container */}
      <div className="bg-gray-200 rounded-2xl shadow-lg max-w-4xl w-full overflow-hidden flex flex-col md:flex-row">
        {/* Left Image */}
        <div className="md:w-1/2 h-64 md:h-auto">
          <img
            src="/src/assets/images/newsletter-image.jpg"
            alt="Newsletter"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Special Offers & Travel Tips
          </h2>
          <p className="text-gray-700 mb-6">
            Subscribe to our newsletter and be the first to know about exclusive
            deals!
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              {submitted ? <Check className="w-5 h-5" /> : "Subscribe"}
              {submitted && "Subscribed!"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
