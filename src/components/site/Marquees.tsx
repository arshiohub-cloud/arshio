import { Section } from "./Section";
import iso27001 from "@/assets/certs/iso27001.png";
import soc2 from "@/assets/certs/soc2.png";
import pcidss from "@/assets/certs/pcidss.png";
import gdpr from "@/assets/certs/gdpr.png";
import iso9001 from "@/assets/certs/iso9001.png";
import cmmi from "@/assets/certs/cmmi.png";
import nist from "@/assets/certs/nist.png";
import itil from "@/assets/certs/itil.png";
import everify from "@/assets/certs/everify.png";
import fedramp from "@/assets/certs/fedramp.png";
import hipaa from "@/assets/certs/hipaa.png";
import basis from "@/assets/certs/basis.png";


type LogoImg = { label: string; src: string };

function ImgCell({ item }: { item: LogoImg }) {
  return (
    <div className="flex items-center justify-center p-6 rounded-2xl border border-white/10 bg-white hover:border-white/20 transition-colors min-h-[140px]">
      <img
        src={item.src}
        alt={item.label}
        className="max-h-20 max-w-full object-contain"
        loading="lazy"
      />
    </div>
  );
}


export function Certifications() {
  const items: LogoImg[] = [
    { label: "ISO 27001", src: iso27001 },
    { label: "SOC 2 Type II", src: soc2 },
    { label: "PCI DSS", src: pcidss },
    { label: "GDPR Compliant", src: gdpr },
    { label: "ISO 9001", src: iso9001 },
    { label: "CMMI Institute", src: cmmi },
    { label: "NIST", src: nist },
    { label: "ITIL", src: itil },
    { label: "E-Verify", src: everify },
    { label: "FedRAMP", src: fedramp },
    { label: "HIPAA", src: hipaa },
    { label: "BASIS", src: basis },
  ];
  return (
    <Section
      bg="#0a0a0a"
      title="Certifications & Standards"
      subtitle="Compliant with the world's most rigorous security and quality frameworks."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((it, i) => (
          <ImgCell key={i} item={it} />
        ))}
      </div>
    </Section>
  );
}

export function Clients() {
  return (
    <Section
      title="AI Delivery Signals"
      subtitle="Enterprise-style AI systems designed for secure deployment, measurable automation, and production reliability."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          ["LLM Systems", "Private copilots, RAG search, prompt evaluation, and guarded generation."],
          ["Agent Automation", "Multi-step AI workflows connected to business tools, approvals, and reporting."],
          ["Vision Intelligence", "Document, image, video, OCR, inspection, and multimodal analysis pipelines."],
          ["AI Operations", "Monitoring, evaluation, privacy controls, cost tracking, and deployment support."],
        ].map(([title, desc]) => (
          <div key={title} className="glass-card p-6 min-h-[170px]">
            <div className="text-xs uppercase tracking-wider text-[#67e8f9] mb-3">Production AI</div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm text-[#888] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

