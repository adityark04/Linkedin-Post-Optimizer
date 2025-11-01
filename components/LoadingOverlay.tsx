import React from 'react';

interface LoadingStatus {
  [key: string]: {
    progress: number;
    file: string;
  };
}

interface LoadingOverlayProps {
  status: LoadingStatus;
}

const ProgressBar: React.FC<{ modelName: string; progress: number; file: string }> = ({ modelName, progress, file }) => (
  <div className="w-full">
    <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-medium text-slate-200 capitalize">{modelName.split('/').pop()?.replace(/-/g, ' ')}</span>
        <span className="text-xs text-slate-400">{progress}%</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-2.5">
      <div className="bg-indigo-400 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
    <p className="text-xs text-slate-500 mt-1 truncate">File: {file}</p>
  </div>
);

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ status }) => {
  const modelStatuses = Object.entries(status);

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4">
      <div className="w-full max-w-md text-center">
        <svg className="animate-spin h-12 w-12 text-white mx-auto mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 className="text-2xl font-bold text-white mb-2">Initializing On-Device AI...</h2>
        <p className="text-slate-400 mb-8">
          Downloading models to run in your browser. This happens only once and may take a moment. Your data remains 100% private.
        </p>
        <div className="space-y-4">
            {modelStatuses.length > 0 ? (
                modelStatuses.map(([name, data]) => (
                    <ProgressBar key={name} modelName={name} progress={data.progress} file={data.file} />
                ))
            ) : (
                <p className="text-slate-400">Starting download...</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
