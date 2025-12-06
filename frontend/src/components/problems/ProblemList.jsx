import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterBar from './FilterBar';
import ProblemTable from './ProblemTable';

const ProblemList = ({ user, onSelectMission }) => {
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        // Using the new backend endpoint
        const response = await axios.get(`http://localhost:8000/problems?user_id=${user.id}`);
        setMissions(response.data);
        setFilteredMissions(response.data);
      } catch (error) {
        console.error("Failed to fetch problems", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProblems();
  }, [user]);

  // Handle Filtering
  useEffect(() => {
    let result = missions;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.title.toLowerCase().includes(lowerTerm) ||
        (m.topic && m.topic.toLowerCase().includes(lowerTerm))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(m => m.topic === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
      // Strict difficulty check (case insensitive)
      result = result.filter(m => 
          m.difficulty && m.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
      );
    }

    setFilteredMissions(result);
    setCurrentPage(1); 
  }, [searchTerm, selectedCategory, selectedDifficulty, missions]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMissions.length / itemsPerPage);

  // Extract unique categories
  const categories = [...new Set(missions.map(m => m.topic).filter(Boolean))];

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-400">
        <div className="animate-pulse">Loading Mission Data...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Problem Set
          </h1>
          <p className="text-slate-400 mt-2">Browse and solve algorithm challenges.</p>
        </div>

        <FilterBar 
          onSearch={setSearchTerm} 
          onCategoryChange={setSelectedCategory}
          onDifficultyChange={setSelectedDifficulty}
          categories={categories}
        />

        <ProblemTable 
          problems={currentItems} 
          onSelectProblem={onSelectMission} 
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="text-slate-400 font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemList;