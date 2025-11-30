import GesaHero from "@/components/GesaHero";
import GesaAbout from "@/components/GesaAbout";
import GesaCTA from "@/components/GesaCTA";

export default function Home() {
  return (
    <div className="font-sans">
      <GesaHero />
      <GesaAbout />
      <GesaCTA />
    </div>
  );
}
