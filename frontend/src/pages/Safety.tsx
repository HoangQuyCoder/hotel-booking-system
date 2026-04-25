import { Shield, AlertTriangle, Plane } from "lucide-react";

export default function SafetyInformation() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-safety.png" 
            alt="Safety Information" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/20 z-10" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md">
            Safety <span className="text-cyan-400">Information</span>
          </h1>
          <p className="text-xl text-slate-100 max-w-2xl mx-auto drop-shadow-sm">
            Your safety is our top priority at Theodore. We are committed to
            providing secure and reliable travel experiences.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-30 pb-24">

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-8 rounded-3xl">
            <Shield className="w-12 h-12 text-green-400 mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">
              Our Safety Measures
            </h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex gap-3">
                ✓ Partner only with verified and reputable providers
              </li>
              <li className="flex gap-3">
                ✓ Professional tour guides with proper certifications
              </li>
              <li className="flex gap-3">
                ✓ Transportation meeting international safety standards
              </li>
              <li className="flex gap-3">
                ✓ Comprehensive travel insurance for all tours
              </li>
              <li className="flex gap-3">
                ✓ Real-time updates on health and security at destinations
              </li>
            </ul>
          </div>

          <div className="bg-gray-900 p-8 rounded-3xl">
            <AlertTriangle className="w-12 h-12 text-amber-400 mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">
              Travel Safety Tips
            </h3>
            <ul className="space-y-4 text-gray-400">
              <li>• Keep original documents and make copies</li>
              <li>• Use location tracking apps when traveling alone</li>
              <li>• Drink bottled water and eat thoroughly cooked food</li>
              <li>• Avoid going out alone at night in unfamiliar areas</li>
              <li>
                • Purchase comprehensive travel insurance before departure
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 bg-gray-900 p-10 rounded-3xl border border-gray-700">
          <h3 className="text-white text-2xl mb-6 flex items-center gap-3">
            <Plane className="w-8 h-8" /> Emergency Support
          </h3>
          <p className="text-lg text-gray-300 mb-6">
            Contact our 24/7 hotline immediately:{" "}
            <span className="font-bold text-white">+84 123 456 789</span>
          </p>
          <p className="text-gray-400">
            Our team will assist you as quickly as possible, no matter where you
            are in the world.
          </p>
        </div>
      </div>
    </div>
  );
}
