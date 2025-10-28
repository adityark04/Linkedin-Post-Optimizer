import { PostGenerationParams } from '../types';

// Let the library know where to find the model files
// @ts-ignore
window.env.allowLocalModels = false;

// Use a class to manage the models and ensure they're only loaded once.
class LocalModelService {
  private generationPipeline: any = null;
  private embeddingPipeline: any = null;
  private status: 'unloaded' | 'loading' | 'ready' = 'unloaded';

  private progressCallback: ((progress: any) => void) | null = null;

  constructor(progressCallback: (progress: any) => void) {
    this.progressCallback = progressCallback;
  }

  // Initialize and load the models. This should be called once.
  async loadModels() {
    if (this.status !== 'unloaded') return;
    this.status = 'loading';
    
    try {
      // FIX: Suppress TypeScript error as `pipeline` is loaded dynamically on the window object.
      // @ts-ignore
      this.generationPipeline = await window.pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M', {
        progress_callback: this.progressCallback,
      });

      // FIX: Suppress TypeScript error as `pipeline` is loaded dynamically on the window object.
      // @ts-ignore
      this.embeddingPipeline = await window.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        progress_callback: this.progressCallback,
      });

      this.status = 'ready';
    } catch (error) {
      console.error("Error loading models:", error);
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
    // The output needs to be converted to a standard array.
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

  async reviseLinkedInPost(draft: string): Promise<string> {
    const prompt = `Revise the following LinkedIn post to be more engaging, clear, and professional:\n\n${draft}`;
    return this.runGeneration(prompt);
  }

  async suggestHashtags(postContent: string): Promise<string> {
    const prompt = `Generate 5 to 7 relevant and trending hashtags for this LinkedIn post:\n\n${postContent}`;
    const result = await this.runGeneration(prompt);
    // Clean up the output which might not be a perfect list
    return result.split(/\s+/).filter(tag => tag.startsWith('#')).join(' ');
  }
}

export default LocalModelService;
