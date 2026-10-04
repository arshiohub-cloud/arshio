import { useState } from "react";
import { Calculator, Check, Clock, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

type ServiceOption = {
  id: string;
  name: string;
  basePriceUSD: number;
  baseDays: number;
};

const SERVICE_OPTIONS: ServiceOption[] = [
  { id: "ui-ux", name: "UI/UX & Brand Design", basePriceUSD: 800, baseDays: 7 },
  { id: "video", name: "Video Editing & Motion Reels", basePriceUSD: 500, baseDays: 5 },
  { id: "web-dev", name: "Custom Web App / Website", basePriceUSD: 1200, baseDays: 10 },
  { id: "app-dev", name: "Mobile App (iOS & Android)", basePriceUSD: 2000, baseDays: 14 },
  { id: "marketing", name: "Digital Marketing & Funnel Ads", basePriceUSD: 600, baseDays: 7 },
];

const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "BDT", symbol: "৳", rate: 120 },
  { code: "EUR", symbol: "€", rate: 0.92 },
];

export function EstimatorSection() {
  const [selectedServices, setSelectedServices] = useState<string[]>(["ui-ux", "web-dev"]);
  const [tier, setTier] = useState<"starter" | "growth" | "enterprise">("growth");
  const [speed, setSpeed] = useState<"standard" | "rush">("standard");
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const tierMultiplier = tier === "starter" ? 0.8 : tier === "growth" ? 1.0 : 1.7;
  const speedMultiplier = speed === "rush" ? 1.3 : 1.0;
  const daysSpeedMultiplier = speed === "rush" ? 0.6 : 1.0;

  const rawUSD = selectedServices.reduce((sum, id) => {
    const item = SERVICE_OPTIONS.find((s) => s.id === id);
    return sum + (item ? item.basePriceUSD : 0);
  }, 0);

  const rawDays = selectedServices.reduce((sum, id) => {
    const item = SERVICE_OPTIONS.find((s) => s.id === id);
    return sum + (item ? item.baseDays : 0);
  }, 0);

  const calculatedMinUSD = Math.round(rawUSD * tierMultiplier * speedMultiplier * 0.9);
  const calculatedMaxUSD = Math.round(rawUSD * tierMultiplier * speedMultiplier * 1.25);
  const estimatedDays = Math.max(3, Math.round(rawDays * daysSpeedMultiplier));

  const minConverted = Math.round(calculatedMinUSD * currency.rate);
  const maxConverted = Math.round(calculatedMaxUSD * currency.rate);

  return (
    <section className="py-24 bg-[#070d1e] border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" /> Interactive Estimator
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Calculate Your Project <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">Estimate & Timeline</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Select your required services and project scope to get an instant realistic cost and delivery estimate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-7 bg-[#0b132b] rounded-2xl border border-slate-800/80 p-6 sm:p-8 space-y-8 shadow-xl">
            {/* Currency Selector */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
              <span className="text-sm font-semibold text-slate-300">Preferred Currency:</span>
              <div className="flex items-center gap-1.5 bg-[#131f37] p-1 rounded-lg border border-slate-800">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      currency.code === c.code
                        ? "bg-[#27e2c4] text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {c.code} ({c.symbol})
                  </button>
                ))}
              </div>
            </div>

            {/* Service Checkboxes */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                1. Select Services Required:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICE_OPTIONS.map((srv) => {
                  const selected = selectedServices.includes(srv.id);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => toggleService(srv.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                        selected
                          ? "bg-[#27e2c4]/10 border-[#27e2c4] text-white shadow-sm"
                          : "bg-[#131f37]/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-sm font-semibold">{srv.name}</span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          selected
                            ? "bg-[#27e2c4] border-[#27e2c4] text-slate-950"
                            : "border-slate-700 bg-[#131f37]"
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scope Tier */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                2. Project Scale & Complexity:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "starter", label: "MVP / Essential", desc: "Small scale" },
                  { id: "growth", label: "Growth / Custom", desc: "Standard business" },
                  { id: "enterprise", label: "Enterprise Scale", desc: "Complex systems" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTier(t.id as any)}
                    className={`p-3.5 rounded-xl border text-center transition-all ${
                      tier === t.id
                        ? "bg-[#27e2c4]/10 border-[#27e2c4] text-white shadow-sm"
                        : "bg-[#131f37]/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="text-xs font-bold">{t.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Speed */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                3. Delivery Timeline Preference:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSpeed("standard")}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    speed === "standard"
                      ? "bg-[#27e2c4]/10 border-[#27e2c4] text-white"
                      : "bg-[#131f37]/60 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="text-xs font-bold">Standard Delivery</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Regular workflow</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSpeed("rush")}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    speed === "rush"
                      ? "bg-amber-500/10 border-amber-500 text-amber-300"
                      : "bg-[#131f37]/60 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-center gap-1">
                    ⚡ Priority Express (2x Faster)
                  </div>
                  <div className="text-[10px] text-amber-500/80 mt-0.5">+30% rush fee</div>
                </button>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="lg:col-span-5 bg-[#0b132b] rounded-2xl border border-[#27e2c4]/40 p-8 shadow-2xl relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#27e2c4] text-slate-950 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              Instant Quote
            </div>

            <h3 className="text-xl font-bold text-white mb-6">Estimated Investment</h3>

            {/* Price Output */}
            <div className="bg-[#070d1e] rounded-xl p-6 border border-slate-800/80 mb-6 text-center">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Project Price Range ({currency.code})
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text">
                {currency.symbol}{minConverted.toLocaleString()} – {currency.symbol}{maxConverted.toLocaleString()}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-[#27e2c4]" /> Estimated Time: <strong className="text-white">{estimatedDays} Business Days</strong>
              </div>
            </div>

            {/* Included Features */}
            <div className="space-y-3 mb-8">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                What's Included in this Estimate:
              </div>
              {[
                "Dedicated Senior Project Manager",
                "Source files (Figma, Code, Video 4K Master)",
                "2 Rounds of Revisions & Quality Assurance",
                "100% Ownership & Commercial IP License",
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-[#27e2c4] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Submit Quote Link */}
            <Link
              to="/contact"
              className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] py-3.5 rounded-xl shadow-lg shadow-[#27e2c4]/20 transition-all hover:scale-[1.02]"
            >
              Request Formal Proposal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
