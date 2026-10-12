import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Services } from "@/components/site/Services";
import { SelectedWork } from "@/components/site/SelectedWork";
import { WhyArshio } from "@/components/site/WhyArshio";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { TestimonialSlider } from "@/components/site/TestimonialSlider";
import { EstimatorTeaser } from "@/components/site/EstimatorTeaser";
import { CTAContact } from "@/components/site/CTAContact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title: "Arshio — Design-Led Digital Products That Scale Your Business" },
      { name: "description", content: "Full-service digital agency: UI/UX Design, Web & Mobile Apps, Video & Motion, Custom Software, Growth Marketing. Senior talent, transparent pricing, real results." },
      { property: "og:title", content: "Arshio — Design-Led Digital Products" },
      { property: "og:description", content: "UI/UX, Web Apps, Mobile, Video & Motion, Growth Marketing. Premium digital agency." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://arshio.vercel.app" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen text-white">
      {/* All sections are transparent — GlobalBackground in root handles the BG */}
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <SelectedWork />
        <WhyArshio />
        <ProcessTimeline />
        <TestimonialSlider />
        <EstimatorTeaser />
        <CTAContact />
      </main>
      <Footer />
    </div>
  );
}
