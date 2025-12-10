import { ArrowRight } from "lucide-react";

const resorts = [
  { name: "Azure Haven", image: "/src/assets/images/resort-1.jpg" },
  { name: "Serene Sanctuary", image: "/src/assets/images/resort-2.jpg" },
  { name: "Verdant Vista", image: "/src/assets/images/resort-3.jpg" },
];

export default function ExploreMaldives() {
  return (
    <section
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/src/assets/images/maldives-explore.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 text-white">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            EXPLORE MALDIVES
          </h1>
          <div className="w-24 h-px bg-white mb-6" />
          <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-xl">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </p>
          <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-100 transition group">
            See all
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Resort Cards */}
        <div className="absolute bottom-10 inset-x-0 flex justify-end gap-4 md:gap-6 px-10">
          {resorts.map((resort, i) => (
            <div
              key={i}
              className="group cursor-pointer transform transition-all hover:scale-105"
            >
              <div className="w-32 h-32 md:w-40 md:h-56 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={resort.image}
                  alt={resort.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
              </div>
              <p className="text-center mt-3 text-sm md:text-base font-medium">
                {resort.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
