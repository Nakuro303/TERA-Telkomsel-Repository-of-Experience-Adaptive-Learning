export type TechCategory = 
  | '4G/5G Seluler' 
  | 'Fiber Optic (FTTH/FTTx)' 
  | 'Sistem Transmisi & Radio' 
  | 'Power & Cooling BTS' 
  | 'Core Network' 
  | 'K3 & SOP Lapangan';

export interface Comment {
  id: string;
  author: string;
  role: 'Junior Engineer' | 'Senior Engineer' | 'Spesialis Jaringan' | 'Team Lead';
  region: string;
  content: string;
  date: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: TechCategory;
  content: string;
  author: string;
  authorRole: 'Junior Engineer' | 'Senior Engineer' | 'Spesialis Jaringan' | 'Team Lead';
  authorRegion: string;
  date: string;
  upvotes: number;
  likedBy: string[]; // Track user upvotes
  isVerifiedBySenior: boolean;
  verifiedBy?: string;
  troubleshootingSteps: string[];
  imageUrl?: string;
  comments: Comment[];
}

export interface QAAnswer {
  id: string;
  author: string;
  role: 'Junior Engineer' | 'Senior Engineer' | 'Spesialis Jaringan' | 'Team Lead';
  region: string;
  content: string;
  isVerifiedAnswer: boolean;
  upvotes: number;
  likedBy: string[];
  date: string;
}

export interface QAThread {
  id: string;
  title: string;
  description: string;
  category: TechCategory;
  author: string;
  authorRegion: string;
  authorRole: 'Junior Engineer' | 'Senior Engineer' | 'Spesialis Jaringan' | 'Team Lead';
  date: string;
  isResolved: boolean;
  answers: QAAnswer[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizModule {
  id: string;
  title: string;
  description: string;
  category: TechCategory;
  difficulty: 'Muda (Junior)' | 'Madya (Intermediate)' | 'Utama (Senior)';
  estimatedMinutes: number;
  questions: QuizQuestion[];
  xpReward: number;
}

export interface TechnicianLeaderboard {
  id: string;
  name: string;
  region: string;
  role: string;
  points: number;
  sharesCount: number;
  answersCount: number;
  badges: string[];
}
