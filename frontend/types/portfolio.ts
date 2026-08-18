export type ProjectCategory =
  | "ai-engineering"
  | "backend-systems"
  | "cloud-native"
  | "automation";

export type ProjectStatus = "In Production" | "Completed" | "Active Development" | "Planned";

export interface ProjectArchitectureStep {
  title: string;
  description: string;
}

export interface TechStackItem {
  name: string;
  purpose: string;
  icon?: string | null;
}

export interface TechStackGrouped {
  frontend?: TechStackItem[];
  backend?: TechStackItem[];
  database?: TechStackItem[];
  infrastructure?: TechStackItem[];
  ai?: TechStackItem[];
  deployment?: TechStackItem[];
}

export interface ProjectKeyFeature {
  title: string;
  description: string;
  status?: "Completed" | "Planned" | "In Progress";
}

export interface ProjectEngineeringDecision {
  title: string;
  context: string;
  decision: string;
  outcome: string;
}

export interface ProjectChallenge {
  title: string;
  challenge: string;
  solution: string;
  impact: string;
}

export interface SecurityReliabilityItem {
  title: string;
  description: string;
  iconName?: string | null;
}

export interface ProjectNavigation {
  previous?: Project | null;
  next?: Project | null;
  related?: Project[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  category: ProjectCategory;
  categoryLabel: string;
  technologies: string[];
  featured: boolean;
  role: string;
  timeline: string;
  status: ProjectStatus;
  impactMetrics?: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  overview: string;
  problem: string;
  solution: string;
  architectureDiagram?: string | null;
  architectureMermaid?: string | null;
  architectureSteps?: ProjectArchitectureStep[];
  techStackGrouped?: TechStackGrouped;
  keyFeatures: ProjectKeyFeature[];
  engineeringDecisions: ProjectEngineeringDecision[];
  challenges?: ProjectChallenge[];
  securityReliability?: SecurityReliabilityItem[];
  results: string[];
  lessonsLearned: string[];
  navigation?: ProjectNavigation | null;
}

export interface ExperienceItem {
  slug: string;
  role: string;
  company: string;
  location: string;
  period: string;
  isCurrent?: boolean;
  summary: string;
  highlights: string[];
  technologies: string[];
  category: "infrastructure" | "backend" | "cloud" | "ai";
}

export interface SkillItem {
  name: string;
  level: "Expert" | "Advanced" | "Proficient";
  isCore?: boolean;
}

export interface SkillCategory {
  slug: string;
  title: string;
  description: string;
  iconName: string;
  skills: SkillItem[];
}

export interface ServiceItem {
  slug: string;
  title: string;
  category: "ai-applications" | "ai-automation" | "backend-systems" | "cloud-native";
  description: string;
  deliverables: string[];
  technologies: string[];
  iconName: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
  content: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  message: string;
}
