import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { EstimatorSection } from "@/components/site/EstimatorSection";
import { Footer } from "@/components/site/Footer";
import { AmbientBackground } from "@/components/site/AmbientBackground";

export const Route = createFileRoute("/estimator")({
  head: () => ({
    meta: [
      { title: "Project Cost & Timeline Estimator — Arshio Digital Agency" },
      { name: "description", content: "Calculate your instant project estimate for Custom ERP, UI/UX Design, Motion Reels, Web Development, and Mobile Apps." },
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
