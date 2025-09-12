import Telemedicine from "@/components/Telemedicine";
import ThirdPartyEarning from "@/components/ThirdPartyEarning";
import Hero from "@/components/Hero";
import ContactCTA from "@/components/ContactCTA";
import PointsConversion from "@/components/PointsConversion";
import GroceryShopping from "@/components/GroceryShopping";
// import Card from "@/components/Card"; // no longer used after gradient card refactor

export default function Home() {
  return (
    <div className="font-sans">
      <Hero />

      {/* Third-Party Earning */}
      <ThirdPartyEarning />

      {/* Telemedicine */}
      <Telemedicine />

      {/* Grocery & Shopping (Coming soon) */}
      <GroceryShopping />

      {/* Points & Currency Conversion */}
      <PointsConversion />

      

      {/* Contact CTA */}
      <ContactCTA />
    </div>
  );
}
