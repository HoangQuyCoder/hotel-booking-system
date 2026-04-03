import { SearchBar } from "../search/SearchBar";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning!";
  if (hour < 18) return "Good Afternoon!";
  return "Good Evening!";
}

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex items-end md:items-center py-16"
      style={{ backgroundImage: `url("/images/maldives.jpg")` }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />

      {/* Content */}
      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 sm:p-12 md:p-12 max-w-6xl mx-auto text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sky-600 mb-2">
            {getGreeting()}
          </h1>
          <p className="text-gray-700 text-base sm:text-lg mb-6 md:mb-8">
            Explore beautiful places in the world with Acenda
          </p>

          <SearchBar />
        </div>
      </div>
    </section>
  );
}
