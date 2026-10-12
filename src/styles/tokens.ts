/**
 * Arshio Design Tokens
 * Central source of truth for all design values.
 */

export const colors = {
  // Base backgrounds
  bgDeep: "#050A18",
  bgBase: "#070D1F",
  bgSurface1: "rgba(11, 19, 43, 0.75)",
  bgSurface2: "rgba(19, 31, 55, 0.85)",
  bgGlass: "rgba(11, 19, 43, 0.6)",

  // Brand accents
  teal: "#2DE0C6",
  tealDim: "rgba(45, 224, 198, 0.15)",
  tealGlow: "rgba(45, 224, 198, 0.25)",
  cyan: "#22B8F0",
  indigo: "#5B5BF0",
  magenta: "rgba(236, 72, 153, 0.3)",
  violet: "#8B5CF6",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.72)",
  textTertiary: "rgba(255, 255, 255, 0.48)",
  textMuted: "rgba(255, 255, 255, 0.36)",

  // Borders
  borderSubtle: "rgba(255, 255, 255, 0.08)",
  borderLight: "rgba(255, 255, 255, 0.12)",
  borderHover: "rgba(45, 224, 198, 0.4)",

  // Service accents
  accentSoftware: "#2DE0C6",
  accentWeb: "#38BDF8",
  accentMobile: "#F59E0B",
  accentDesign: "#EC4899",
  accentVideo: "#8B5CF6",
  accentMarketing: "#10B981",
} as const;

export const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  full: "9999px",
} as const;

export const spacing = {
  section: "clamp(80px, 10vw, 140px)",
  sectionSm: "clamp(48px, 6vw, 80px)",
  container: "clamp(16px, 4vw, 80px)",
} as const;

export const shadows = {
  glow: "0 0 40px rgba(45, 224, 198, 0.15)",
  glowStrong: "0 0 60px rgba(45, 224, 198, 0.3)",
  card: "0 4px 24px rgba(0, 0, 0, 0.25)",
  cardHover: "0 8px 40px rgba(0, 0, 0, 0.35), 0 0 30px rgba(45, 224, 198, 0.12)",
  button: "0 4px 20px rgba(45, 224, 198, 0.25)",
} as const;

export const zIndex = {
  background: -1,
  base: 0,
  content: 10,
  navbar: 50,
  overlay: 100,
  modal: 200,
  cursor: 300,
} as const;

export const typography = {
  fontDisplay: '"Sora", "Plus Jakarta Sans", system-ui, sans-serif',
  fontBody: '"Inter", "Plus Jakarta Sans", system-ui, sans-serif',
  fontMono: '"JetBrains Mono", "Fira Code", monospace',
  heroSize: "clamp(2.75rem, 6vw, 5.5rem)",
  heroTracking: "-0.02em",
  heroLineHeight: "1.05",
} as const;

export const motion = {
  /** Blob drift duration range in seconds */
  blobSpeedMin: 25,
  blobSpeedMax: 40,
  /** Blob opacity range */
  blobOpacityMin: 0.12,
  blobOpacityMax: 0.25,
  /** Standard easing */
  ease: [0.22, 1, 0.36, 1] as const,
  /** Section reveal */
  revealDuration: 0.6,
  revealY: 24,
  staggerChildren: 0.08,
} as const;
