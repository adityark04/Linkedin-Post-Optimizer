export type PostGoal = 'Share Achievement' | 'Share Article' | 'Ask Question' | 'Promote Event' | 'Job Search Update';

export type PostTone = 'Professional' | 'Inspirational' | 'Casual' | 'Technical' | 'Humorous';

export interface StyleLibraryItem {
  text: string;
  embedding: number[];
}

export interface PostGenerationParams {
  goal: PostGoal;
  details: string;
  tone: PostTone;
  relevantPosts?: string[];
}

export interface GeneratedPostData {
  title: string;
  content: string;
}

export interface PostAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  revisedVersion: string;
}
// FIX: Add missing EngagementLevel and EngagementPrediction types.
export type EngagementLevel = 'High' | 'Medium' | 'Low';

export interface EngagementPrediction {
  level: EngagementLevel;
  confidence: number;
  strengths: string[];
  justification: string[];
}
