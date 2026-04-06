import { DollarSign, Shield, Zap } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="flex flex-col items-center text-center p-6 group">
    <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-cyan-600 transition-colors">
      <div className="text-cyan-600 group-hover:text-white transition-colors">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default function WhyChooseUs() {
  const features = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Best Price Guarantee",
      description:
        "Enjoy the most competitive prices in the market with our Best Price Guarantee. We ensure you get exceptional value without compromising on quality or service.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Booking",
      description:
        "Book with complete confidence. Our platform uses advanced encryption and industry-leading security standards to protect your personal data and payment information at all times.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Seamless Experience",
      description:
        "From browsing to booking and beyond, enjoy a fast, intuitive, and hassle-free journey. Our user-friendly platform and dedicated support make every step effortless.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          WHY CHOOSE US?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}