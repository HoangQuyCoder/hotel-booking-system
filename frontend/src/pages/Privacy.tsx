export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950 text-gray-300 py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12 prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-10 text-center">
          Last updated: April 2026
        </p>

        <h2 className="text-2xl font-semibold text-white mt-12 mb-6">
          1. Information We Collect
        </h2>
        <p className="text-gray-400">
          We collect personal information when you register, book a tour,
          contact support, or interact with our website, including name, email,
          phone number, payment details, and passport information when
          necessary.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-12 mb-6">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-400">
          <li>To process bookings and payments</li>
          <li>To send confirmations, e-tickets, and trip information</li>
          <li>To improve our services and user experience</li>
          <li>To send marketing notifications (you can opt out anytime)</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-12 mb-6">
          3. Information Sharing
        </h2>
        <p className="text-gray-400">
          We only share necessary information with service providers (airlines,
          hotels, tour guides) to fulfill your trip. We do not sell your
          personal data to third parties.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-12 mb-6">
          4. Data Security
        </h2>
        <p className="text-gray-400">
          All data is transmitted via secure SSL connections. We apply technical
          and organizational measures to protect your information.
        </p>

        <p className="mt-16 text-gray-400 text-sm">
          If you have any questions about our Privacy Policy, please contact us
          at: <span className="text-blue-400">booking@theodore.com</span>
        </p>
      </div>
    </div>
  );
}
