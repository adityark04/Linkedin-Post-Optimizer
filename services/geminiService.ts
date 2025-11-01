import { GoogleGenAI, Type } from "@google/genai";
import { PostGenerationParams, PostGoal, PostTone, PostAnalysis } from '../types';

class GeminiService {
  private ai: GoogleGenAI;
  // Use a dedicated embedding model for higher quality and efficiency.
  private embeddingModel = 'text-embedding-004'; 
  private flashModel = 'gemini-2.5-flash';
  private proModel = 'gemini-2.5-pro';

  constructor() {
    if (!process.env.API_KEY) {
      // This error is a safeguard; the API key is expected to be present.
      throw new Error("API_KEY environment variable not set");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async embedText(text: string): Promise<number[]> {
    const response = await this.ai.models.embedContent({
      model: this.embeddingModel,
      content: { parts: [{ text }] },
    });
    return response.embedding.values;
  }

  async generateLinkedInPost(params: PostGenerationParams): Promise<string> {
    const { goal, details, tone, relevantPosts } = params;

    const ragGuidance = (relevantPosts && relevantPosts.length > 0)
      ? `CRITICALLY IMPORTANT: Your primary goal is to write a new post that closely mimics the style, voice, and format of the following examples. Analyze their structure, tone, and vocabulary.\n\nEXAMPLES:\n---\n${relevantPosts.join('\n---\n')}\n---`
      : 'Write a high-quality, engaging LinkedIn post.';

    const prompt = `
      As a world-class LinkedIn content strategist, generate a LinkedIn post based on the following requirements.
      
      ${ragGuidance}
      
      POST REQUIREMENTS:
      - Goal: ${goal}
      - Tone: ${tone}
      - Key Details to Include: ${details}

      Return ONLY the generated post content, with no preamble or extra text.
    `;
    
    const response = await this.ai.models.generateContent({
        model: this.proModel, // Use Pro model for higher quality RAG generation
        contents: prompt,
    });
    return response.text;
  }
  
  async reviseLinkedInPost(draft: string): Promise<PostAnalysis> {
    const prompt = `You are an expert LinkedIn post analyzer. Analyze the following draft and provide a revised, more engaging version.
    
    Draft:
    "${draft}"

    Your response must be a JSON object that strictly follows this schema.`;
    
    const response = await this.ai.models.generateContent({
      model: this.proModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Engagement score from 1 to 10 for the revised post." },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Positive aspects of the original post." },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggestions for improvement implemented in the revised version." },
            revisedPost: { type: Type.STRING, description: "The revised and improved post content." }
          },
          required: ["score", "strengths", "improvements", "revisedPost"],
        }
      }
    });

    const jsonString = response.text;
    return JSON.parse(jsonString) as PostAnalysis;
  }

  async suggestHashtags(postContent: string): Promise<string> {
    const prompt = `Generate 5 to 7 relevant and trending hashtags for this LinkedIn post. Return only the hashtags, separated by spaces. For example: #hashtag1 #hashtag2 #hashtag3\n\nPost content: "${postContent}"`;
    const response = await this.ai.models.generateContent({
        model: this.flashModel,
        contents: prompt,
    });
    return response.text.split(/\s+/).filter(tag => tag.startsWith('#')).join(' ');
  }

  async suggestKeywordsForPost(goal: PostGoal, tone: PostTone): Promise<string[]> {
    const prompt = `You are an expert LinkedIn content strategist. For a LinkedIn post with the goal of "${goal}" and a "${tone}" tone, suggest 5 to 7 highly relevant keywords or short phrases (2-3 words max). Return ONLY a comma-separated list of these keywords.`;
    const response = await this.ai.models.generateContent({
        model: this.flashModel,
        contents: prompt,
    });
    return response.text.split(',').map(kw => kw.trim().replace(/\.$/, '')).filter(Boolean);
  }
}

const geminiService = new GeminiService();
export default geminiService;
