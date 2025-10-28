
import React from 'react';
import { LinkedinIcon } from './icons/LinkedinIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-600 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <LinkedinIcon className="h-10 w-10 text-white/80 mr-4" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            LinkedIn Post Optimizer
          </h1>
          <p className="text-sm sm:text-md text-slate-300">Craft engaging posts with the power of AI</p>
        </div>
      </div>
    </header>
  );
};

export default Header;