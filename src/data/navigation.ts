export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/company/arshio", icon: "linkedin" },
  { label: "Instagram", href: "https://instagram.com/arshio.agency", icon: "instagram" },
  { label: "Behance", href: "https://behance.net/arshio", icon: "globe" },
  { label: "Dribbble", href: "https://dribbble.com/arshio", icon: "globe" },
  { label: "YouTube", href: "https://youtube.com/@arshio", icon: "youtube" },
];
