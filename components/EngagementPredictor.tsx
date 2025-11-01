
import React, { useState, useEffect } from 'react';
import { EngagementPrediction } from '../types';
import engagementPredictorService from '../services/engagementPredictorService';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface EngagementPredictorProps {
  text: string;
}

const DEBOUNCE_DELAY = 500; // ms

const EngagementPredictor: React.FC<EngagementPredictorProps> = ({ text }) => {
  const [prediction, setPrediction] = useState<EngagementPrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  
  useEffect(() => {
    // The model is loaded globally in App.tsx, but we check its status here.
    setIsModelReady(engagementPredictorService.isReady());
  }, []);

  useEffect(() => {
    if (!isModelReady || text.trim().length < 15) {
      setPrediction(null);
      return;
    }
    
    setIsAnalyzing(true);
    const handler = setTimeout(async () => {
      const result = await engagementPredictorService.predict(text);
      setPrediction(result);
      setIsAnalyzing(false);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
      setIsAnalyzing(false);
    };
  }, [text, isModelReady]);

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
    if (!isModelReady) {
        return <p className="text-sm text-slate-500">Engagement model loading...</p>;
    }
    if (isAnalyzing) {
        return <p className="text-sm text-slate-500">Analyzing draft...</p>;
    }
    if (!prediction) {
      return <p className="text-sm text-slate-500">Start typing for an instant engagement prediction.</p>;
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
