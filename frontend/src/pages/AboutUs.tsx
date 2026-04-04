import { Users, Award, Globe, Heart, ArrowRight } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About Theodore
          </h1>
          <p className="text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in discovering the world’s most beautiful
            destinations with passion, professionalism, and care.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl font-semibold text-white mb-8">
              Our Story
            </h2>
            <div className="space-y-6 text-lg text-gray-400">
              <p>
                Founded in 2025 in Vinh Long, Vietnam, Theodore was born from a
                simple dream: to make extraordinary travel experiences
                accessible to everyone.
              </p>
              <p>
                What started as a small local tour operator has grown into a
                trusted travel platform that connects travelers with authentic
                destinations across Vietnam and around the world.
              </p>
              <p>
                We believe travel is more than just visiting places — it’s about
                creating meaningful memories, understanding different cultures,
                and returning home with a broader perspective.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-10">
            <div className="aspect-video bg-gray-800 rounded-2xl flex items-center justify-center mb-8">
              <div className="text-center">
                <Globe className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-500">Our Journey Around the World</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 text-center">
              From the Mekong Delta to the mountains of Sapa, from the beaches
              of Phu Quoc to the wonders of the world.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <h2 className="text-4xl font-semibold text-white text-center mb-12">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-900 p-8 rounded-3xl text-center group hover:scale-105 transition duration-300">
              <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/20 transition">
                <Heart className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Passion
              </h3>
              <p className="text-gray-400">
                We travel with heart and share our genuine love for exploration
                with every traveler.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-3xl text-center group hover:scale-105 transition duration-300">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-500/20 transition">
                <Award className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Quality
              </h3>
              <p className="text-gray-400">
                We carefully select every partner and experience to ensure the
                highest standards.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-3xl text-center group hover:scale-105 transition duration-300">
              <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-500/20 transition">
                <Users className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Care</h3>
              <p className="text-gray-400">
                Your safety, comfort, and satisfaction are our top priorities at
                every step.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-3xl text-center group hover:scale-105 transition duration-300">
              <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/20 transition">
                <Globe className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Authenticity
              </h3>
              <p className="text-gray-400">
                We bring you real experiences, not just tourist attractions.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-900 rounded-3xl p-12 md:p-16 mb-24">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-semibold text-white mb-10">
                Why Travelers Choose Theodore
              </h2>
              <ul className="space-y-8">
                <li className="flex gap-6">
                  <div className="text-5xl font-bold text-blue-500/30">01</div>
                  <div>
                    <h4 className="text-xl font-medium text-white mb-2">
                      Expert Local Knowledge
                    </h4>
                    <p className="text-gray-400">
                      Our team consists of passionate locals who know Vietnam
                      and the world deeply.
                    </p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="text-5xl font-bold text-blue-500/30">02</div>
                  <div>
                    <h4 className="text-xl font-medium text-white mb-2">
                      Personalized Experiences
                    </h4>
                    <p className="text-gray-400">
                      Every journey is tailored to your interests, pace, and
                      budget.
                    </p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="text-5xl font-bold text-blue-500/30">03</div>
                  <div>
                    <h4 className="text-xl font-medium text-white mb-2">
                      24/7 Dedicated Support
                    </h4>
                    <p className="text-gray-400">
                      We’re always here for you before, during, and after your
                      trip.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex flex-col justify-center">
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-6xl">🌍</div>
                  <div>
                    <p className="text-5xl font-bold text-white">50,000+</p>
                    <p className="text-gray-400">Happy travelers</p>
                  </div>
                </div>
                <div className="h-px bg-gray-700 my-8"></div>
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <p className="text-4xl font-bold text-white">120+</p>
                    <p className="text-sm text-gray-400">Destinations</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-white">98%</p>
                    <p className="text-sm text-gray-400">Satisfaction rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-blue-900/30 to-transparent border border-blue-800 rounded-3xl p-12">
            <h3 className="text-blue-400 text-sm font-medium tracking-widest mb-4">
              OUR MISSION
            </h3>
            <p className="text-3xl leading-tight text-white">
              To inspire meaningful travel experiences that connect people with
              cultures, nature, and themselves.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/30 to-transparent border border-emerald-800 rounded-3xl p-12">
            <h3 className="text-emerald-400 text-sm font-medium tracking-widest mb-4">
              OUR VISION
            </h3>
            <p className="text-3xl leading-tight text-white">
              To become the most trusted and loved travel companion for
              explorers from Vietnam and around the world.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-4xl font-semibold text-white mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-gray-400 mb-10 max-w-md mx-auto">
            Let us help you discover your next unforgettable adventure.
          </p>
          <a
            href="/destinations"
            className="inline-flex items-center gap-3 bg-white text-gray-900 hover:bg-gray-100 font-semibold px-10 py-5 rounded-2xl transition text-lg"
          >
            Explore Destinations
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
}
