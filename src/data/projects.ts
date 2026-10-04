export type ProjectCategory =
  | "All"
  | "Custom ERP & Software"
  | "Web Development"
  | "Mobile Apps"
  | "UI/UX & Branding"
  | "Video & Motion Reels"
  | "Digital Growth Marketing";

export type ProjectItem = {
  id: string;
  title: string;
  category: ProjectCategory;
  client: string;
  description: string;
  fullChallenge?: string;
  fullSolution?: string;
  image: string;
  videoUrl?: string; // For video editing showcases
  beforeImage?: string; // For interactive slider
  afterImage?: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  featured?: boolean;
};

export const PROJECTS: ProjectItem[] = [
  {
    id: "apex-enterprise-erp",
    title: "Apex Logistics Custom ERP & Multi-Branch Inventory Engine",
    category: "Custom ERP & Software",
    client: "Apex Global Supply Chain",
    description: "Built a centralized cloud ERP system to handle multi-warehouse stock sync, real-time shipment dispatching, and automated invoicing.",
    fullChallenge: "Apex was losing 15+ hours weekly to manual Excel inventory reconciliation across 4 regional warehouses, resulting in order fulfillment delays.",
    fullSolution: "We engineered a custom Node.js + PostgreSQL ERP dashboard with automated inventory triggers, barcode scanning API, and real-time P&L reporting.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "Operational Lag", value: "-68%" },
      { label: "Stock Accuracy", value: "99.9%" },
    ],
    tags: ["Node.js", "PostgreSQL", "Docker", "REST API"],
    featured: true,
  },
  {
    id: "nexus-saas-rebrand",
    title: "Nexus SaaS Analytics Dashboard Redesign & Design System",
    category: "UI/UX & Branding",
    client: "Nexus Cloud Inc.",
    description: "Complete UI/UX design overhaul for a B2B data analytics web application, simplifying complex workflows into intuitive user flows.",
    fullChallenge: "High user drop-off during user onboarding due to cluttered tables and dated UI navigation.",
    fullSolution: "Delivered a dark-mode first design system in Figma with 120+ reusable components, resulting in faster user onboarding and higher retention.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    beforeImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    metrics: [
      { label: "User Retention", value: "+140%" },
      { label: "Design Time", value: "3 Weeks" },
    ],
    tags: ["Figma", "UI/UX", "Design System", "User Research"],
    featured: true,
  },
  {
    id: "omni-ecommerce-web",
    title: "Omni Luxury Fashion Web Store & Sub-Second Checkout",
    category: "Web Development",
    client: "Omni Apparel Global",
    description: "Blazing-fast Next.js e-commerce storefront with server-side rendering, headless Shopify API integration, and dynamic multi-currency support.",
    fullChallenge: "Legacy WooCommerce site suffered 4.2s page load speeds, causing high cart abandonment on mobile visitors.",
    fullSolution: "Migrated to Next.js 15 on Vercel with optimized image pipelines and instant cart drawer, dropping page load to under 0.6 seconds.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "Page Load Speed", value: "0.58s" },
      { label: "Sales Increase", value: "+210%" },
    ],
    tags: ["Next.js", "React 19", "Tailwind CSS", "Shopify API"],
    featured: true,
  },
  {
    id: "hyper-glow-viral-reels",
    title: "HyperGlow Energy Drink Motion Commercials & Viral Reels",
    category: "Video & Motion Reels",
    client: "HyperGlow Beverage Co.",
    description: "High-octane 3D product motion graphics, sound design, and short-form TikTok/Reels campaign generating millions of organic engagements.",
    fullChallenge: "Needed high-energy visual content for Gen-Z audience across Instagram Reels and TikTok ad units.",
    fullSolution: "Edited 12 short-form dynamic reels in Premiere Pro & After Effects with custom sound design, color grading, and motion typography.",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    metrics: [
      { label: "Total Views", value: "4.2M+" },
      { label: "ROAS Impact", value: "4.5x" },
    ],
    tags: ["Premiere Pro", "After Effects", "Color Grading", "4K Mastering"],
    featured: true,
  },
  {
    id: "fitpulse-fitness-app",
    title: "FitPulse iOS & Android Live Workout Companion App",
    category: "Mobile Apps",
    client: "FitPulse Health Technologies",
    description: "Cross-platform mobile app featuring live biometric heart rate tracking, customizable workout plans, and offline sync.",
    fullChallenge: "Client needed a single codebase solution for iOS and Android without sacrificing native performance or Bluetooth hardware connectivity.",
    fullSolution: "Engineered a React Native mobile application connected to a Firebase real-time backend with native iOS/Android BLE plugins.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "App Downloads", value: "85K+" },
      { label: "Store Rating", value: "4.9 ★" },
    ],
    tags: ["React Native", "iOS", "Android", "Firebase"],
    featured: true,
  },
  {
    id: "zenith-meta-growth-campaign",
    title: "Zenith FinTech Multi-Channel Customer Acquisition Campaign",
    category: "Digital Growth Marketing",
    client: "Zenith Pay Solutions",
    description: "Full-funnel Meta & Google Ads strategy combined with custom conversion-optimized landing pages.",
    fullChallenge: "High acquisition cost per user ($42 per qualified lead) across paid channels.",
    fullSolution: "Rebuilt landing pages with clear value propositions and optimized paid ad targeting, slashing CPL by 45% while doubling lead volume.",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "Leads Generated", value: "12,400+" },
      { label: "Cost Per Lead", value: "-45%" },
    ],
    tags: ["Meta Ads", "Google Ads PPC", "Funnel Optimization", "GA4"],
    featured: true,
  },
];
