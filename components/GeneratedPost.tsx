
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-xl">
      <div className="p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
        <button
          onClick={handleCopy}
          className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors duration-200 ${
            isCopied
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isCopied ? <CheckIcon className="h-4 w-4 mr-1.5" /> : <CopyIcon className="h-4 w-4 mr-1.5" />}
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-5 whitespace-pre-wrap text-gray-700 text-base leading-relaxed">
        {post.content}
      </div>
    </div>
  );
};

export default GeneratedPost;
