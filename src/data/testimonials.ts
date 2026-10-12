export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  metric: { label: string; value: string };
};

/** Placeholder testimonials — replace with real client quotes */
export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    quote: "Arshio transformed our outdated inventory system into a real-time ERP dashboard that our entire team actually enjoys using. The speed of delivery was remarkable.",
    name: "Sarah Mitchell",
    role: "Head of Operations",
    company: "Apex Global Supply Chain",
    metric: { label: "Operational lag reduced", value: "68%" },
  },
  {
    id: "t2",
    quote: "Their design team didn't just make things pretty — they restructured our entire user flow. Onboarding completion jumped from 23% to over 60% in the first month.",
    name: "James Park",
    role: "Product Lead",
    company: "Nexus Cloud Inc.",
    metric: { label: "User retention boost", value: "+140%" },
  },
  {
    id: "t3",
    quote: "We went from a 4-second page load to under 600ms. Our mobile conversion rate doubled within weeks of the new storefront going live.",
    name: "Priya Sharma",
    role: "E-Commerce Director",
    company: "Omni Apparel Global",
    metric: { label: "Sales increase", value: "+210%" },
  },
  {
    id: "t4",
    quote: "The motion reels Arshio produced for our product launch went genuinely viral. Over 4 million organic views and our best ROAS quarter ever.",
    name: "David Chen",
    role: "Marketing VP",
    company: "HyperGlow Beverage Co.",
    metric: { label: "Total organic views", value: "4.2M+" },
  },
];
