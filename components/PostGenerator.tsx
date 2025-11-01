import React, { useState, useCallback } from 'react';
import { PostGoal, PostTone, StyleLibraryItem } from '../types';
import { GOALS, TONES } from '../constants';
import localModelService from '../services/localModelService';
import geminiService from '../services/geminiService';
import GeneratedPost from './GeneratedPost';
import Loader from './Loader';
import PostAnalyzer from './PostAnalyzer';
import StyleLibraryManager from './StyleLibraryManager';
import useLocalStorage from '../hooks/useLocalStorage';
import { SparklesIcon } from './icons/SparklesIcon';
import { maximalMarginalRelevanceSearch } from '../utils/vectorSearch';

interface PostGeneratorProps {
  isModelReady: boolean; // This now means the embedding model is ready
}

const PostGenerator: React.FC<PostGeneratorProps> = ({ isModelReady }) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'analyze'>('generate');

  // Generator State
  const [goal, setGoal] = useState<PostGoal>(GOALS[0]);
  const [tone, setTone] = useState<PostTone>(TONES[0]);
  const [details, setDetails] = useState('');
  const [generatedPosts, setGeneratedPosts] = useState<string[]>([]);
  
  const [styleLibrary, setStyleLibrary] = useLocalStorage<StyleLibraryItem[]>('styleLibrary', []);

  // Shared State
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGenFormValid = details.trim().length > 10;

  const handleGenerateSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGenFormValid) return;

    setIsProcessing(true);
    setError(null);
    setGeneratedPosts([]);

    try {
      let relevantPosts: string[] = [];
      if (styleLibrary.length > 0 && isModelReady) {
        const query = `Goal: ${goal}, Tone: ${tone}, Details: ${details}`;
        const queryEmbedding = await localModelService.embedText(query);
        
        const selectedPosts = maximalMarginalRelevanceSearch(queryEmbedding, styleLibrary, 0.7, 3);
        relevantPosts = selectedPosts.map(item => item.text);
      }
      
      const variations = await geminiService.generatePostVariations({ goal, tone, details, relevantPosts });
      setGeneratedPosts(variations);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating posts.');
    } finally {
      setIsProcessing(false);
    }
  }, [goal, tone, details, styleLibrary, isGenFormValid, isModelReady]);
  
  const handleTabChange = (tab: 'generate' | 'analyze') => {
    setActiveTab(tab);
    setError(null);
  }

  const addPostToLibrary = useCallback(async (post: string) => {
    if (!isModelReady) {
      setError("The embedding model is not ready yet. Please wait.");
      throw new Error("Models not ready.");
    }
    setError(null);
    try {
      const newEmbedding = await localModelService.embedText(post);
      const newItem: StyleLibraryItem = { text: post, embedding: newEmbedding };
      setStyleLibrary(prevLibrary => [...prevLibrary, newItem]);
    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'Failed to add post to library.';
       setError(errorMessage);
       throw new Error(errorMessage);
    }
  }, [setStyleLibrary, isModelReady]);

  const removePostFromLibrary = (indexToRemove: number) => {
    setStyleLibrary(prevLibrary => prevLibrary.filter((_, index) => index !== indexToRemove));
  };

  const renderGeneratorForm = () => (
    <form onSubmit={handleGenerateSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-slate-700 mb-2">
            What is your post's goal?
          </label>
          <select id="goal" name="goal" value={goal} onChange={(e) => setGoal(e.target.value as PostGoal)} className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
            {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-slate-700 mb-2">
            What tone should it have?
          </label>
          <select id="tone" name="tone" value={tone} onChange={(e) => setTone(e.target.value as PostTone)} className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="details" className="block text-sm font-medium text-slate-700 mb-2">
          Provide key details or a rough draft
        </label>
        <textarea id="details" name="details" rows={5} value={details} onChange={(e) => setDetails(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" placeholder="e.g., Excited to share I've completed my Google Cloud Professional Data Engineer certification! It was a challenging journey..."></textarea>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-slate-500">Minimum 10 characters.</p>
          <p className={`text-xs font-medium ${details.length > 500 ? 'text-red-500' : 'text-slate-500'}`}>{details.length} / 500</p>
        </div>
      </div>

      <div className="my-6">
        <StyleLibraryManager
          library={styleLibrary}
          onAddPost={addPostToLibrary}
          onRemovePost={removePostFromLibrary}
        />
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={!isGenFormValid || isProcessing}
          className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          {isProcessing ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          ) : (
              <SparklesIcon className="h-5 w-5 mr-2 -ml-1" />
          )}
          {isProcessing ? 'Generating...' : 'Generate Posts'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200/70">
        <div className="mb-6">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">Select a tab</label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => handleTabChange(e.target.value as 'generate' | 'analyze')}
                value={activeTab}
              >
                <option value="generate">Generate Post</option>
                <option value="analyze">Analyze Post</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => handleTabChange('generate')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'generate'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Generate Post
                  </button>
                  <button
                    onClick={() => handleTabChange('analyze')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'analyze'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Analyze Post
                  </button>
                </nav>
              </div>
            </div>
        </div>
        <div key={activeTab} className="animate-fade-in">
            {activeTab === 'generate' ? renderGeneratorForm() : <PostAnalyzer />}
        </div>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-100 text-red-800 border-l-4 border-red-500 rounded-r-lg">
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}

      {isProcessing && activeTab === 'generate' && (
        <div className="mt-8 flex justify-center">
          <Loader />
        </div>
      )}

      {generatedPosts.length > 0 && !isProcessing && activeTab === 'generate' && (
        <div className="mt-10 animate-fade-in-slow">
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Your AI-Generated Posts</h2>
          <div className="space-y-6">
            {generatedPosts.map((post, index) => (
              <GeneratedPost key={index} post={{ title: `Variation #${index + 1}`, content: post }} />
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default PostGenerator;
