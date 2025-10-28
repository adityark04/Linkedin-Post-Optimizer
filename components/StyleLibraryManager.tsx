import React, { useState } from 'react';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { TrashIcon } from './icons/TrashIcon';
import { StyleLibraryItem } from '../types';

interface StyleLibraryManagerProps {
  library: StyleLibraryItem[];
  onAddPost: (post: string) => Promise<void>;
  onRemovePost: (index: number) => void;
}

const StyleLibraryManager: React.FC<StyleLibraryManagerProps> = ({ library, onAddPost, onRemovePost }) => {
  const [newPost, setNewPost] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newPost.trim()) return;
    setIsAdding(true);
    try {
      await onAddPost(newPost.trim());
      setNewPost('');
    } catch (error) {
      // The parent component is responsible for showing the error toast.
      console.error("Failed to add post to library", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-100 rounded-lg transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <DatabaseIcon className="h-6 w-6 text-indigo-600 mr-3" />
          <div>
            <h4 className="font-semibold text-slate-800">Your Style Library (RAG)</h4>
            <p className="text-sm text-slate-500">Add successful posts to create a knowledge base for the AI.</p>
          </div>
        </div>
        <svg
          className={`h-5 w-5 text-slate-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 border-t border-slate-200">
          <div className="mb-4">
            <label htmlFor="newPost" className="block text-sm font-medium text-slate-700 mb-2">
              Add a new post to your library:
            </label>
            <textarea
              id="newPost"
              rows={4}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Paste one of your successful posts here..."
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAdd}
                disabled={!newPost.trim() || isAdding}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-slate-400 flex items-center justify-center min-w-[120px]"
              >
                {isAdding ? (
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : 'Add to Library'}
              </button>
            </div>
          </div>
          {library.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-slate-700 mb-2">Library Posts:</h5>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {library.map((item, index) => (
                  <div key={index} className="bg-white p-3 rounded-md border border-slate-200 flex justify-between items-start">
                    <p className="text-sm text-slate-600 break-words w-full mr-2">&ldquo;{item.text.substring(0, 100)}{item.text.length > 100 ? '...' : ''}&rdquo;</p>
                    <button onClick={() => onRemovePost(index)} aria-label="Remove post" className="text-slate-400 hover:text-red-500 flex-shrink-0 p-1">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleLibraryManager;