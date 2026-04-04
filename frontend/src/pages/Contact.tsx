import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen  bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950 text-gray-300 py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions or need assistance? Our team is ready to help you
            plan your perfect journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3 bg-gray-900 rounded-3xl p-10">
            <h2 className="text-3xl font-semibold text-white mb-8">
              Send us a Message
            </h2>

            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition"
                  placeholder="+84 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Subject
                </label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition">
                  <option value="">Select a topic</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="visa">Visa Assistance</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition resize-y"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-2xl flex items-center justify-center gap-3 transition duration-200"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-900 rounded-3xl p-10">
              <h3 className="text-2xl font-semibold text-white mb-8">
                Contact Information
              </h3>

              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Phone / WhatsApp</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      +84 123 456 789
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Available 24/7</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-xl text-white mt-1">
                      booking@theodore.com
                    </p>
                    <p className="text-sm text-gray-400">
                      We reply within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Office Address</p>
                    <p className="text-white mt-2 leading-relaxed">
                      123 Pham Thai Buong Street
                      <br />
                      Thanh Duc District, Vinh Long City
                      <br />
                      Vietnam
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Business Hours</p>
                    <p className="text-white mt-2">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-900 rounded-3xl p-8">
              <h4 className="text-white font-medium mb-6">Need help faster?</h4>
              <div className="space-y-4">
                <a
                  href="/help-center"
                  className="no-underline block p-4 bg-gray-800 hover:bg-gray-700 rounded-2xl transition text-sm"
                >
                  → Visit our Help Center
                </a>
                <a
                  href="/safety-information"
                  className="no-underline block p-4 bg-gray-800 hover:bg-gray-700 rounded-2xl transition text-sm"
                >
                  → Read Safety Guidelines
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
