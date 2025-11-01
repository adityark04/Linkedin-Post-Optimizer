import React, { useState, useCallback } from 'react';
import { PostAnalysis } from '../types';
import geminiService from '../services/geminiService';
import Loader from './Loader';
import { SparklesIcon } from './icons/SparklesIcon';
import PostAnalysisResult from './PostAnalysisResult';

const PostAnalyzer: React.FC = () => {
  const [draft, setDraft] = useState('');
  const [analysis, setAnalysis] = useState<PostAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = draft.trim().length > 20;

  const handleAnalyze = useCallback(async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await geminiService.analyzePost(draft);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [draft, isFormValid]);

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="draft" className="block text-sm font-medium text-slate-700 mb-2">
          Paste your post draft here for an AI-powered analysis
        </label>
        <textarea
          id="draft"
          name="draft"
          rows={8}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Crafted a post but not sure if it will land? Paste it here for a comprehensive analysis and revision..."
        />
        <p className="text-xs text-slate-500 mt-1">Minimum 20 characters for a meaningful analysis.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!isFormValid || isLoading}
          className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 transition-all"
        >
          <SparklesIcon className="h-5 w-5 mr-2 -ml-1" />
          {isLoading ? 'Analyzing...' : 'Analyze Post'}
        </button>
      </div>

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
      
      {analysis && !isLoading && (
        <div className="mt-8 pt-6 border-t border-slate-200 animate-fade-in-slow">
            <PostAnalysisResult result={analysis} />
        </div>
      )}
    </div>
  );
};

export default PostAnalyzer;
