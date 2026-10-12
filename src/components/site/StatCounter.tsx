import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/data/stats";

/**
 * StatCounter — Animated count-up statistics strip.
 * Counts up from 0 when the section scrolls into view.
 */
export function StatCounter({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className={`grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 ${className}`}
    >
      {STATS.map((stat, i) => (
        <CountUpItem
          key={stat.label}
          stat={stat}
          isInView={isInView}
          delay={i * 0.1}
        />
      ))}
    </div>
  );
}

function CountUpItem({
  stat,
  isInView,
  delay,
}: {
  stat: (typeof STATS)[number];
  isInView: boolean;
  delay: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      const duration = 1800;
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        current = Math.min(stat.value, increment * step);
        setCount(
          Number.isInteger(stat.value)
            ? Math.round(current)
            : parseFloat(current.toFixed(1))
        );

        if (step >= steps) clearInterval(interval);
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, stat.value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <div className="text-3xl sm:text-4xl font-bold font-display text-white">
        {stat.prefix}
        {count}
        <span className="text-[#2DE0C6]">{stat.suffix}</span>
      </div>
      <div className="mt-1 text-sm text-white/50">{stat.label}</div>
    </motion.div>
  );
}
