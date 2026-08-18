import { Hero } from "@/components/hero/Hero";
import { TechStrip } from "@/components/hero/TechStrip";
import { SelectedProjects } from "@/components/home/SelectedProjects";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ExperienceTimeline } from "@/components/home/ExperienceTimeline";
import { TechnicalExpertise } from "@/components/home/TechnicalExpertise";
import { EngineeringApproach } from "@/components/home/EngineeringApproach";
import { CallToAction } from "@/components/home/CallToAction";

export default function Home() {
  return (
    <div>
      <Hero />
      <TechStrip />
      <SelectedProjects />
      <ServicesSection />
      <ExperienceTimeline />
      <TechnicalExpertise />
      <EngineeringApproach />
      <CallToAction />
    </div>
  );
}
