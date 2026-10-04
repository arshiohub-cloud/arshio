import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";

const VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // swap as needed

export function WatchDemoButton() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setShow(true));
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [open]);

  const close = () => {
    setShow(false);
    setTimeout(() => setOpen(false), 250);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-medium hover:border-white/50 transition"
      >
        <span className="relative inline-flex w-6 h-6 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#7c3aed]/30 animate-ping group-hover:bg-[#7c3aed]/60" />
          <Play className="w-3.5 h-3.5 fill-white text-white relative group-hover:text-[#a78bfa] group-hover:fill-[#a78bfa] transition" />
        </span>
        Watch Demo
      </button>

      {open && (
        <div
          onClick={close}
          className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ${
            show ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-[900px] aspect-video rounded-xl overflow-hidden border border-white/10 transition-transform duration-300 ${
              show ? "scale-100" : "scale-90"
            }`}
          >
            <iframe
              src={VIDEO_URL}
              title="Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:rotate-90 hover:border-white/60 transition-transform duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}
