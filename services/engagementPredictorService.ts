
import { EngagementPrediction, EngagementLevel } from '../types';

// This class simulates the behavior of a trained deep learning model.
// In a real application, this would be replaced by an actual model (e.g., TensorFlow.js, ONNX)
// that was trained on a large dataset like `mockEngagementData.ts`.
// The logic here is a simplified version of the patterns such a model would learn.

class EngagementPredictorService {
  public predict(text: string): EngagementPrediction {
    const trimmedText = text.trim();
    if (trimmedText.length < 15) {
      return {
        level: 'Low',
        confidence: 0.95,
        justification: ['Post is too short.'],
      };
    }

    let score = 0;
    const justification: string[] = [];

    // Feature 1: Post Length (ideal length is between 80 and 200 characters)
    if (trimmedText.length > 80 && trimmedText.length < 250) {
      score += 30;
      justification.push('Good length.');
    } else if (trimmedText.length > 250) {
      score += 10;
      justification.push('Could be more concise.');
    } else {
        justification.push('Could be more detailed.');
    }

    // Feature 2: Asks a question
    if (trimmedText.includes('?')) {
      score += 25;
      justification.push('Includes a question to drive comments.');
    }

    // Feature 3: Number of hashtags (2-4 is optimal)
    const hashtagCount = (trimmedText.match(/#/g) || []).length;
    if (hashtagCount >= 2 && hashtagCount <= 5) {
      score += 20;
      justification.push('Effective use of hashtags.');
    } else if (hashtagCount > 5) {
        justification.push('Too many hashtags can look spammy.');
    } else {
      justification.push('Consider adding relevant hashtags.');
    }

    // Feature 4: Call to action (CTA)
    const ctaRegex = /what do you think|let me know|link in comments|learn more|in the comments/i;
    if (ctaRegex.test(trimmedText)) {
      score += 15;
      justification.push('Strong call to action.');
    }
    
    // Feature 5: Use of "power words"
    const powerWordsRegex = /excited|thrilled|proud|announcing|new|discover|learn/i;
    if (powerWordsRegex.test(trimmedText)) {
        score += 10;
    }

    // Normalize score to a level and confidence
    let level: EngagementLevel;
    const confidence = 0.85 + Math.random() * 0.1; // Simulate model confidence

    if (score > 70) {
      level = 'High';
    } else if (score > 40) {
      level = 'Medium';
    } else {
      level = 'Low';
    }

    return {
      level,
      confidence,
      justification,
    };
  }
}

const engagementPredictorService = new EngagementPredictorService();
export default engagementPredictorService;
