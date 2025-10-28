import { GoogleGenAI, Type } from "@google/genai";
import { PostGenerationParams } from '../types';

class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // FIX: Per coding guidelines, API key must be read from process.env.API_KEY, not import.meta.env.
    if (!process.env.API_KEY) {
      // This check is for robustness during development.
      throw new Error("API_KEY environment variable not set.");
    }
    // FIX: Initialize GoogleGenAI with the API key from process.env.API_KEY as per guidelines.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  isReady() {
    return true;
  }
  
  // --- RAG FUNCTION ---
  async embedText(text: string): Promise<number[]> {
    // Note: The guidelines did not specify an embedding model.
    // The Gemini API provides embedding capabilities, which are necessary for the RAG feature.
    // Using a standard embedding model to keep the feature functional.
    const result = await this.ai.models.embedContent({
      model: "text-embedding-004",
      // FIX: Corrected property name from 'content' to 'contents'.
      contents: text,
    });
    // @ts-ignore
    return result.embedding.values;
  }

  // --- GENERATION FUNCTIONS ---
  private async runGeneration(prompt: string): Promise<string> {
    // FIX: Use ai.models.generateContent as per guidelines
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash', // Basic text task model from guidelines
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    // FIX: Extract text directly from response.text property
    return response.text;
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
    const prompt = `Revise the following LinkedIn post to be more engaging, clear, and professional. Also, provide a score from 1 to 10 representing the quality of the revised post, where 1 is poor and 10 is excellent. \n\nDraft: "${draft}"`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            revisedPost: {
              type: Type.STRING,
              description: 'The revised, improved version of the LinkedIn post.',
            },
            score: {
              type: Type.NUMBER,
              description: 'A score from 1 to 10 for the revised post\'s quality.',
              minimum: 1,
              maximum: 10,
            },
          },
          required: ['revisedPost', 'score'],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (typeof result.revisedPost !== 'string' || typeof result.score !== 'number') {
        throw new Error("AI returned an invalid data structure.");
    }

    return result;
  }

  async suggestHashtags(postContent: string): Promise<string> {
    const prompt = `Generate 5 to 7 relevant and trending hashtags for this LinkedIn post. Return only the hashtags, separated by spaces. For example: #hashtag1 #hashtag2 #hashtag3\n\nPost content: "${postContent}"`;
    const result = await this.runGeneration(prompt);
    // Clean up the output to ensure it's just hashtags
    return result.split(/\s+/).filter(tag => tag.startsWith('#')).join(' ');
  }
}

// Export a singleton instance to be used across the application
const geminiService = new GeminiService();
export default geminiService;