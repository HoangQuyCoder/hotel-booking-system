import { SearchBar } from "../search/SearchBar";

export default function HeroSection() {
  return (
    <section
      className="relative h-screen bg-cover bg-center flex flex-col justify-center"
      style={{ backgroundImage: "url('/src/assets/images/maldives.jpg')" }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pb-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-5xl mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-600 mb-2">
            Good Morning!
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Explore beautiful places in the world with Acenda
          </p>

          <SearchBar />
        </div>
      </div>
    </section>
  );
}
