
import React from 'react';
import PostGenerator from './components/PostGenerator';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PostGenerator />
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by AI</p>
      </footer>
    </div>
  );
};

export default App;