const partners = [
  { name: "Cozybnb", logo: "https://logo.clearbit.com/airbnb.com" },
  { name: "Serendipity", logo: "https://logo.clearbit.com/marriott.com" },
  { name: "Earthly", logo: "https://logo.clearbit.com/tripadvisor.com" },
  { name: "The Nook", logo: "https://logo.clearbit.com/booking.com" },
  { name: "Home", logo: "https://logo.clearbit.com/agoda.com" },
];

export default function Partners() {
  return (
    <section className="pb-16 md:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          OUR PARTNERS
        </h2>

        {/* Carousel Container */}
        <div className="flex overflow-x-hidden space-x-12 items-center scrollbar-hide justify-center">
          {partners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 flex items-center space-x-3 w-auto md:w-24 text-gray-900"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-16 h-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
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
