import { TECHNOLOGIES } from "@/data/technologies";
import { Reveal } from "./Reveal";

/**
 * Marquee — Infinite, slow, edge-faded tech logo marquee.
 * Pauses on hover. Uses duplicated list for seamless loop.
 */
export function Marquee() {
  const items = [...TECHNOLOGIES, ...TECHNOLOGIES];

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="section-divider mb-12" />

      <Reveal>
        <p className="text-center text-xs font-mono uppercase tracking-[0.2em] text-white/30 mb-8">
          Technologies we work with
        </p>
      </Reveal>

      {/* Edge fade masks */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#050A18] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#050A18] to-transparent z-10 pointer-events-none" />

        {/* Marquee track */}
        <div className="flex animate-marquee hover:[animation-play-state:paused] w-max">
          {items.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="flex items-center px-8 sm:px-12"
            >
              <span className="text-sm sm:text-base font-medium text-white/25 whitespace-nowrap hover:text-white/50 transition-colors duration-300 font-display tracking-wide">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-12" />
    </section>
  );
}
