import HeroSection from "../components/home/HeroSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Partners from "../components/home/Partners";
import TopHotels from "../components/home/TopHotels";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import ExploreMaldives from "../components/home/ExploreMaldives";
import FeatureNews from "../components/home/FeatureNews";

export default function Home() {
  return (
    <div className="font-sans bg-gray-50 overflow-x-hidden">
      <HeroSection />
      <WhyChooseUs />
      <Partners />
      <ExploreMaldives />
      <FeatureNews />
      <TopHotels />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
