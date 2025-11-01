import { GoogleGenAI, Type } from "@google/genai";
// FIX: Import PostGoal and PostTone for the new suggestKeywordsForPost method.
import { PostGenerationParams, PostAnalysis, PostGoal, PostTone } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("Missing Gemini API Key");
}

class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async generatePostVariations(params: PostGenerationParams): Promise<string[]> {
    const { goal, details, tone, relevantPosts } = params;

    const ragGuidance = (relevantPosts && relevantPosts.length > 0)
      ? `CRITICAL INSTRUCTION: Mimic the style, tone, and structure of the following posts:\n\n---\n${relevantPosts.join('\n---\n')}\n---`
      : 'Generate the post in a popular, engaging LinkedIn style.';

    const prompt = `
      You are an expert LinkedIn content creator. Generate 3 variations of a LinkedIn post based on the user's request.

      **User Request:**
      - Goal: ${goal}
      - Desired Tone: ${tone}
      - Key Details: ${details}

      ${ragGuidance}
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              description: "An array containing 3 distinct LinkedIn post variations as strings.",
              items: {
                type: Type.STRING
              }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text);
    return json.variations || [];
  }
  
  async analyzePost(draft: string): Promise<PostAnalysis> {
    const prompt = `
      Analyze the provided LinkedIn post draft. Evaluate it based on engagement potential, clarity, and professionalism.
      
      Post Draft:
      ---
      ${draft}
      ---
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: 'A score from 1-10 on its overall quality and engagement potential.'
            },
            strengths: {
              type: Type.ARRAY,
              description: 'A list of 2-3 bullet points on what the post does well.',
              items: { type: Type.STRING }
            },
            improvements: {
              type: Type.ARRAY,
              description: 'A list of 2-3 bullet points with specific suggestions for improvement.',
              items: { type: Type.STRING }
            },
            revisedVersion: {
              type: Type.STRING,
              description: 'A rewritten, improved version of the post that incorporates the suggestions.'
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  }

  // FIX: Add suggestKeywordsForPost method to generate keywords using Gemini.
  async suggestKeywordsForPost(goal: PostGoal, tone: PostTone): Promise<string[]> {
    const prompt = `
      You are a LinkedIn content expert. 
      Suggest 5 to 7 relevant single-word or two-word keywords for a LinkedIn post.

      **Post Goal:** ${goal}
      **Desired Tone:** ${tone}

      Return ONLY a comma-separated list of the keywords, without any preamble or explanation.
      For example: Career Growth, Tech, Certification, Upskilling, Job Search
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text.trim();
    if (!text) {
        return [];
    }
    return text.split(',').map(kw => kw.trim()).filter(Boolean);
  }
}

const geminiService = new GeminiService();
export default geminiService;
