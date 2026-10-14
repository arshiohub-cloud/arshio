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
};

const STORAGE_KEY = "arshio_site_cms_settings_v1";

// In-memory cache + listeners for multi-component reactivity
let currentSettings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };
const listeners = new Set<(s: SiteSettings) => void>();

function initSettings() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      currentSettings = { ...DEFAULT_SITE_SETTINGS, ...parsed };
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
  currentSettings = { ...currentSettings, ...newSettings };
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
        } catch {
          // ignore
        }
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
