
import React, { useState, useEffect } from 'react';
import { GeneratedPostData } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';


interface GeneratedPostProps {
  post: GeneratedPostData;
}

const GeneratedPost: React.FC<GeneratedPostProps> = ({ post }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(post.content);
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/70 overflow-hidden transition-shadow hover:shadow-xl">
      <div className="p-5 bg-slate-50/80 border-b border-slate-200/70 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">{post.title}</h3>
        <button
          onClick={handleCopy}
          className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors duration-200 ${
            isCopied
              ? 'bg-green-100 text-green-800'
              : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
          }`}
        >
          {isCopied ? <CheckIcon className="h-4 w-4 mr-1.5" /> : <CopyIcon className="h-4 w-4 mr-1.5" />}
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-6 whitespace-pre-wrap text-slate-700 text-base leading-relaxed">
        {post.content}
      </div>
    </div>
  );
};

export default GeneratedPost;