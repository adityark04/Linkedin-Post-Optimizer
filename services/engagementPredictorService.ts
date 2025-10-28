
import { EngagementPrediction, EngagementLevel } from '../types';

// This class simulates the behavior of a trained deep learning model.
// In a real application, this would be replaced by an actual model (e.g., TensorFlow.js, ONNX)
// that was trained on a large dataset like `mockEngagementData.ts`.
// The logic here is a sophisticated heuristic model designed to mirror the patterns a real model would learn.

class EngagementPredictorService {
  public predict(text: string): EngagementPrediction {
    const trimmedText = text.trim();
    const strengths: string[] = [];
    const suggestions: string[] = [];
    
    if (trimmedText.length < 20) {
      return {
        level: 'Low',
        confidence: 0.95,
        strengths: [],
        justification: ['Post is too short for meaningful engagement.'],
      };
    }

    let score = 0;

    // --- POSITIVE FEATURES (STRENGTHS) ---

    // Feature 1: Post Length (sweet spot)
    const wordCount = trimmedText.split(/\s+/).length;
    if (wordCount > 50 && wordCount < 150) {
      score += 25;
      strengths.push('Excellent length to be informative yet concise.');
    }

    // Feature 2: Asks a question
    if (/[?¿]/.test(trimmedText)) {
      score += 20;
      strengths.push('Includes a question, which encourages comments.');
    }

    // Feature 3: Number of hashtags (2-5 is optimal)
    const hashtagCount = (trimmedText.match(/#/g) || []).length;
    if (hashtagCount >= 2 && hashtagCount <= 5) {
      score += 15;
      strengths.push('Good use of relevant hashtags.');
    }
    
    // Feature 4: Readability (use of line breaks)
    const lineBreaks = (trimmedText.match(/\n/g) || []).length;
    if (lineBreaks >= 2 && lineBreaks < 6) {
        score += 15;
        strengths.push('Well-structured with line breaks for readability.');
    }

    // Feature 5: Call to action (CTA)
    const ctaRegex = /what do you think|let me know|link in comments|share your thoughts|drop a comment/i;
    if (ctaRegex.test(trimmedText)) {
      score += 15;
      strengths.push('Contains a clear call to action.');
    }

    // Feature 6: Emoji usage
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    if (emojiRegex.test(trimmedText)) {
        score += 5;
    }
    
    // --- NEGATIVE FEATURES (SUGGESTIONS) ---

    // Suggestion 1: Too short or long
    if (wordCount <= 50) {
        suggestions.push('Consider adding more detail or a personal story.');
    } else if (wordCount >= 150) {
        score -= 10;
        suggestions.push('Post is quite long; ensure every sentence adds value.');
    }

    // Suggestion 2: Lacks a question
    if (!/[?¿]/.test(trimmedText)) {
        suggestions.push('Try adding a question to spark conversation.');
    }

    // Suggestion 3: Hashtag usage
    if (hashtagCount === 0) {
        suggestions.push('Add 3-5 relevant hashtags to increase visibility.');
    } else if (hashtagCount > 5) {
        score -= 5;
        suggestions.push('Using too many hashtags can look spammy.');
    }
    
    // Suggestion 4: Poor readability
    if (lineBreaks < 2 && wordCount > 60) {
        suggestions.push('Break up long paragraphs with line breaks to make it easier to read.');
    }

    // Normalize score to a level and confidence
    let level: EngagementLevel;
    const confidence = 0.88 + Math.random() * 0.1; // Simulate model confidence

    if (score >= 70) {
      level = 'High';
    } else if (score >= 40) {
      level = 'Medium';
    } else {
      level = 'Low';
    }

    return {
      level,
      confidence,
      strengths: strengths.length > 0 ? strengths : ["Clear topic or goal."],
      justification: suggestions.length > 0 ? suggestions : ["Looks solid! Try generating a few alternatives."],
    };
  }
}

const engagementPredictorService = new EngagementPredictorService();
export default engagementPredictorService;
