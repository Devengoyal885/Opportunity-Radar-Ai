export type OpportunityCategory =
  | 'hackathon'
  | 'internship'
  | 'scholarship'
  | 'fellowship'
  | 'open-source'
  | 'startup'
  | 'competition'
  | 'grant';

export type EducationLevel =
  | 'high-school'
  | 'undergraduate'
  | 'graduate'
  | 'phd'
  | 'bootcamp'
  | 'self-taught'
  | 'professional';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  eligibility: string;
  deadline: string;
  category: OpportunityCategory;
  tags: string[];
  applicationLink: string;
  prize?: string;
  stipend?: string;
  location?: string;
  isRemote: boolean;
  matchScore?: number;
  matchReason?: string;
  isSaved?: boolean;
  isUrgent?: boolean;
  createdAt: string;
  logoUrl?: string;
}

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  skills: string[];
  interests: string[];
  educationLevel: EducationLevel;
  careerGoals: string;
  preferredCategories: OpportunityCategory[];
  location?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  relatedOpportunities?: Opportunity[];
}

export interface Notification {
  id: string;
  type: 'new-match' | 'deadline-7d' | 'deadline-3d' | 'deadline-1d' | 'daily-digest' | 'scrape-complete';
  title: string;
  message: string;
  opportunityId?: string;
  opportunityTitle?: string;
  read: boolean;
  createdAt: string;
}

export interface FilterState {
  categories: OpportunityCategory[];
  deadline: 'all' | 'this-week' | 'this-month' | 'next-3-months';
  isRemote: boolean | null;
  minMatchScore: number;
  search: string;
  sortBy: 'relevance' | 'deadline' | 'newest';
}

export interface DashboardStats {
  total: number;
  matching: number;
  closingThisWeek: number;
  saved: number;
}
