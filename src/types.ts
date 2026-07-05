export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  technologies: string[];
  features: string[];
  challenges: string;
  liveUrl: string;
  codeUrl: string;
  featured: boolean;
  createdAt?: number;
}

export type SkillCategory = 
  | 'languages' 
  | 'frontend' 
  | 'backend' 
  | 'databases' 
  | 'ai' 
  | 'cloud' 
  | 'cybersecurity' 
  | 'tools';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 0 to 100
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: number;
}

export interface PortfolioSettings {
  name: string;
  title: string;
  bio: string;
  intro: string;
  specialties: string[];
  country: string;
  location: string;
  phone: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  resumeUrl: string;
  yearsOfExperience: number;
  completedProjects: number;
  masteredTechs: number;
  careerGoals: string;
}
