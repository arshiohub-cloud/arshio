import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { PortfolioShowcase } from "@/components/site/PortfolioShowcase";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { EstimatorSection } from "@/components/site/EstimatorSection";
import { Process } from "@/components/site/Process";
import { ContactForm } from "@/components/site/ContactForm";
import { Footer } from "@/components/site/Footer";
import { AmbientBackground } from "@/components/site/AmbientBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arshio Digital Agency — UI/UX, Video Editing, Custom ERP/Software & Web Apps" },
      { name: "description", content: "Full-service digital agency specializing in UI/UX Design, Motion Video Reels, Custom Software, ERP/CRM, Web & Mobile Apps, and Performance Marketing." },
      { property: "og:title", content: "Arshio Digital Agency — All-in-One Creative & Tech Agency" },
      { property: "og:description", content: "UI/UX, Custom ERP/CRM, Video Editing, Web & Mobile App Development, Digital Marketing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-[#070d1e] text-white overflow-hidden">
      {/* Universal Floating Ambient Mesh Gradient Aurora */}
      <AmbientBackground />

      {/* Main Content Wrapper */}
      <div className="relative z-10">
        <TopBar />
        <Navbar />
        <main>
          <Hero />
          <Services />
          <PortfolioShowcase isPreview={true} />
          <WhyChooseUs />
          <TestimonialsSection />
          <EstimatorSection />
          <Process />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </div>
  );
}
