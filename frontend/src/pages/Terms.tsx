export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950 opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,255,255,0.1),transparent)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
            Terms of Service
          </h1>
          <p className="text-slate-300">Last updated: April 2026</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-30">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">
            1. Introduction
          </h2>
          <p className="text-slate-600">
            Welcome to Theodore. By accessing and using our website and services,
            you agree to comply with these Terms of Service.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">
            2. Our Services
          </h2>
          <p className="text-slate-600">
            Theodore operates as a platform for booking tours, flights, hotels,
            and travel services. We act as an intermediary connecting you with
            third-party service providers.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">
            3. Booking & Payment Policy
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-slate-600">
            <li>Prices are subject to change without prior notice.</li>
            <li>
              Full payment is required before departure unless otherwise agreed.
            </li>
            <li>
              Cancellation and refund policies are clearly stated for each tour.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">
            4. Customer Responsibilities
          </h2>
          <p className="text-slate-600">
            You are responsible for providing accurate information, having a valid
            passport, necessary visa, and being in suitable health for the trip.
          </p>

          <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl mt-12 shadow-sm">
            <p className="text-amber-800 font-medium">
              Theodore is not liable for any loss, delay, or cancellation caused
              by third-party providers, natural disasters, epidemics, or force
              majeure events.
            </p>
          </div>

          <p className="text-sm text-slate-500 mt-20 text-center">
            Continued use of our website constitutes your acceptance of these
            Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
