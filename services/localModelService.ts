import { pipeline, Pipeline, env } from '@xenova/transformers';

// Let the library know where to find the model files from CDN
env.allowLocalModels = false;

// Use a class to manage the embedding model and ensure it's only loaded once.
class LocalModelService {
  private embeddingPipeline: Pipeline | null = null;
  private status: 'unloaded' | 'loading' | 'ready' | 'error' = 'unloaded';

  // Initialize and load the models. This should be called once.
  async loadModels(progressCallback: (progress: any) => void) {
    if (this.status !== 'unloaded') return;
    
    this.status = 'loading';
    
    try {
      this.embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        progress_callback: progressCallback,
      });
      this.status = 'ready';
    } catch (error) {
      console.error("Error loading transformer embedding model:", error);
      this.status = 'error';
      throw new Error("Could not initialize local AI embedding model.");
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
}

// Export a singleton instance to be used across the application
const localModelService = new LocalModelService();
export default localModelService;
