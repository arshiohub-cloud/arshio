import { MapPin, Clock, Navigation, ParkingCircle } from "lucide-react";
import { useFadeIn } from "@/hooks/use-fade-in";

export function FindUs() {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="relative py-24 border-b border-white/5 overflow-hidden" style={{ background: "#080808" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.06), transparent 60%)" }}
      />
      <div ref={ref} className="fade-up relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight rainbow-text">
            🗺️ Find Us
          </h2>
          <p className="mt-4 text-[#888] max-w-2xl mx-auto">
            Visit our office in Jackson Heights, New York.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-start">
          {/* Map */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 60px rgba(124,58,237,0.08)",
            }}
          >
            <iframe
              title="Office location map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-73.8835!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHeritage+Tower+82-11+37th+Avenue+Jackson+Heights+NY+11372!5e0!3m2!1sen!2sus"
              width="100%"
              height="560"
              style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full h-[400px] md:h-[480px] lg:h-[560px]"
            />
          </div>

          {/* Info Column */}
          <div className="flex flex-col gap-4 w-full">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Visit Our Office
            </h3>

            <InfoCard
              icon={<MapPin size={18} color="#a78bfa" />}
              label="Address"
              value={[
                "Heritage Tower, Suite-LL2",
                "82-11 37th Avenue",
                "Jackson Heights, NY 11372",
              ]}
            />
            <InfoCard
              icon={<Navigation size={18} color="#a78bfa" />}
              label="Getting Here"
              value={[
                "Accessible by subway (7 train),",
                "bus, and ride-sharing services.",
              ]}
            />
            <InfoCard
              icon={<ParkingCircle size={18} color="#a78bfa" />}
              label="Parking"
              value={[
                "Street parking available.",
                "Nearby parking garages on 37th Ave.",
              ]}
            />
            <InfoCard
              icon={<Clock size={18} color="#a78bfa" />}
              label="Office Hours"
              value={[
                "Mon–Fri: 9:00 AM – 6:00 PM",
                "Sat: 10:00 AM – 4:00 PM",
              ]}
            />

            <a
              href="https://maps.google.com/?q=Heritage+Tower+82-11+37th+Avenue+Jackson+Heights+NY+11372"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center mt-2 py-2.5 text-[13px] font-medium rounded-lg transition duration-200"
              style={{
                border: "1px solid rgba(124,58,237,0.4)",
                color: "#a78bfa",
                background: "rgba(124,58,237,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,0.18)";
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,0.08)";
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
              }}
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string[];
}) {
  return (
    <div
      className="flex gap-3 items-start w-full"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "18px 20px",
      }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: "rgba(124,58,237,0.12)",
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontSize: "15px",
            color: "#ffffff",
            fontWeight: 600,
            marginBottom: "4px",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: "13px", color: "#aaa", lineHeight: 1.6 }}>
          {value.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
