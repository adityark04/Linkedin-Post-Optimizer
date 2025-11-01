import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import * as toxicity from '@tensorflow-models/toxicity';
import '@tensorflow/tfjs'; // Required for side-effects: backend registration

interface RealtimeAnalysisProps {
  text: string;
}

interface Prediction {
    label: string;
    results: {
        probabilities: Float32Array;
        match: boolean;
    }[];
}

const DEBOUNCE_DELAY = 500; // ms
const MODEL_THRESHOLD = 0.7; // Confidence threshold for the toxicity model

const RealtimeAnalysis: React.FC<RealtimeAnalysisProps> = ({ text }) => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'analyzing'>('loading');
  const [issues, setIssues] = useState<string[]>([]);
  const modelRef = useRef<any | null>(null);
  
  // Load the model once on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        modelRef.current = await toxicity.load(MODEL_THRESHOLD, []);
        setStatus('ready');
      } catch (error) {
        console.error("Failed to load toxicity model:", error);
        setStatus('error');
      }
    };
    loadModel();
  }, []);

  const analyzeText = useCallback(async (textToAnalyze: string) => {
    if (status !== 'ready' || !modelRef.current) {
        return;
    }

    setStatus('analyzing');
    try {
        const predictions: Prediction[] = await modelRef.current.classify([textToAnalyze]);
        const foundIssues: string[] = [];
        predictions.forEach(prediction => {
            if (prediction.results[0].match) {
                // Capitalize the first letter and replace underscores
                const formattedLabel = prediction.label.charAt(0).toUpperCase() + prediction.label.slice(1).replace(/_/g, ' ');
                foundIssues.push(formattedLabel);
            }
        });
        setIssues(foundIssues);
    } catch (error) {
        console.error("Error during text classification:", error);
        setIssues(['Analysis failed']);
    } finally {
        setStatus('ready');
    }
  }, [status]);
  
  // Debounce the analysis to avoid running on every keystroke
  useEffect(() => {
      if (text.trim().length < 10) {
          setIssues([]);
          return;
      }

      const handler = setTimeout(() => {
          analyzeText(text);
      }, DEBOUNCE_DELAY);

      // Cleanup function to cancel the timeout if the component unmounts or text changes
      return () => {
          clearTimeout(handler);
      };
  }, [text, analyzeText]);

  const renderStatus = () => {
    if (status === 'error') {
      return <p className="text-sm text-red-600">Content analysis model failed to load.</p>;
    }
    if (text.trim().length < 10) {
      return <p className="text-sm text-gray-500">Start typing to see real-time content analysis.</p>;
    }
    if (status === 'analyzing') {
       return <p className="text-sm text-gray-500">Analyzing...</p>;
    }
    if (issues.length > 0) {
      return (
        <div>
          <p className="text-sm font-semibold text-yellow-700">Potential Issues Detected:</p>
          <ul className="text-sm text-yellow-600 list-disc list-inside">
             {issues.map(issue => <li key={issue}>{issue}</li>)}
          </ul>
        </div>
      );
    }
    return <p className="text-sm text-green-600 font-medium">Content looks professional and safe.</p>;
  };
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start space-x-3">
        <ShieldCheckIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="w-full">
            <h4 className="font-semibold text-gray-800 text-sm">Real-time Content Analysis</h4>
            {renderStatus()}
        </div>
    </div>
  );
};

export default RealtimeAnalysis;