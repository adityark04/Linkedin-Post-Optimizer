import React, { useState, useCallback } from 'react';
import { RevisedPostData } from '../types';
import geminiService from '../services/geminiService';
import Loader from './Loader';
import GeneratedPost from './GeneratedPost';

interface PostAnalyzerProps {}

const ScoreDisplay = ({ score }: { score: number }) => {
  const size = 96; // w-24, h-24 in Tailwind
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(1, Math.min(10, score));
  const offset = circumference - (clampedScore / 10) * circumference;

  let color = 'text-green-600';
  let ringColor = 'stroke-green-500';
  if (clampedScore < 4) {
    color = 'text-red-600';
    ringColor = 'stroke-red-500';
  } else if (clampedScore < 7) {
    color = 'text-yellow-600';
    ringColor = 'stroke-yellow-500';
  }

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="absolute w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${color}`}>{clampedScore}</span>
        <span className="text-xs text-gray-500">/ 10</span>
      </div>
    </div>
  );
};


const PostAnalyzer: React.FC<PostAnalyzerProps> = () => {
  const [draft, setDraft] = useState('');
  const [revisedPostData, setRevisedPostData] = useState<RevisedPostData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = draft.trim().length > 20;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);
    setRevisedPostData(null);

    try {
      const result = await geminiService.reviseLinkedInPost(draft);
      setRevisedPostData({ content: result.revisedPost, score: result.score });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [draft, isFormValid]);

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <label htmlFor="draft" className="block text-sm font-medium text-gray-700 mb-2">
                Paste your post draft here to have the AI revise it
                </label>
                <textarea
                id="draft"
                name="draft"
                rows={8}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Crafted a post but not sure if it will land? Paste it here and let our AI coach revise it for you..."
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 20 characters for a meaningful revision.</p>
            </div>
            <div className="flex justify-end">
                <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                {isLoading ? 'Revising...' : 'Revise Post'}
                </button>
            </div>
        </form>

        {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
            <strong>Error:</strong> {error}
            </div>
        )}

        {isLoading && (
            <div className="mt-6 flex justify-center">
                <Loader />
            </div>
        )}
        
        {revisedPostData && !isLoading && (
            <div className="mt-8">
                 <h2 className="text-xl font-bold text-center mb-6 text-gray-800">AI Revision & Analysis</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                     <GeneratedPost post={{ title: "Your Original Post", content: draft }} />
                     <div className="flex flex-col items-center">
                        <div className="p-4 bg-gray-50 rounded-lg border w-full flex flex-col items-center">
                             <p className="font-semibold text-gray-700 mb-2">Engagement Score</p>
                             <ScoreDisplay score={revisedPostData.score} />
                             <p className="text-xs text-gray-500 mt-2 text-center">An estimate of how well this post might perform.</p>
                        </div>
                        <div className="w-full mt-6">
                            <GeneratedPost post={{ title: "AI-Revised Version", content: revisedPostData.content }} />
                        </div>
                     </div>
                 </div>
            </div>
        )}
    </div>
  );
};

export default PostAnalyzer;