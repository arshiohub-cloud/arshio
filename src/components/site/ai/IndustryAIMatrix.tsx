import { useState } from "react";
import { Heart, GraduationCap, Banknote, ShoppingBag, Factory, Tractor, Building2, Landmark } from "lucide-react";

const DATA = [
  { Icon: Heart, name: "Healthcare", color: "#f472b6", uses: ["Clinical note summarization", "Radiology vision triage", "Patient intake copilots", "Drug interaction RAG"] },
  { Icon: GraduationCap, name: "Education", color: "#67e8f9", uses: ["Adaptive lesson plans", "Smart assessments", "Student progress copilots", "Content generation AI", "Plagiarism detection"] },
  { Icon: Banknote, name: "Finance", color: "#a3e635", uses: ["Fraud detection", "AML agents", "Credit scoring RAG", "Robo-advisory", "Regulatory reporting automation"] },
  { Icon: ShoppingBag, name: "Retail", color: "#fbbf24", uses: ["Hyper-personalization engine", "Visual search", "Dynamic pricing AI", "Conversational shopping copilot", "Inventory demand forecasting"] },
  { Icon: Factory, name: "Manufacturing", color: "#a78bfa", uses: ["Predictive maintenance", "Vision QA", "Demand forecasting", "Autonomous logistics planning", "Digital twin simulation"] },
  { Icon: Tractor, name: "Agriculture", color: "#34d399", uses: ["Crop disease detection", "Weather-based forecasting", "Supply chain optimization", "Farmer engagement bots", "Yield prediction AI"] },
  { Icon: Building2, name: "Real Estate", color: "#60a5fa", uses: ["Conversational property search", "Image understanding", "Market forecasting", "Lead qualification AI", "Automated listing analysis"] },
  { Icon: Landmark, name: "Public Sector", color: "#f59e0b", uses: ["Citizen-facing copilots", "Intelligent document processing", "Digital identity verification", "GIS analysis", "Sovereign on-prem LLM deployment"] },
];

export function IndustryAIMatrix() {
  const [active, setActive] = useState(0);
  const item = DATA[active];

  return (
    <div className="glass-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
      <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible">
        {DATA.map((d, i) => (
          <button
            key={d.name}
            onClick={() => setActive(i)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition whitespace-nowrap ${
              i === active ? "bg-white/5 border border-white/10 text-white" : "text-[#888] hover:text-white border border-transparent"
            }`}
          >
            <d.Icon className="w-4 h-4" style={{ color: d.color }} />
            {d.name}
          </button>
        ))}
      </div>
      <div className="rounded-xl p-6" style={{ background: `radial-gradient(circle at top left, ${item.color}18, transparent), #050505`, border: `1px solid ${item.color}33` }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `${item.color}1a`, border: `1px solid ${item.color}55` }}>
            <item.Icon className="w-6 h-6" style={{ color: item.color }} />
          </span>
          <div>
            <h3 className="text-white font-semibold text-xl">{item.name} AI</h3>
            <p className="text-xs text-[#888]">Production-grade AI levers we deploy in {item.name.toLowerCase()}.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {item.uses.map((u) => (
            <div key={u} className="flex items-start gap-2 p-3 rounded-lg bg-black/40 border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: item.color }} />
              <span className="text-sm text-[#ddd]">{u}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
