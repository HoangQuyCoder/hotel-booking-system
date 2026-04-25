export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950 opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.1),transparent)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
            Privacy Policy
          </h1>
          <p className="text-slate-300">Last updated: April 2026</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-30">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">
            1. Information We Collect
          </h2>
          <p className="text-slate-600">
            We collect personal information when you register, book a tour,
            contact support, or interact with our website, including name,
            email, phone number, payment details, and passport information when
            necessary.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-slate-600">
            <li>To process bookings and payments</li>
            <li>To send confirmations, e-tickets, and trip information</li>
            <li>To improve our services and user experience</li>
            <li>To send marketing notifications (you can opt out anytime)</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">
            3. Information Sharing
          </h2>
          <p className="text-slate-600">
            We only share necessary information with service providers
            (airlines, hotels, tour guides) to fulfill your trip. We do not sell
            your personal data to third parties.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">
            4. Data Security
          </h2>
          <p className="text-slate-600">
            All data is transmitted via secure SSL connections. We apply
            technical and organizational measures to protect your information.
          </p>

          <p className="mt-16 text-slate-500 text-sm">
            If you have any questions about our Privacy Policy, please contact
            us at:{" "}
            <span className="text-cyan-600 font-semibold">
              booking@theodore.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
