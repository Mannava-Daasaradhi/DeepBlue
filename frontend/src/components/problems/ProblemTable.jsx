import React from 'react';

const ProblemTable = ({ problems, onSelectProblem }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-amber-400 bg-amber-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-blue-400 bg-blue-400/10';
    }
  };

  return (
    <div className="overflow-hidden bg-slate-900 rounded-xl border border-slate-700 shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-6 py-4 font-medium w-16">Status</th>
            <th className="px-6 py-4 font-medium">Title</th>
            <th className="px-6 py-4 font-medium hidden md:table-cell">Acceptance</th>
            <th className="px-6 py-4 font-medium">Difficulty</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-sm">
          {problems.map((problem, index) => (
            <tr 
              key={problem.id} 
              className={`group hover:bg-slate-800 transition-colors duration-150 cursor-pointer ${index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'}`}
              onClick={() => onSelectProblem(problem)}
            >
              <td className="px-6 py-4">
                {problem.status === 'Solved' ? (
                  <span className="text-green-500 text-lg" title="Solved">✔</span>
                ) : (
                  <span className="text-slate-600 text-lg" title="Todo">−</span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                  {index + 1}. {problem.title}
                </div>
                <div className="flex gap-2 mt-1">
                    {problem.topic && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                            {problem.topic}
                        </span>
                    )}
                </div>
              </td>
              <td className="px-6 py-4 text-slate-400 hidden md:table-cell">
                {problem.acceptance || '45.2%'}
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border border-current ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty || 'Medium'}
                </span>
              </td>
            </tr>
          ))}
          {problems.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                No problems found matching your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemTable;