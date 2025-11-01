import React from 'react';
import { EngagementPrediction } from '../types';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface EngagementPredictorProps {
  prediction: EngagementPrediction | null;
}

const EngagementPredictor: React.FC<EngagementPredictorProps> = ({ prediction }) => {

  const getIndicatorColor = () => {
    if (!prediction) return 'bg-slate-300';
    switch (prediction.level) {
      case 'High': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-red-500';
      default: return 'bg-slate-300';
    }
  };

  const renderContent = () => {
    if (!prediction) {
      return <p className="text-sm text-slate-500 text-center">Submit a post draft above to see its engagement analysis.</p>;
    }
    return (
      <div className="w-full">
        <div className="flex items-center mb-3">
            <div className={`w-3 h-3 rounded-full mr-2 ${getIndicatorColor()}`} />
            <p className="text-sm font-semibold text-slate-800">
                Predicted Engagement: <span className="font-bold">{prediction.level}</span>
                <span className="text-slate-500 font-normal ml-1">(~{(prediction.confidence * 100).toFixed(0)}% confidence)</span>
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h5 className="font-semibold text-sm text-green-700 flex items-center mb-1"><ThumbsUpIcon className="h-4 w-4 mr-1.5"/>Strengths</h5>
                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                    {prediction.strengths.map((reason, index) => (
                        <li key={index}>{reason}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h5 className="font-semibold text-sm text-yellow-700 flex items-center mb-1"><SparklesIcon className="h-4 w-4 mr-1.5"/>Suggestions</h5>
                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                    {prediction.justification.map((reason, index) => (
                        <li key={index}>{reason}</li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start space-x-3">
        <LightbulbIcon className="h-6 w-6 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="w-full">
            <h4 className="font-semibold text-slate-800 text-sm mb-2">Instant Engagement Analysis</h4>
            {renderContent()}
        </div>
    </div>
  );
};

export default EngagementPredictor;