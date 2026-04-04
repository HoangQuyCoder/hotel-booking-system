export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950 text-gray-300 py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12 prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-10 text-center">
          Last updated: April 2026
        </p>

        <h2 className="text-2xl font-semibold text-white mt-12 mb-6">
          1. Introduction
        </h2>
        <p className="text-gray-400">
          Welcome to Theodore. By accessing and using our website and services,
          you agree to comply with these Terms of Service.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-12 mb-6">
          2. Our Services
        </h2>
        <p className="text-gray-400">
          Theodore operates as a platform for booking tours, flights, hotels,
          and travel services. We act as an intermediary connecting you with
          third-party service providers.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-12 mb-6">
          3. Booking & Payment Policy
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-400">
          <li>Prices are subject to change without prior notice.</li>
          <li>
            Full payment is required before departure unless otherwise agreed.
          </li>
          <li>
            Cancellation and refund policies are clearly stated for each tour.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-12 mb-6">
          4. Customer Responsibilities
        </h2>
        <p className="text-gray-400">
          You are responsible for providing accurate information, having a valid
          passport, necessary visa, and being in suitable health for the trip.
        </p>

        <div className="bg-amber-900/30 border border-amber-700 p-8 rounded-2xl mt-12">
          <p className="text-amber-300">
            Theodore is not liable for any loss, delay, or cancellation caused
            by third-party providers, natural disasters, epidemics, or force
            majeure events.
          </p>
        </div>

        <p className="text-sm text-gray-500 mt-20 text-center">
          Continued use of our website constitutes your acceptance of these
          Terms of Service.
        </p>
      </div>
    </div>
  );
}
