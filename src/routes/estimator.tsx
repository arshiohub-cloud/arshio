import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { EstimatorSection } from "@/components/site/EstimatorSection";
import { Footer } from "@/components/site/Footer";
import { AmbientBackground } from "@/components/site/AmbientBackground";

export const Route = createFileRoute("/estimator")({
  head: () => ({
    meta: [
      { title: "Scope & Investment Guide — Arshio Digital Agency" },
      { name: "description", content: "Explore transparent project scope, timelines, and starting investments for Custom ERP Software, Web Development, Mobile Apps, and UI/UX." },
    ],
  }),
  component: EstimatorPage,
});

function EstimatorPage() {
  return (
    <div className="relative min-h-screen bg-[#070d1e] text-white overflow-hidden">
      {/* Universal Floating Ambient Mesh Gradient Aurora */}
      <AmbientBackground />

      <div className="relative z-10">
        <TopBar />
        <Navbar />
        <main className="py-8">
          <EstimatorSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
