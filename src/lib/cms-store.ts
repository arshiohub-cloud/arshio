import { useState, useEffect } from "react";

export type SiteSettings = {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  availabilityBadge: string;
  isAcceptingProjects: boolean;
  slotsRemaining: number;
  responseTimeSLA: string;
  stats: {
    projectsDelivered: number;
    clientRating: number;
    avgResponseHours: number;
    countriesServed: number;
  };
  announcement: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  // Page Sections CMS
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    primaryBtnText: string;
    primaryBtnLink: string;
    secondaryBtnText: string;
    secondaryBtnLink: string;
    mockupUrl: string;
    mockupStatus: string;
    mockupLatency: string;
  };
  servicesSection: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
  };
  whyChooseUsSection: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    guarantee: string;
  };
  aboutPage: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    manifesto: string;
  };
  pricingSection: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
  };
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "Arshio Digital Agency",
  phone: "+880 1700-000000",
  email: "hello@arshio.agency",
  address: "Dhaka & New York",
  whatsappNumber: "8801700000000",
  availabilityBadge: "Accepting New Projects & ERP Audits",
  isAcceptingProjects: true,
  slotsRemaining: 4,
  responseTimeSLA: "Guaranteed 24-Hour Response",
  stats: {
    projectsDelivered: 50,
    clientRating: 4.9,
    avgResponseHours: 24,
    countriesServed: 12,
  },
  announcement: {
    enabled: false,
    text: "Special introductory rates for Q4 ERP & Full-Stack Projects",
    linkText: "Book Discovery Call",
    linkUrl: "/contact",
  },
  hero: {
    badge: "NEXT-GEN TECH & CREATIVE STUDIO",
    title: "One Dedicated Studio for All Your",
    titleAccent: "Tech & Marketing Needs.",
    subtitle:
      "Transforming ideas into high-performing web platforms, intuitive user interfaces, and scalable marketing funnels. Fast sprints, senior execution, guaranteed momentum.",
    primaryBtnText: "Start Your Project",
    primaryBtnLink: "/contact",
    secondaryBtnText: "Explore Case Studies",
    secondaryBtnLink: "/portfolio",
    mockupUrl: "app.arshio.dev/operations-dashboard",
    mockupStatus: "Live Engine: 99.98%",
    mockupLatency: "0.58s Global Average",
  },
  servicesSection: {
    badge: "OUR CORE CAPABILITIES",
    title: "High-Impact Digital Disciplines,",
    titleAccent: "Built to Scale.",
    subtitle:
      "From enterprise cloud ERP to high-converting mobile apps and viral motion reels. Every discipline under one roof.",
  },
  whyChooseUsSection: {
    badge: "BUILT FOR DISCERNING FOUNDERS",
    title: "Senior Talent. Direct Access.",
    titleAccent: "Zero Lock-In.",
    subtitle:
      "We are not a faceless outsourcing body shop, and we don’t pad meetings with layers of non-technical account managers. We are a tight collective of senior engineers, product designers, and growth directors.",
    guarantee: "100% Commercial IP Ownership, Zero Proprietary Lock-In, and 30-Day Post-Launch SLA Warranty.",
  },
  aboutPage: {
    badge: "WHO WE ARE",
    title: "Crafting High-Performance Products",
    titleAccent: "With Zero Bloat.",
    subtitle: "We partner with ambitious startups and established enterprises to engineer high-velocity digital solutions.",
    manifesto: "We believe true software craft requires direct collaboration between senior builders and founders. No unnecessary layers, no inflated retainers.",
  },
  pricingSection: {
    badge: "TRANSPARENT VALUE",
    title: "Simple, Predictable Engagement Models",
    titleAccent: "With Zero Hidden Fees.",
    subtitle: "Transparent milestone pricing with fixed deliverables and 100% IP ownership.",
  },
};

const STORAGE_KEY = "arshio_site_cms_settings_v3";

// In-memory cache + listeners for multi-component reactivity
let currentSettings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };
const listeners = new Set<(s: SiteSettings) => void>();

function initSettings() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      currentSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        hero: { ...DEFAULT_SITE_SETTINGS.hero, ...(parsed.hero || {}) },
        servicesSection: { ...DEFAULT_SITE_SETTINGS.servicesSection, ...(parsed.servicesSection || {}) },
        whyChooseUsSection: { ...DEFAULT_SITE_SETTINGS.whyChooseUsSection, ...(parsed.whyChooseUsSection || {}) },
        aboutPage: { ...DEFAULT_SITE_SETTINGS.aboutPage, ...(parsed.aboutPage || {}) },
        pricingSection: { ...DEFAULT_SITE_SETTINGS.pricingSection, ...(parsed.pricingSection || {}) },
        stats: { ...DEFAULT_SITE_SETTINGS.stats, ...(parsed.stats || {}) },
      };
    }
  } catch (e) {
    console.error("Failed to load settings from storage:", e);
  }
}

// Initial load
initSettings();

export function getSiteSettings(): SiteSettings {
  return currentSettings;
}

export function saveSiteSettings(newSettings: Partial<SiteSettings>): SiteSettings {
  currentSettings = {
    ...currentSettings,
    ...newSettings,
    hero: { ...currentSettings.hero, ...(newSettings.hero || {}) },
    servicesSection: { ...currentSettings.servicesSection, ...(newSettings.servicesSection || {}) },
    whyChooseUsSection: { ...currentSettings.whyChooseUsSection, ...(newSettings.whyChooseUsSection || {}) },
    aboutPage: { ...currentSettings.aboutPage, ...(newSettings.aboutPage || {}) },
    pricingSection: { ...currentSettings.pricingSection, ...(newSettings.pricingSection || {}) },
  };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
      window.dispatchEvent(new CustomEvent("arshio_settings_updated", { detail: currentSettings }));
    } catch (e) {
      console.error("Failed to save site settings:", e);
    }
  }
  listeners.forEach((fn) => fn(currentSettings));
  return currentSettings;
}

export function useSiteSettings(): [SiteSettings, (newSettings: Partial<SiteSettings>) => void] {
  const [settings, setSettings] = useState<SiteSettings>(currentSettings);

  useEffect(() => {
    initSettings();
    setSettings(currentSettings);

    const handler = (s: SiteSettings) => setSettings(s);
    listeners.add(handler);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          currentSettings = { ...DEFAULT_SITE_SETTINGS, ...parsed };
          setSettings(currentSettings);
        } catch {}
      }
    };

    const onCustom = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("arshio_settings_updated", onCustom);

    return () => {
      listeners.delete(handler);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("arshio_settings_updated", onCustom);
    };
  }, []);

  return [settings, saveSiteSettings];
}
