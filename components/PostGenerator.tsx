import React, { useState, useCallback } from 'react';
import { PostGenerationParams, PostGoal, PostTone, StyleLibraryItem } from '../types';
import { GOALS, TONES } from '../constants';
// FIX: Replace local model service with the new Gemini service
import geminiService from '../services/geminiService';
import GeneratedPost from './GeneratedPost';
import Loader from './Loader';
import PostAnalyzer from './PostAnalyzer';
import StyleLibraryManager from './StyleLibraryManager';
import useLocalStorage from '../hooks/useLocalStorage';
import { SparklesIcon } from './icons/SparklesIcon';
import RealtimeAnalysis from './RealtimeAnalysis';

const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normB += vecB[i] * vecB[i];
    normA += vecA[i] * vecA[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) {
    return 0;
  }
  return dotProduct / denominator;
};


const PostGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'revise'>('generate');

  // FIX: Removed state related to local model loading, as it's no longer needed with Gemini API
  // const [modelStatus, setModelStatus] = useState({ loaded: false, progress: 0, file: '' });
  // const modelService = useRef<LocalModelService | null>(null);

  // Generator State
  const [goal, setGoal] = useState<PostGoal>(GOALS[0]);
  const [tone, setTone] = useState<PostTone>(TONES[0]);
  const [details, setDetails] = useState('');
  const [isSuggestingHashtags, setIsSuggestingHashtags] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<string[]>([]);
  
  const [styleLibrary, setStyleLibrary] = useLocalStorage<StyleLibraryItem[]>('styleLibrary', []);

  // Shared State
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FIX: Removed useEffect for loading local models. The Gemini service is ready on import.

  const isGenFormValid = details.trim().length > 10;

  const handleSuggestHashtags = async () => {
      // FIX: Simplified check and call to new geminiService
      if (details.trim().length < 10) {
          setError("Please provide more details before suggesting hashtags.");
          return;
      }
      setIsSuggestingHashtags(true);
      setError(null);
      try {
          const hashtags = await geminiService.suggestHashtags(details);
          setDetails(prev => `${prev}\n\n${hashtags}`);
      } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not suggest hashtags.');
      } finally {
          setIsSuggestingHashtags(false);
      }
  }

  const handleGenerateSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Simplified check
    if (!isGenFormValid) return;

    setIsProcessing(true);
    setError(null);

    try {
      let relevantPosts: string[] = [];
      if (styleLibrary.length > 0) {
        const query = `Goal: ${goal}, Details: ${details}`;
        // FIX: Use geminiService for embeddings
        const queryEmbedding = await geminiService.embedText(query);
        const rankedPosts = styleLibrary
          .map(item => ({
            ...item,
            similarity: cosineSimilarity(queryEmbedding, item.embedding),
          }))
          .sort((a, b) => b.similarity - a.similarity);
        relevantPosts = rankedPosts.slice(0, 3).map(item => item.text);
      }
      
      const params: PostGenerationParams = { goal, tone, details, relevantPosts };
      // FIX: Use geminiService for post generation
      const post = await geminiService.generateLinkedInPost(params);
      setGeneratedPosts(prev => [post, ...prev]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsProcessing(false);
    }
  }, [goal, tone, details, styleLibrary, isGenFormValid]);
  
  const handleTabChange = (tab: 'generate' | 'revise') => {
    setActiveTab(tab);
    setError(null);
  }

  const addPostToLibrary = useCallback(async (post: string) => {
    // FIX: Simplified logic to use geminiService for embeddings
    setError(null);
    try {
      const newEmbedding = await geminiService.embedText(post);
      const newItem: StyleLibraryItem = { text: post, embedding: newEmbedding };
      setStyleLibrary(prevLibrary => [...prevLibrary, newItem]);
    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'Failed to add post to library.';
       setError(errorMessage);
       throw new Error(errorMessage);
    }
  }, [setStyleLibrary]);

  const removePostFromLibrary = (indexToRemove: number) => {
    setStyleLibrary(prevLibrary => prevLibrary.filter((_, index) => index !== indexToRemove));
  };
  
  // FIX: Removed the loading UI for local models.
  
  const renderGeneratorForm = () => (
    <form onSubmit={handleGenerateSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
            What is your post's goal?
          </label>
          <select id="goal" name="goal" value={goal} onChange={(e) => setGoal(e.target.value as PostGoal)} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
            What tone should it have?
          </label>
          <select id="tone" name="tone" value={tone} onChange={(e) => setTone(e.target.value as PostTone)} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">
              Provide key details or a rough draft
            </label>
            <button
                type="button"
                onClick={handleSuggestHashtags}
                disabled={isSuggestingHashtags || details.trim().length < 10}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
                <SparklesIcon className={`h-4 w-4 mr-1.5 ${isSuggestingHashtags ? 'animate-pulse' : ''}`}/>
                {isSuggestingHashtags ? 'Suggesting...' : 'Suggest Hashtags'}
            </button>
        </div>
        <textarea id="details" name="details" rows={5} value={details} onChange={(e) => setDetails(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., Excited to share I've completed my Google Cloud Professional Data Engineer certification! It was a challenging journey..."></textarea>
        <p className="text-xs text-gray-500 mt-1">Minimum 10 characters.</p>
      </div>
      
      <RealtimeAnalysis text={details} />

      <div className="my-6">
        <StyleLibraryManager
          library={styleLibrary}
          onAddPost={addPostToLibrary}
          onRemovePost={removePostFromLibrary}
        />
      </div>
      
      <div className="flex justify-end mt-6">
        <button type="submit" disabled={!isGenFormValid || isProcessing} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300">
          {isProcessing ? 'Generating...' : 'Generate Post'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                    onClick={() => handleTabChange('generate')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'generate'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Generate Post
                </button>
                <button
                    onClick={() => handleTabChange('revise')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'revise'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Revise Post
                </button>
            </nav>
        </div>
        {/* FIX: Removed modelService prop from PostAnalyzer */}
        {activeTab === 'generate' ? renderGeneratorForm() : <PostAnalyzer />}
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {isProcessing && activeTab === 'generate' && (
        <div className="mt-8 flex justify-center">
          <Loader />
        </div>
      )}

      {generatedPosts.length > 0 && !isProcessing && activeTab === 'generate' && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Your AI-Generated Posts</h2>
          <div className="space-y-6">
            {generatedPosts.map((post, index) => (
              <GeneratedPost key={index} post={{ title: `Generated Post #${generatedPosts.length - index}`, content: post }} />
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default PostGenerator;
