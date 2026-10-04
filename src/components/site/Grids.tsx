import { IconGrid } from "./IconGrid";

const icon = (slug: string) => `https://img.icons8.com/color/96/${slug}.png`;

export function InnovationTech() {
  return (
    <IconGrid
      id="ai-services"
      title="AI Services"
      items={[
        { image: icon("shield"), label: "Cyber Security" },
        { image: icon("physics"), label: "Data Science" },
        { image: icon("data-configuration"), label: "Data Mining" },
        { image: icon("face-id"), label: "DeepFake" },
        { image: icon("cloud"), label: "Cloud Computing" },
        { image: icon("api-settings"), label: "API Integration" },
        { image: icon("chatbot"), label: "Prompt Engineering" },
        { image: icon("infinity"), label: "DevOps" },
        { image: icon("design"), label: "UI/UX Design" },
      ]}
    />
  );
}

export function ResearchDev() {
  return (
    <IconGrid
      bg="#080808"
      id="research"
      title="Research & Development"
      items={[
        { image: icon("artificial-intelligence"), label: "Artificial Intelligence" },
        { image: icon("electric-car"), label: "Autonomous Vehicles" },
        { image: icon("speech-bubble-with-dots"), label: "Natural Language Processing" },
        { image: icon("electronics"), label: "Quantum Computing" },
        { image: icon("blockchain-technology"), label: "Blockchain" },
        { image: icon("virtual-reality"), label: "AR/VR/MR" },
      ]}
    />
  );
}

export function TrainingOpportunities() {
  return (
    <IconGrid
      id="automation"
      title="AI Automation Opportunities"
      items={[
        { image: icon("chatbot"), label: "Customer Support Agents" },
        { image: icon("artificial-intelligence"), label: "LLM Copilots" },
        { image: icon("data-configuration"), label: "Data-to-Insight Pipelines" },
        { image: icon("cloud"), label: "Private AI Cloud" },
        { image: icon("workflow"), label: "Workflow Orchestration" },
        { image: icon("automation"), label: "Back-Office Automation" },
        { image: icon("combo-chart"), label: "Predictive Analytics" },
        { image: icon("face-id"), label: "Computer Vision" },
        { image: icon("shield"), label: "AI Governance" },
      ]}
      footer={<a href="#contact" className="btn-secondary">Plan an AI Build →</a>}
    />
  );
}
