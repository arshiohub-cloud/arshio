import { Check } from "lucide-react";
import { Section } from "./Section";

const values = [
  "Custom AI solutions built on unique datasets",
  "Hassle-free, intuitive user interfaces",
  "Accurate, specific, and actionable outputs",
  "In-house built, fully owned products",
  "Integrity and customer-first experience",
  "Continuous AI research and product iteration",
];

function Card({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="glass-card p-7 relative"
      style={{ borderTop: "2px solid #7c3aed" }}
    >
      <div className="text-3xl text-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-3 text-center">{title}</h3>
      <div className="text-sm text-[#888] leading-relaxed">{children}</div>
    </div>
  );
}

export function WhoWeAre() {
  return (
    <section
      className="relative py-24 border-b border-white/5"
      style={{
        background: "#0a0a0a",
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <Section bg="transparent" title="Who We Are">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card icon="🎯" title="Our Mission">
            To deliver cutting-edge AI-powered ITES and software solutions that
            maximize value for enterprises and governments globally — making
            intelligent technology accessible to all.
          </Card>
          <Card icon="🔭" title="Our Vision">
            To become a leading AI services and product company in the USA
            and beyond — democratizing the power of Artificial Intelligence to
            solve humanity's greatest challenges.
          </Card>
          <Card icon="💎" title="Our Values">
            <ul className="space-y-2">
              {values.map((v) => (
                <li key={v} className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#a78bfa" }}
                  />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>
    </section>
  );
}
