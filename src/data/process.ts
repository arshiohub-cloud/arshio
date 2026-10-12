export type ProcessStep = {
  step: number;
  title: string;
  timeline: string;
  description: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Discovery & Strategy",
    timeline: "Week 1",
    description: "We audit your goals, competitors, and users to define a clear roadmap.",
  },
  {
    step: 2,
    title: "Design & Prototype",
    timeline: "Week 2–3",
    description: "Interactive Figma prototypes you can click through before any code is written.",
  },
  {
    step: 3,
    title: "Build & Iterate",
    timeline: "Week 3–6",
    description: "Agile sprints with weekly previews so you see progress in real time.",
  },
  {
    step: 4,
    title: "Launch & Scale",
    timeline: "Week 6–8",
    description: "Deployment, QA, and post-launch optimization to ensure lasting results.",
  },
];
