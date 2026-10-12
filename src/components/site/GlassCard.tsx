import { type ReactNode, useRef, useState } from "react";
import { motion } from "framer-motion";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
  padding?: string;
};

/**
 * GlassCard — Reusable glass-morphism card with spotlight-follow border glow.
 */
export function GlassCard({
  children,
  className = "",
  hoverGlow = true,
  padding = "p-6",
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || !hoverGlow) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={ref}
      className={`glass-card ${padding} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {/* Spotlight glow effect */}
      {hoverGlow && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(45, 224, 198, 0.08), transparent 60%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
