import GesaHero from "@/components/GesaHero";
import GesaAbout from "@/components/GesaAbout";
import GesaCTA from "@/components/GesaCTA";
import GesaFlashCardPromo from "@/components/GesaFlashCardPromo";

export default function Home() {
  return (
    <div className="font-sans">
      <GesaHero />
      <GesaAbout />
      <GesaFlashCardPromo />
      <GesaCTA />
    </div>
  );
}
