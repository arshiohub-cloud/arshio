import { useState, useEffect } from "react";
import { PROJECTS as DEFAULT_PROJECTS, type ProjectItem, type ProjectCategory } from "@/data/projects";

const STORAGE_KEY = "arshio_portfolio_projects_crud_v1";

let currentProjects: ProjectItem[] = [...DEFAULT_PROJECTS];
const listeners = new Set<(projects: ProjectItem[]) => void>();

function initProjects() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        currentProjects = parsed;
        return;
      }
    }
    // If not stored yet, seed with DEFAULT_PROJECTS
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
  } catch (e) {
    console.error("Failed to load projects from storage:", e);
  }
}

// Initial load
initProjects();

export function getPortfolioProjects(): ProjectItem[] {
  return currentProjects;
}

export function savePortfolioProjects(projects: ProjectItem[]): ProjectItem[] {
  currentProjects = projects;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      window.dispatchEvent(new CustomEvent("arshio_projects_updated", { detail: projects }));
    } catch (e) {
      console.error("Failed to save projects to storage:", e);
    }
  }
  listeners.forEach((fn) => fn(currentProjects));
  return currentProjects;
}

export function createPortfolioProject(newProject: Omit<ProjectItem, "id"> & { id?: string }): ProjectItem {
  const project: ProjectItem = {
    ...newProject,
    id: newProject.id || `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };
  const updated = [project, ...currentProjects];
  savePortfolioProjects(updated);
  return project;
}

export function updatePortfolioProject(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
  const index = currentProjects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedItem = { ...currentProjects[index], ...updates };
  const updatedList = [...currentProjects];
  updatedList[index] = updatedItem;
  savePortfolioProjects(updatedList);
  return updatedItem;
}

export function deletePortfolioProject(id: string): boolean {
  const filtered = currentProjects.filter((p) => p.id !== id);
  if (filtered.length === currentProjects.length) return false;
  savePortfolioProjects(filtered);
  return true;
}

export function usePortfolioProjects(): [
  ProjectItem[],
  {
    createProject: typeof createPortfolioProject;
    updateProject: typeof updatePortfolioProject;
    deleteProject: typeof deletePortfolioProject;
    resetToDefaults: () => void;
  }
] {
  const [projects, setProjects] = useState<ProjectItem[]>(currentProjects);

  useEffect(() => {
    initProjects();
    setProjects(currentProjects);

    const handler = (p: ProjectItem[]) => setProjects(p);
    listeners.add(handler);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          currentProjects = parsed;
          setProjects(parsed);
        } catch {}
      }
    };

    const onCustom = (e: Event) => {
      const customEvent = e as CustomEvent<ProjectItem[]>;
      if (customEvent.detail) {
        setProjects(customEvent.detail);
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("arshio_projects_updated", onCustom);

    return () => {
      listeners.delete(handler);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("arshio_projects_updated", onCustom);
    };
  }, []);

  const resetToDefaults = () => {
    savePortfolioProjects([...DEFAULT_PROJECTS]);
  };

  return [
    projects,
    {
      createProject: createPortfolioProject,
      updateProject: updatePortfolioProject,
      deleteProject: deletePortfolioProject,
      resetToDefaults,
    },
  ];
}
