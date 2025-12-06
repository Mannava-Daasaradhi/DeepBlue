import React from 'react';

const FilterBar = ({ onSearch, onCategoryChange, onDifficultyChange, categories }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700 backdrop-blur-sm">
      {/* Search Input */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search questions..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-slate-900 text-white border border-slate-600 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-500 transition-all"
        />
      </div>

      {/* Dropdowns */}
      <div className="flex gap-4">
        <select
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="All">All Topics</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="All">Difficulty</option>
          <option value="Easy" className="text-green-400">Easy</option>
          <option value="Medium" className="text-amber-400">Medium</option>
          <option value="Hard" className="text-red-400">Hard</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;