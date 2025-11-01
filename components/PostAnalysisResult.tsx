import React from 'react';
import { PostAnalysis } from '../types';
import GeneratedPost from './GeneratedPost';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

const ScoreDisplay = ({ score }: { score: number }) => {
  const size = 112; // w-28, h-28 in Tailwind
  const strokeWidth = 10;
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
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="absolute w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-slate-200"
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
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-4xl font-bold ${color}`}>{clampedScore.toFixed(1)}</span>
        <span className="text-sm text-slate-500 -mt-1">/ 10</span>
      </div>
    </div>
  );
};


interface PostAnalysisResultProps {
  analysis: PostAnalysis;
  originalDraft: string;
}

const PostAnalysisResult: React.FC<PostAnalysisResultProps> = ({ analysis, originalDraft }) => {
  return (
    <div className="mt-8 pt-8 border-t border-slate-200 animate-fade-in-slow">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">AI Revision & Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1 bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col items-center text-center">
            <p className="font-semibold text-slate-700 mb-3 text-lg">AI Engagement Score</p>
            <ScoreDisplay score={analysis.score} />
            <p className="text-sm text-slate-500 mt-3">An estimate of how well the revised post might perform based on engagement best practices.</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-green-50/70 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 flex items-center mb-2"><ThumbsUpIcon className="h-5 w-5 mr-2" />Strengths</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-green-900">
                    {analysis.strengths.map((item, i) => <li key={`strength-${i}`}>{item}</li>)}
                </ul>
            </div>
            <div className="bg-yellow-50/70 p-4 rounded-lg border border-yellow-200">
                 <h3 className="font-semibold text-yellow-800 flex items-center mb-2"><LightbulbIcon className="h-5 w-5 mr-2" />Improvements</h3>
                 <ul className="list-disc list-inside space-y-1 text-sm text-yellow-900">
                    {analysis.improvements.map((item, i) => <li key={`improvement-${i}`}>{item}</li>)}
                </ul>
            </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <GeneratedPost post={{ title: "AI-Revised Version", content: analysis.revisedPost }} />
        <GeneratedPost post={{ title: "Your Original Post", content: originalDraft }} />
      </div>
    </div>
  );
};

export default PostAnalysisResult;
