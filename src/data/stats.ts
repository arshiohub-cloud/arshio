export type StatItem = {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
};

export const STATS: StatItem[] = [
  { label: "Projects Delivered", value: 50, suffix: "+", prefix: "" },
  { label: "Client Rating", value: 4.9, suffix: "/5", prefix: "" },
  { label: "Avg. Response", value: 24, suffix: "h", prefix: "<" },
  { label: "Countries Served", value: 12, suffix: "+", prefix: "" },
];
