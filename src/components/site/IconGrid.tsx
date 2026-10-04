import type { LucideIcon } from "lucide-react";
import { Section } from "./Section";

export type IconGridItem = {
  icon?: LucideIcon;
  image?: string;
  label: string;
};

export function IconGrid({
  id,
  bg,
  title,
  subtitle,
  items,
  footer,
}: {
  id?: string;
  bg?: string;
  title: string;
  subtitle?: string;
  items: IconGridItem[];
  footer?: React.ReactNode;
}) {
  return (
    <Section id={id} bg={bg} title={title} subtitle={subtitle}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map(({ icon: Icon, image, label }) => (
          <div key={label} className="glass-card p-8 flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-white/10 transition">
              {image ? (
                <img
                  src={image}
                  alt={label}
                  loading="lazy"
                  className="w-10 h-10 object-contain"
                />
              ) : Icon ? (
                <Icon className="w-6 h-6 text-white" />
              ) : null}
            </div>
            <div className="text-sm font-medium text-white">{label}</div>
          </div>
        ))}
      </div>
      {footer && <div className="mt-12 text-center">{footer}</div>}
    </Section>
  );
}
