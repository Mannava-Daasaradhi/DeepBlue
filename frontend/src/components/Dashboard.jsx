import React, { useState } from 'react';
import axios from 'axios';
import CodeVisualizer from '../three-scene/CodeVisualizer';

// Mock Component for the Sidebar
const Sidebar = () => (
  <div className="w-16 flex flex-col items-center py-4 space-y-8 bg-slate-800 border-r border-slate-700">
    <div className="text-2xl font-bold text-blue-400">DB</div>
    <div className="h-6 w-6 bg-blue-500 rounded-full cursor-pointer hover:scale-110 transition-transform" title="Editor"></div>
    <div className="h-6 w-6 bg-slate-500 rounded-full cursor-pointer hover:scale-110 transition-transform" title="Missions"></div>
    <div className="h-6 w-6 bg-slate-500 rounded-full cursor-pointer hover:scale-110 transition-transform" title="Settings"></div>
  </div>
);

const Dashboard = () => {
  // Updated default code to be more interesting (Loop logic)
  const [code, setCode] = useState(`def example_loop():\n    for t in range(10, 0, -1):\n        if t < 5:\n            print(t)`);
  const [visualData, setVisualData] = useState(null);
  const [aiFeedback, setAiFeedback] = useState("Ready to analyze...");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAiFeedback("Deep Blue is thinking...");
    
    try {
      // 1. CALL YOUR BACKEND
      const response = await axios.post('http://127.0.0.1:8000/analyze', {
        code: code,
        user_input: "Analyze this code structure." 
      });

      // 2. UPDATE STATE
      setVisualData(response.data.visual_data);
      setAiFeedback(response.data.ai_feedback || "Analysis complete.");
      
      // 3. HANDLE HAPTICS
      if (response.data.haptic_feedback && navigator.vibrate) {
         console.log("Vibrating device!");
         navigator.vibrate(200); 
      }

    } catch (error) {
      console.error("API Error:", error);
      setAiFeedback("Error connecting to Deep Blue backend. Is it running?");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans">
      
      {/* 1. LEFT-MOST: Navigation Sidebar (Fixed Width) */}
      <Sidebar />

      {/* 2. MAIN WORKSPACE (Takes remaining width) */}
      <div className="flex flex-1">
        
        {/* LEFT-HALF: Code Editor (50% of workspace) */}
        <div className="flex-1 p-4 flex flex-col border-r border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Deep Blue Editor</h2>
          <textarea
            className="flex-1 bg-slate-800 p-4 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-100"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded transition-colors"
          >
            {loading ? "Processing..." : "🚀 Analyze Logic"}
          </button>
        </div>

        {/* RIGHT-HALF: 3D Visualization & AI Feedback (50% of workspace) */}
        <div className="flex-1 flex flex-col">
          
          {/* Top: 3D Scene (2/3 height) */}
          <div className="h-2/3 bg-black relative border-b border-slate-700">
            {visualData ? (
              <CodeVisualizer data={visualData} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                <p>Hit "Analyze" to see 3D Structure</p>
              </div>
            )}
          </div>

          {/* Bottom: Socratic AI & Pseudocode Overlay (1/3 height) */}
          <div className="h-1/3 p-6 bg-slate-800 overflow-auto">
            <h3 className="text-lg font-bold text-green-400 mb-2">🧠 Socratic AI</h3>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {aiFeedback}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;