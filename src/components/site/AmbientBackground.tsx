export function AmbientBackground() {
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary Brand Mint Teal Blob */}
      <div
        className="absolute -top-[10%] left-[15%] w-[650px] h-[650px] rounded-full opacity-30 blur-[150px] animate-pulse-slow"
        style={{ background: "radial-gradient(circle, #27e2c4 0%, rgba(39,226,196,0) 70%)" }}
      />

      {/* Sky Blue Aurora Blob */}
      <div
        className="absolute top-[25%] right-[5%] w-[700px] h-[700px] rounded-full opacity-25 blur-[160px] animate-drift-slow"
        style={{ background: "radial-gradient(circle, #38bdf8 0%, rgba(56,189,248,0) 70%)" }}
      />

      {/* Deep Violet / Indigo Accent Blob */}
      <div
        className="absolute top-[55%] left-[5%] w-[600px] h-[600px] rounded-full opacity-20 blur-[160px] animate-pulse-slow"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, rgba(139,92,246,0) 70%)" }}
      />

      {/* Bottom Brand Mint Teal Glow */}
      <div
        className="absolute -bottom-[10%] right-[20%] w-[700px] h-[700px] rounded-full opacity-25 blur-[150px] animate-drift-slow"
        style={{ background: "radial-gradient(circle, #27e2c4 0%, rgba(39,226,196,0) 70%)" }}
      />
    </div>
  );
}
