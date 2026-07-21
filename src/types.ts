export type PageType = 'home' | 'education' | 'experience' | 'research' | 'skills' | 'blog';

export interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  years: string;
  result: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  dateRange: string;
  highlights: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  sponsor?: string;
  description: string;
  image: string;
  year: string;
  type: 'ms' | 'bs';
  highlights: string[];
}

export interface PublicationItem {
  id: string;
  title: string;
  type: string;
  conference: string;
  location: string;
  year: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'telecom' | 'analysis' | 'software' | 'soft';
  rating: number; // 1-5 or 1-100
  details: string;
}

export interface CertificationItem {
  id: string;
  name: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'academic' | 'research' | 'awards' | 'portrait';
  description: string;
  image: string;
  date: string;
  location: string;
}
