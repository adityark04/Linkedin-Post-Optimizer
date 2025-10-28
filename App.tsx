
import React from 'react';
import PostGenerator from './components/PostGenerator';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PostGenerator />
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by AI. Designed for professionals.</p>
      </footer>
    </div>
  );
};

export default App;
