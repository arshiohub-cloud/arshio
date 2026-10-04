import { Headphones, PhoneCall, Calendar, ShoppingBag, Stethoscope, GraduationCap } from "lucide-react";

const cases = [
  { Icon: PhoneCall,     name: "Inbound receptionist", stat: "94%", statLabel: "calls answered in 1 ring",  color: "#a78bfa" },
  { Icon: Headphones,    name: "24/7 customer support", stat: "71%", statLabel: "tickets fully resolved",   color: "#22d3ee" },
  { Icon: Calendar,      name: "Outbound scheduling",   stat: "3.4×", statLabel: "more meetings booked",    color: "#f472b6" },
  { Icon: ShoppingBag,   name: "Voice commerce",         stat: "+38%", statLabel: "AOV on AI-led orders",   color: "#facc15" },
  { Icon: Stethoscope,   name: "Healthcare intake",      stat: "9 min", statLabel: "saved per patient",     color: "#a3e635" },
  { Icon: GraduationCap, name: "Voice tutoring",         stat: "2.1×", statLabel: "faster mastery",         color: "#fb7185" },
];

export function VoiceUseCases() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {cases.map((c) => (
        <div
          key={c.name}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition cursor-pointer"
        >
          <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"
            style={{ background: c.color }}
          />
          <div className="relative flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: `${c.color}22`, border: `1px solid ${c.color}55` }}
            >
              <c.Icon className="w-4 h-4" style={{ color: c.color }} />
            </div>
            <div className="text-[12.5px] text-white/85 font-medium leading-tight">{c.name}</div>
          </div>
          <div className="relative">
            <div className="text-2xl font-bold text-white tabular-nums">{c.stat}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/50 mt-0.5">{c.statLabel}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
