const partners = [
  {
    name: "Cozybnb",
    logo: "/images/partners/cozybnb.png"
  },
  {
    name: "Serendipity",
    logo: "/images/partners/serendipity.png"
  },
  {
    name: "Earthly",
    logo: "/images/partners/earthly.png"
  },
  {
    name: "The Nook",
    logo: "/images/partners/thenook.png"
  },
  {
    name: "Home",
    logo: "/images/partners/home.png"
  },
];

export default function Partners() {
  return (
    <section className="pb-24 md:pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          OUR PARTNERS
        </h2>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
          {partners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex items-center gap-2 text-gray-900"
            >
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="w-12 h-12 md:w-16 md:h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder-logo.png";
                }}
              />
              <span className="text-sm md:text-base font-medium">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}