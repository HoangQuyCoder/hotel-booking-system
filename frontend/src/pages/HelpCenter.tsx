import { HelpCircle, Search, Phone, Mail, Clock } from "lucide-react";

export default function HelpCenter() {
  const faqs = [
    {
      q: "How do I book a tour on Theodore?",
      a: "Simply search for your desired destination, choose the suitable tour, and complete the payment online. You will receive a confirmation email immediately.",
    },
    {
      q: "What is the cancellation policy?",
      a: "Cancellation 30 days before departure: 100% refund (excluding bank fees). 15 days before: 50% refund. Within 7 days: No refund.",
    },
    {
      q: "Can I change my departure date?",
      a: "Yes, subject to availability. Please notify us at least 14 days in advance. A change fee may apply depending on the tour.",
    },
    {
      q: "Does Theodore assist with visa applications?",
      a: "We provide visa consultation and document guidance for popular destinations. Full visa service is available for selected countries.",
    },
    {
      q: "Is payment secure?",
      a: "We accept Visa, Mastercard, VNPay, Momo, and bank transfer. All transactions are protected with SSL encryption.",
    },
    {
      q: "What if I need emergency support while traveling?",
      a: "Our 24/7 support team is ready to assist you via hotline +84 123 456 789 or email.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[350px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-contact.png" 
            alt="Help Center" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/20 z-10" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md">
            Help <span className="text-cyan-400">Center</span>
          </h1>
          <p className="text-xl text-slate-100 max-w-2xl mx-auto drop-shadow-sm">
            We’re here to make your journey perfect. Find answers to common questions or reach out to our team.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-30 pb-24">

        {/* Search bar */}
        <div className="relative mb-12">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search your question..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl py-4 pl-14 pr-6 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-900 p-8 rounded-2xl text-center">
            <Phone className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <h3 className="font-semibold text-white mb-2">Hotline</h3>
            <p className="text-xl font-bold text-white">+84 123 456 789</p>
            <p className="text-sm text-gray-400 mt-2">24/7 Support</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-2xl text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <h3 className="font-semibold text-white mb-2">Email</h3>
            <p className="text-xl text-white">booking@theodore.com</p>
            <p className="text-sm text-gray-400 mt-2">Reply within 24 hours</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-2xl text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <h3 className="font-semibold text-white mb-2">Response Time</h3>
            <p className="text-white">Under 2 hours during business hours</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <HelpCircle className="w-8 h-8" /> Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-gray-900 rounded-2xl p-6 group">
              <summary className="font-medium text-white cursor-pointer flex justify-between items-center list-none">
                {faq.q}
                <span className="text-blue-400 group-open:rotate-180 transition">
                  ↓
                </span>
              </summary>
              <div className="mt-4 text-gray-400 leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400">Still can’t find the answer?</p>
          <a
            href="/contact"
            className="no-underline inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition"
          >
            Contact Us Now
          </a>
        </div>
      </div>
    </div>
  );
}
