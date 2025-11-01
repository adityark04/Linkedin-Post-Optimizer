import React from 'react';
import { PostAnalysis } from '../types';
import GeneratedPost from './GeneratedPost';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface PostAnalysisResultProps {
  result: PostAnalysis | null;
}

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const percentage = score * 10;
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-red-500';
  if (score >= 4 && score < 7) {
    colorClass = 'text-yellow-500';
  } else if (score >= 7) {
    colorClass = 'text-green-500';
  }

  return (
    <div className={`relative h-32 w-32 font-bold ${colorClass}`}>
      <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
        <circle
          className="text-slate-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-slate-700">
        {score}
      </span>
    </div>
  );
};


const PostAnalysisResult: React.FC<PostAnalysisResultProps> = ({ result }) => {
  if (!result) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-center mb-4 text-slate-800">AI Analysis Report</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <ScoreGauge score={result.score} />
            <p className="text-center text-sm font-semibold text-slate-600 mt-2">Overall Score</p>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <h5 className="font-semibold text-base text-green-700 flex items-center mb-2"><ThumbsUpIcon className="h-5 w-5 mr-2"/>Strengths</h5>
                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1.5">
                    {result.strengths.map((item, index) => <li key={`strength-${index}`}>{item}</li>)}
                </ul>
            </div>
            <div>
                <h5 className="font-semibold text-base text-yellow-700 flex items-center mb-2"><SparklesIcon className="h-5 w-5 mr-2"/>Improvements</h5>
                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1.5">
                    {result.improvements.map((item, index) => <li key={`improv-${index}`}>{item}</li>)}
                </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-center mb-4 text-slate-800">AI-Revised Post</h2>
        <GeneratedPost post={{ title: `AI-Revised Version (Score: ${result.score}/10)`, content: result.revisedVersion }} />
      </div>
    </div>
  );
};

export default PostAnalysisResult;
