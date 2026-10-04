import { Cpu, Code2, Smartphone, Palette, Clapperboard, TrendingUp, type LucideIcon } from "lucide-react";

export type ServiceItem = {
  slug: string;
  Icon: LucideIcon;
  title: string;
  desc: string;
  bullets: string[];
  tags: string[];
  accent: string;
};

export const SERVICES: ServiceItem[] = [
  {
    slug: "custom-software-erp-crm",
    Icon: Cpu,
    title: "Custom Software & ERP / CRM",
    desc: "Tailor-made enterprise software, ERP systems, CRM platforms, and automated workflow solutions built for complex business operations.",
    bullets: [
      "Custom ERP & CRM Platform Development",
      "Business Process & Workflow Automation",
      "SaaS Multi-Tenant Cloud Architecture",
      "Database & Legacy System API Integration",
    ],
    tags: ["ERP / CRM", "Enterprise", "Custom SaaS"],
    accent: "#27e2c4",
  },
  {
    slug: "web-development",
    Icon: Code2,
    title: "Web & E-Commerce Development",
    desc: "High-performance React & Next.js web applications, custom e-commerce stores, and high-converting landing pages with sub-second speeds.",
    bullets: [
      "Custom React, Next.js & Full-Stack Apps",
      "Shopify & E-Commerce Platform Build",
      "High-Converting Landing Pages",
      "CMS & Custom REST/GraphQL APIs",
    ],
    tags: ["Web Dev", "Next.js", "E-Commerce"],
    accent: "#38bdf8",
  },
  {
    slug: "mobile-app-development",
    Icon: Smartphone,
    title: "Mobile App Development",
    desc: "Native and cross-platform iOS and Android mobile applications featuring intuitive UX, offline sync, and secure backend integration.",
    bullets: [
      "React Native & Flutter Mobile Apps",
      "iOS App Store & Google Play Publishing",
      "Enterprise & Consumer Companion Apps",
      "Real-Time Push Notifications & Analytics",
    ],
    tags: ["Mobile App", "iOS", "Android"],
    accent: "#f59e0b",
  },
  {
    slug: "ui-ux-graphic-design",
    Icon: Palette,
    title: "UI/UX & Visual Graphic Design",
    desc: "Converting complex ideas into visually stunning brand identities, interactive Figma prototypes, and high-converting graphic designs.",
    bullets: [
      "Figma UI/UX & Interactive Prototypes",
      "Brand Identity Systems & Logos",
      "Social Media Ad Visuals & Banners",
      "Print, Packaging & Corporate Branding",
    ],
    tags: ["UI/UX", "Branding", "Design"],
    accent: "#ec4899",
  },
  {
    slug: "video-editing-motion",
    Icon: Clapperboard,
    title: "Video Editing & Motion Reels",
    desc: "Engaging short-form TikTok/Reels, commercial ads, 2D/3D motion graphics, and high-production video post-production.",
    bullets: [
      "TikTok, Instagram Reels & YouTube Shorts",
      "Commercial Video Ads & Product Promos",
      "2D/3D Motion Graphics & VFX",
      "Color Grading & Audio Master Mixing",
    ],
    tags: ["Video Editing", "Reels", "Motion"],
    accent: "#8b5cf6",
  },
  {
    slug: "digital-marketing-growth",
    Icon: TrendingUp,
    title: "Digital Marketing & Growth",
    desc: "Data-driven Meta & Google ad campaigns, Search Engine Optimization (SEO), and sales funnel optimization to scale ROI.",
    bullets: [
      "Meta Ads & Google PPC Campaign Management",
      "Search Engine & Generative AI SEO",
      "Social Media Management & Growth",
      "Conversion Rate Optimization (CRO)",
    ],
    tags: ["Marketing", "Meta Ads", "SEO"],
    accent: "#10b981",
  },
];
