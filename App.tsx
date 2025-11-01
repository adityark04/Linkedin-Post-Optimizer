import React, { useState, useEffect } from 'react';
import PostGenerator from './components/PostGenerator';
import Header from './components/Header';
import LoadingOverlay from './components/LoadingOverlay';
import localModelService from './services/localModelService';

interface LoadingStatus {
  [key: string]: {
    progress: number;
    file: string;
  };
}

const App: React.FC = () => {
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({});
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const progressCallback = (progress: any) => {
      setLoadingStatus(prev => ({
        ...prev,
        [progress.name]: {
          progress: Math.round(progress.progress),
          file: progress.file,
        }
      }));
    };

    const initializeModels = async () => {
      try {
        await localModelService.loadModels(progressCallback);
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load AI models.');
      }
    };

    initializeModels();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-800">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Application Error</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm">Please try refreshing the page. If the problem persists, your browser might not be supported.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-800">
      {!isReady && <LoadingOverlay status={loadingStatus} />}
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PostGenerator isModelReady={isReady} />
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Gemini and On-Device AI for Privacy</p>
      </footer>
    </div>
  );
};

export default App;
