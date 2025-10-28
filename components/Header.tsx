
import React from 'react';
import { LinkedinIcon } from './icons/LinkedinIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <LinkedinIcon className="h-10 w-10 text-blue-600 mr-3" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            LinkedIn Post Optimizer
          </h1>
          <p className="text-sm sm:text-md text-gray-600">Craft engaging posts with the power of AI</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
