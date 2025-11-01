
import { pipeline, Pipeline, env } from '@xenova/transformers';
import { PostGenerationParams, PostGoal, PostTone } from '../types';

// Let the library know where to find the model files from CDN
env.allowLocalModels = false;

// Use a class to manage the models and ensure they're only loaded once.
class LocalModelService {
  private generationPipeline: Pipeline | null = null;
  private embeddingPipeline: Pipeline | null = null;
  private status: 'unloaded' | 'loading' | 'ready' | 'error' = 'unloaded';

  // Initialize and load the models. This should be called once.
  async loadModels(progressCallback: (progress: any) => void) {
    if (this.status !== 'unloaded') return;
    
    this.status = 'loading';
    
    try {
      this.generationPipeline = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M', {
        progress_callback: progressCallback,
      });

      this.embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        progress_callback: progressCallback,
      });

      this.status = 'ready';
    } catch (error) {
      console.error("Error loading transformer models:", error);
      this.status = 'error';
      throw new Error("Could not initialize local AI models.");
    }
  }

  isReady() {
    return this.status === 'ready';
  }

  // --- RAG FUNCTION ---
  async embedText(text: string): Promise<number[]> {
    if (!this.isReady() || !this.embeddingPipeline) {
      throw new Error("Embedding model not ready.");
    }
    const result = await this.embeddingPipeline(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  }

  // --- GENERATION FUNCTIONS ---
  private async runGeneration(prompt: string): Promise<string> {
    if (!this.isReady() || !this.generationPipeline) {
      throw new Error("Generation model not ready.");
    }
    const result = await this.generationPipeline(prompt, {
      max_new_tokens: 256,
      temperature: 0.7,
      repetition_penalty: 1.1,
      no_repeat_ngram_size: 3,
      num_beams: 2,
    });
    // @ts-ignore
    return result[0].generated_text;
  }

  async generateLinkedInPost(params: PostGenerationParams): Promise<string> {
    const { goal, details, tone, relevantPosts } = params;

    const ragGuidance = (relevantPosts && relevantPosts.length > 0)
      ? `Use the following posts as a style guide:\n${relevantPosts.join('\n---\n')}`
      : '';

    const prompt = `
      Generate a LinkedIn post.
      Goal: ${goal}.
      Tone: ${tone}.
      Details: ${details}.
      ${ragGuidance}
    `;
    
    return this.runGeneration(prompt);
  }

  async reviseLinkedInPost(draft: string): Promise<{ revisedPost: string; score: number; }> {
    const prompt = `Revise the following LinkedIn post to be more engaging, clear, and professional. After the revised post, on a new line, add "Score: [1-10]" representing the quality of the revised post, where 1 is poor and 10 is excellent.\n\nDraft: "${draft}"`;
    const resultText = await this.runGeneration(prompt);
    
    const scoreMatch = resultText.match(/Score:\s*(\d+(\.\d+)?)/);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 5; // Default score if not found
    
    const revisedPost = resultText.replace(/Score:\s*(\d+(\.\d+)?)/, '').trim();

    return { revisedPost, score };
  }

  async suggestHashtags(postContent: string): Promise<string> {
    const prompt = `Generate 5 to 7 relevant and trending hashtags for this LinkedIn post. Return only the hashtags, separated by spaces. For example: #hashtag1 #hashtag2 #hashtag3\n\nPost content: "${postContent}"`;
    const result = await this.runGeneration(prompt);
    // Clean up the output to ensure it's just hashtags
    return result.split(/\s+/).filter(tag => tag.startsWith('#')).join(' ');
  }

  async suggestKeywordsForPost(goal: PostGoal, tone: PostTone): Promise<string[]> {
    const prompt = `You are an expert LinkedIn content strategist. For a LinkedIn post with the goal of "${goal}" and a "${tone}" tone, suggest 5 to 7 highly relevant keywords or short phrases (2-3 words max). Return ONLY a comma-separated list of these keywords.`;
    const result = await this.runGeneration(prompt);
    return result.split(',').map(kw => kw.trim().replace(/\.$/, '')).filter(Boolean);
  }
}

// Export a singleton instance to be used across the application
const localModelService = new LocalModelService();
export default localModelService;