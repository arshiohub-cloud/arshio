import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — Thin teal progress bar at the top of the viewport.
 * Shows scroll progress through the page.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2DE0C6] to-[#22B8F0] origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}
