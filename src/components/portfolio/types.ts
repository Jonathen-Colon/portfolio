export interface Project {
  id: string;
  title: string;
  year: string;
  kind: string;
  role: string;
  desc: string;
  tags: string[];
  accent: string;
  thumb: string;
  live?: string;
  repo?: string;
  itch?: string;
  media?: string;
  body: string[];
  shots?: string[];
}

export interface Post {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  read: string;
  tag: string;
  thumb: string;
  body: string[];
}

export interface NowItem {
  title: string;
  body: string;
  progress: number | null;
  color: string;
  icon: string;
}

export interface ResumeRow {
  title: string;
  org: string;
  year: string;
  tag?: string;
}

export interface Resume {
  work: ResumeRow[];
  speaking: ResumeRow[];
  education: ResumeRow[];
  skills: string[];
}

export type PageId =
  | 'home'
  | 'web'
  | 'games'
  | 'blog'
  | 'about'
  | 'now'
  | 'resume'
  | 'contact';

export interface PortfolioData {
  webProjects: Project[];
  gameProjects: Project[];
  posts: Post[];
  nowItems: NowItem[];
  resume: Resume | null;
}
