// Fix: Use named imports for tfjs types and functions to resolve namespace errors.
import '@tensorflow/tfjs';
import { loadLayersModel, tensor2d, dispose, LayersModel, Tensor } from '@tensorflow/tfjs';
import { EngagementPrediction, EngagementLevel } from '../types';

// This class loads and runs a trained TensorFlow.js model for engagement prediction.
class EngagementPredictorService {
  // Fix: Use imported 'LayersModel' type instead of tf.LayersModel.
  private model: LayersModel | null = null;
  private tokenizer: any | null = null;
  private wordIndex: { [key: string]: number } | null = null;
  private status: 'unloaded' | 'loading' | 'ready' | 'error' = 'unloaded';
  private readonly MAX_LEN = 150;
  // Based on alphabetical sorting of classes during training: ['High', 'Low', 'Medium']
  private readonly labels: EngagementLevel[] = ['High', 'Low', 'Medium'];

  async loadModel() {
    if (this.status !== 'unloaded') return;
    this.status = 'loading';
    try {
      const [model, tokenizerResponse] = await Promise.all([
        // Fix: Use imported 'loadLayersModel' function instead of tf.loadLayersModel.
        loadLayersModel('/engagement_model/model.json'),
        fetch('/engagement_model/tokenizer.json')
      ]);

      if (!tokenizerResponse.ok) {
        throw new Error(`Failed to fetch tokenizer: ${tokenizerResponse.statusText}`);
      }

      this.model = model;
      this.tokenizer = await tokenizerResponse.json();

      // The tokenizer config from Keras contains the word -> index mapping as a JSON string.
      if (typeof this.tokenizer.config.word_index === 'string') {
        this.wordIndex = JSON.parse(this.tokenizer.config.word_index);
      } else {
        this.wordIndex = this.tokenizer.config.word_index;
      }
      
      this.status = 'ready';
    } catch (error) {
      console.error("Failed to load engagement model:", error);
      this.status = 'error';
    }
  }

  isReady() {
    return this.status === 'ready';
  }

  // Fix: Use imported 'Tensor' type instead of tf.Tensor.
  private preprocessText(text: string): Tensor {
    if (!this.tokenizer || !this.wordIndex) {
      throw new Error("Tokenizer not loaded.");
    }
    
    // Simple text-to-sequence based on the loaded tokenizer vocab
    const sequences = text
        .toLowerCase()
        .replace(/[!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n]/g, '')
        .split(' ')
        .map(word => this.wordIndex![word] || 1) // 1 is <unk> token
        .filter(id => id < this.tokenizer.config.num_words);

    // Padding/Truncating to MAX_LEN
    const paddedSequence = Array(this.MAX_LEN).fill(0);
    const startIndex = Math.max(0, this.MAX_LEN - sequences.length);
    for (let i = 0; i < sequences.length && i < this.MAX_LEN; ++i) {
        paddedSequence[startIndex + i] = sequences[i];
    }
    
    // Fix: Use imported 'tensor2d' function instead of tf.tensor2d.
    return tensor2d([paddedSequence], [1, this.MAX_LEN], 'int32');
  }

  public async predict(text: string): Promise<EngagementPrediction> {
    if (!this.isReady() || !this.model) {
      // Fallback to heuristic if model isn't ready or failed to load
      return this.predictHeuristically(text);
    }

    try {
        const preprocessed = this.preprocessText(text);
        // Fix: Use imported 'Tensor' type for casting.
        const predictionTensor = this.model.predict(preprocessed) as Tensor;
        const probabilities = await predictionTensor.data() as Float32Array;
        // Fix: Use imported 'dispose' function instead of tf.dispose.
        dispose([preprocessed, predictionTensor]);

        let maxProb = 0;
        let predictedIndex = 0;
        probabilities.forEach((prob, i) => {
            if (prob > maxProb) {
            maxProb = prob;
            predictedIndex = i;
            }
        });
        
        const level = this.labels[predictedIndex];
        const confidence = maxProb;
        
        // Use heuristic for justification text as the model only gives a class prediction
        const heuristic = this.predictHeuristically(text);

        return {
            level,
            confidence,
            strengths: heuristic.strengths,
            justification: heuristic.justification,
        };

    } catch (error) {
        console.error("Model prediction failed:", error);
        // Fallback to heuristic on prediction error
        return this.predictHeuristically(text);
    }
  }

  // Fallback heuristic model (original logic from simulation)
  public predictHeuristically(text: string): EngagementPrediction {
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

    const wordCount = trimmedText.split(/\s+/).length;
    if (wordCount > 50 && wordCount < 150) {
      score += 25;
      strengths.push('Excellent length to be informative yet concise.');
    }

    if (/[?¿]/.test(trimmedText)) {
      score += 20;
      strengths.push('Includes a question, which encourages comments.');
    }

    const hashtagCount = (trimmedText.match(/#/g) || []).length;
    if (hashtagCount >= 2 && hashtagCount <= 5) {
      score += 15;
      strengths.push('Good use of relevant hashtags.');
    }
    
    const lineBreaks = (trimmedText.match(/\n/g) || []).length;
    if (lineBreaks >= 2 && lineBreaks < 6) {
        score += 15;
        strengths.push('Well-structured with line breaks for readability.');
    }

    const ctaRegex = /what do you think|let me know|link in comments|share your thoughts|drop a comment/i;
    if (ctaRegex.test(trimmedText)) {
      score += 15;
      strengths.push('Contains a clear call to action.');
    }
    
    if (wordCount <= 50) {
        suggestions.push('Consider adding more detail or a personal story.');
    } else if (wordCount >= 150) {
        score -= 10;
        suggestions.push('Post is quite long; ensure every sentence adds value.');
    }

    if (!/[?¿]/.test(trimmedText)) {
        suggestions.push('Try adding a question to spark conversation.');
    }

    if (hashtagCount === 0) {
        suggestions.push('Add 3-5 relevant hashtags to increase visibility.');
    } else if (hashtagCount > 5) {
        score -= 5;
        suggestions.push('Using too many hashtags can look spammy.');
    }
    
    if (lineBreaks < 2 && wordCount > 60) {
        suggestions.push('Break up long paragraphs with line breaks to make it easier to read.');
    }

    let level: EngagementLevel;
    const confidence = 0.88 + Math.random() * 0.1;

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
      justification: suggestions.length > 0 ? suggestions : ["Looks solid! Consider generating alternatives."],
    };
  }
}

const engagementPredictorService = new EngagementPredictorService();
export default engagementPredictorService;