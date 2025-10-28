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

// FIX: Add GeneratedPostData type export
export interface GeneratedPostData {
  title: string;
  content: string;
}

export interface RevisedPostData {
  content: string;
  score: number;
}

// Types for the custom engagement prediction model
export type EngagementLevel = 'Low' | 'Medium' | 'High';

export interface EngagementPrediction {
  level: EngagementLevel;
  confidence: number;
  // FIX: Add missing 'strengths' property to align with what engagementPredictorService provides.
  strengths: string[];
  justification: string[];
}
