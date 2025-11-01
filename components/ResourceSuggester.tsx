
import React, { useState, useEffect } from 'react';
import resourceService, { SearchResults } from '../services/resourceService';
import useDebounce from '../hooks/useDebounce';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { TagIcon } from './icons/TagIcon';
import { PostGoal, PostTone } from '../types';
import geminiService from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

interface ResourceSuggesterProps {
  onSuggestionClick: (suggestion: string) => void;
  goal: PostGoal;
  tone: PostTone;
}

const ResourceSuggester: React.FC<ResourceSuggesterProps> = ({ onSuggestionClick, goal, tone }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const [titleFilter, setTitleFilter] = useState('All Titles');
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);
  
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTitles = async () => {
        const titles = await resourceService.getUniqueJobTitles();
        setAvailableTitles(titles);
    };
    fetchTitles();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults(null);
        return;
      }
      setIsLoading(true);
      const searchResults = await resourceService.search(debouncedQuery);
      setResults(searchResults);
      setIsLoading(false);
    };

    performSearch();
  }, [debouncedQuery]);

  const handleSuggestKeywords = async () => {
    setIsSuggesting(true);
    setAiError(null);
    setAiKeywords([]);
    try {
      const keywords = await geminiService.suggestKeywordsForPost(goal, tone);
      setAiKeywords(keywords);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to get suggestions.');
    } finally {
      setIsSuggesting(false);
    }
  };


  const filteredJobs = results?.jobs.filter(job => 
    titleFilter === 'All Titles' || job.title === titleFilter
  ).slice(0, 10) || [];

  const hasResults = results && (filteredJobs.length > 0 || results.courses.length > 0 || results.skills.length > 0);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <LightbulbIcon className="h-6 w-6 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="w-full">
          <h4 className="font-semibold text-slate-800 text-sm mb-2">Content Idea Booster</h4>
          
          <div className="bg-white p-3 rounded-md border border-slate-200 mb-4">
            <p className="text-xs text-slate-600 mb-2">
              Get AI keywords for your goal (<strong className="text-indigo-600">{goal}</strong>) and tone (<strong className="text-indigo-600">{tone}</strong>).
            </p>
            <button
              onClick={handleSuggestKeywords}
              disabled={isSuggesting}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
              title={"Suggest keywords with AI"}
            >
              <SparklesIcon className={`h-4 w-4 mr-2 ${isSuggesting ? 'animate-pulse' : ''}`} />
              {isSuggesting ? 'Generating ideas...' : 'Suggest Keywords with AI'}
            </button>

            {aiError && <p className="text-xs text-red-500 mt-2 text-center">{aiError}</p>}

            {aiKeywords.length > 0 && !isSuggesting && (
              <div className="mt-3 animate-fade-in">
                <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center mb-2">
                  <SparklesIcon className="h-4 w-4 mr-1.5 text-indigo-500" />
                  AI Suggestions
                </h5>
                <div className="flex flex-wrap gap-2">
                  {aiKeywords.map((keyword, index) => (
                    <button 
                      key={`ai-kw-${index}`} 
                      onClick={() => onSuggestionClick(keyword)} 
                      className="text-sm bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <h5 className="font-semibold text-slate-700 text-xs uppercase tracking-wider mb-2 mt-4 pt-4 border-t border-slate-200">Explore Related Topics</h5>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for job titles, skills, or courses..."
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      
      <div className="mt-3">
        <label htmlFor="job-title-filter" className="block text-xs font-medium text-slate-600 mb-1">Filter job suggestions by title:</label>
        <select
          id="job-title-filter"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          aria-label="Filter job suggestions by title"
        >
          {availableTitles.map(title => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-sm text-slate-500 mt-3 text-center">Searching...</p>}
      
      {!isLoading && debouncedQuery.length > 1 && !hasResults && (
         <p className="text-sm text-slate-500 mt-3 text-center">No suggestions found for "{debouncedQuery}".</p>
      )}

      {!isLoading && hasResults && (
        <div className="mt-4 space-y-4 animate-fade-in">
          {filteredJobs.length > 0 && (
            <div>
                <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center mb-2"><BriefcaseIcon className="h-4 w-4 mr-1.5" />Job Titles</h5>
                <div className="flex flex-wrap gap-2">
                    {filteredJobs.map((job, index) => (
                        <button key={`job-${index}`} onClick={() => onSuggestionClick(job.title)} className="text-sm bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full hover:bg-indigo-200 transition-colors">
                            {job.title}
                        </button>
                    ))}
                </div>
            </div>
          )}
          {results.skills.length > 0 && (
             <div>
                <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center mb-2"><TagIcon className="h-4 w-4 mr-1.5" />Skills</h5>
                <div className="flex flex-wrap gap-2">
                    {results.skills.map((skill, index) => (
                        <button key={`skill-${index}`} onClick={() => onSuggestionClick(skill)} className="text-sm bg-green-100 text-green-800 px-2.5 py-1 rounded-full hover:bg-green-200 transition-colors">
                            {skill}
                        </button>
                    ))}
                </div>
            </div>
          )}
           {results.courses.length > 0 && (
             <div>
                <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center mb-2"><BookOpenIcon className="h-4 w-4 mr-1.5" />Courses</h5>
                <div className="flex flex-wrap gap-2">
                    {results.courses.map((course, index) => (
                        <button key={`course-${index}`} onClick={() => onSuggestionClick(course.title)} className="text-sm bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full hover:bg-amber-200 transition-colors">
                            {course.title}
                        </button>
                    ))}
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceSuggester;