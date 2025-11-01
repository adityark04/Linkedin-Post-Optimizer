
import React, { useState, useCallback } from 'react';
import { PostAnalysis } from '../types';
import geminiService from '../services/geminiService';
import Loader from './Loader';
import { SparklesIcon } from './icons/SparklesIcon';
import PostAnalysisResult from './PostAnalysisResult';


const PostAnalyzer: React.FC = () => {
  const [draft, setDraft] = useState('');
  const [analysisResult, setAnalysisResult] = useState<PostAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = draft.trim().length > 20;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await geminiService.reviseLinkedInPost(draft);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [draft, isFormValid]);

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="draft" className="block text-sm font-medium text-slate-700 mb-2">
                Paste your post draft here to have the AI revise it
                </label>
                <textarea
                id="draft"
                name="draft"
                rows={8}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Crafted a post but not sure if it will land? Paste it here and let our AI coach revise it for you..."
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-slate-500">Minimum 20 characters for a meaningful revision.</p>
                  <p className={`text-xs font-medium ${draft.length > 500 ? 'text-red-500' : 'text-slate-500'}`}>{draft.length} / 500</p>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                title={"Revise your post with AI"}
                >
                  {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                  ) : (
                      <SparklesIcon className="h-5 w-5 mr-2 -ml-1" />
                  )}
                  {isLoading ? 'Revising...' : 'Revise Post with AI'}
                </button>
            </div>
        </form>

        {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-800 border-l-4 border-red-500 rounded-r-lg">
                <strong className="font-semibold">Error:</strong> {error}
            </div>
        )}

        {isLoading && (
            <div className="mt-6 flex justify-center">
                <Loader />
            </div>
        )}
        
        {analysisResult && !isLoading && (
            <PostAnalysisResult analysis={analysisResult} originalDraft={draft} />
        )}
    </div>
  );
};

export default PostAnalyzer;