import React, { useState } from 'react';
import axios from 'axios';
import CodeVisualizer from '../three-scene/CodeVisualizer';

// Sidebar with Premium Toggle
const Sidebar = ({ isPremium, togglePremium }) => (
  <div className="w-16 flex flex-col items-center py-4 space-y-8 bg-slate-800 border-r border-slate-700 z-10">
    <div className="text-2xl font-bold text-blue-400">DB</div>
    <div className="h-6 w-6 bg-blue-500 rounded-full cursor-pointer hover:scale-110 transition-transform" title="Editor"></div>
    <div className="h-6 w-6 bg-slate-500 rounded-full cursor-pointer hover:scale-110 transition-transform" title="Missions"></div>
    
    {/* Premium Toggle Button */}
    <button 
        onClick={togglePremium}
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${isPremium ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.6)]' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}`}
        title={isPremium ? "Premium Active" : "Switch to Pro"}
    >
        {isPremium ? "PRO" : "FREE"}
    </button>
  </div>
);

const Dashboard = ({ initialCode, onBack}) => {
  // Default code snippet (Loop logic)
  const [code, setCode] = useState(initialCode||`def example_loop():\n    for t in range(10, 0, -1):\n        if t < 5:\n            print(t)`);
  const [visualData, setVisualData] = useState(null);
  const [aiFeedback, setAiFeedback] = useState("Ready to analyze...");
  const [loading, setLoading] = useState(false);
  
  // State for Premium/Free mode
  const [isPremium, setIsPremium] = useState(false); 

  const handleAnalyze = async () => {
    setLoading(true);
    setAiFeedback("Deep Blue is thinking...");
    setVisualData(null); // Clear previous visual data to show loading/lock state correctly
    
    try {
      // Call Backend with premium status
      const response = await axios.post('http://127.0.0.1:8000/analyze', {
        code: code,
        user_input: "Analyze this logic",
        is_premium: isPremium 
      });

      // Update UI with response
      setVisualData(response.data.visual_data);
      setAiFeedback(response.data.ai_feedback || "Analysis complete.");
      
      // Handle Haptics (Only works if backend sends flag, which depends on Premium)
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
      
      {/* 1. Sidebar with Premium Controls */}
      <Sidebar isPremium={isPremium} togglePremium={() => setIsPremium(!isPremium)} />

      {/* 2. Main Content Area */}
      <div className="flex flex-1">
        
        {/* LEFT PANEL: Code Editor */}
        <div className="flex-1 p-4 flex flex-col border-r border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-400">Deep Blue Editor</h2>
            {/* Status Badge */}
            <span className={`text-xs px-2 py-1 rounded-md font-mono border ${isPremium ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                {isPremium ? "✨ PREMIUM UNLOCKED" : "🔒 FREE MODE"}
            </span>
          </div>
          
          <textarea
            className="flex-1 bg-slate-800 p-4 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-100 shadow-inner"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
          
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`mt-4 font-bold py-3 px-6 rounded-lg transition-all transform active:scale-95 ${loading ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 text-white'}`}
          >
            {loading ? "Processing..." : "🚀 Analyze Logic"}
          </button>
        </div>

        {/* RIGHT PANEL: Visualization & AI */}
        <div className="flex-1 flex flex-col">
          
          {/* Top: 3D Scene Area */}
          <div className="h-2/3 bg-black relative border-b border-slate-700 overflow-hidden">
            
            {/* PAYWALL LOCK SCREEN */}
            {!isPremium && (
                <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-sm">
                        <div className="text-5xl mb-4">🔒</div>
                        <h3 className="text-2xl font-bold text-white mb-2">3D Logic View Locked</h3>
                        <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                            Upgrade to <span className="text-amber-400 font-bold">Deep Blue PRO</span> to visualize your code's abstract syntax tree in 3D space.
                        </p>
                        <button 
                            onClick={() => setIsPremium(true)} 
                            className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold py-3 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-1"
                        >
                            🔓 Unlock Now
                        </button>
                    </div>
                </div>
            )}

            {/* The Actual 3D Visualizer (Hidden behind blur if not premium) */}
            {visualData ? (
              <CodeVisualizer data={visualData} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                <div className="text-center">
                    <p className="text-4xl mb-2 opacity-50">🧊</p>
                    <p>Hit "Analyze" to see 3D Structure</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom: AI Feedback Panel */}
          <div className="h-1/3 p-6 bg-slate-900 overflow-auto">
            <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                <span>🧠</span> Socratic AI
            </h3>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">
                    {aiFeedback}
                </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;