import React, { useState, useRef } from 'react';
import axios from 'axios';
import CodeVisualizer from '../three-scene/CodeVisualizer';

const Sidebar = ({ isPremium, togglePremium }) => (
  <div className="w-16 flex flex-col items-center py-4 space-y-8 bg-slate-800 border-r border-slate-700 z-10">
    <div className="text-2xl font-bold text-blue-400">DB</div>
    <div className="h-6 w-6 bg-blue-500 rounded-full cursor-pointer hover:scale-110 transition-transform" title="Editor"></div>
    <div className="h-6 w-6 bg-slate-500 rounded-full cursor-pointer hover:scale-110 transition-transform" title="Missions"></div>
    <button 
        onClick={togglePremium}
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${isPremium ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.6)]' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}`}
        title={isPremium ? "Premium Active" : "Switch to Pro"}
    >
        {isPremium ? "PRO" : "FREE"}
    </button>
  </div>
);

// [YOUR CHANGE] Destructure activeMission
const Dashboard = ({ activeMission, onBack }) => {
  // Use activeMission starter code if available
  const [code, setCode] = useState(activeMission?.starter_code || `def example_loop():\n    for t in range(10, 0, -1):\n        if t < 5:\n            print(t)`);
  
  const [visualData, setVisualData] = useState(null);
  const [aiFeedback, setAiFeedback] = useState("Ready to analyze...");
  const [output, setOutput] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false); 
  const [userId] = useState(1); // Mock User ID

  const textareaRef = useRef(null);

  // --- AUTO INDENTATION (Leader's Logic Preserved) ---
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 4; }, 0);
    }
    if (e.key === 'Enter') {
        e.preventDefault();
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const currentLineStart = code.lastIndexOf('\n', start - 1) + 1;
        const currentLine = code.substring(currentLineStart, start);
        const currentIndent = currentLine.match(/^\s*/)[0];
        let extraIndent = currentLine.trim().endsWith(':') ? "    " : "";
        const newCode = code.substring(0, start) + '\n' + currentIndent + extraIndent + code.substring(end);
        setCode(newCode);
        setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 1 + currentIndent.length + extraIndent.length; }, 0);
    }
  };

  // --- RUN CODE (Leader's Logic + Your mission_id wiring) ---
  const handleRun = async () => {
      setLoading(true);
      setOutput("Running...");
      try {
          // Pass mission_id so backend runs tests
          const response = await axios.post('http://127.0.0.1:8000/execute', { 
              code, 
              mission_id: activeMission?.id 
          });
          
          let resultText = response.data.output || "";
          
          // Display Test Results if returned
          if (response.data.test_results && response.data.test_results.length > 0) {
              const tests = response.data.test_results;
              const passed = tests.filter(t => t.passed).length;
              resultText += `\n\n--- TEST RESULTS: ${passed}/${tests.length} PASS ---\n`;
              tests.forEach(t => {
                  resultText += `[${t.passed ? '✔' : '✖'}] Test ${t.id}: ${t.passed ? 'Passed' : `Expected ${t.expected}, Got ${t.actual}`}\n`;
              });
          }
          setOutput(resultText);
      } catch (error) {
          setOutput("Error: Could not execute code. Is the backend running?");
      }
      setLoading(false);
  };

  // --- [YOUR ADDITION] SAVE PROGRESS ---
  const handleSave = async () => {
      if (!activeMission) {
          alert("Select a mission from the menu first!");
          return;
      }
      try {
          await axios.post('http://127.0.0.1:8000/save-progress', null, {
              params: {
                  user_id: userId,
                  mission_id: activeMission.id,
                  code: code
              }
          });
          alert("Progress Saved to Database! 💾");
      } catch (error) {
          alert("Failed to save. Is backend running?");
      }
  };

  // --- ANALYZE (Leader's Logic Preserved) ---
  const handleAnalyze = async () => {
    setLoading(true);
    setAiFeedback("Deep Blue is thinking...");
    setVisualData(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze', {
        code: code,
        user_input: activeMission ? `I am solving mission: ${activeMission.title}` : "Analyze this logic",
        is_premium: isPremium 
      });

      setVisualData(response.data.visual_data);
      setAiFeedback(response.data.ai_feedback || "Analysis complete.");
      
      if (response.data.haptic_feedback && navigator.vibrate) navigator.vibrate(200); 
    } catch (error) { setAiFeedback("Error connecting to Deep Blue backend."); }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans">
      <Sidebar isPremium={isPremium} togglePremium={() => setIsPremium(!isPremium)} />

      <div className="flex flex-1">
        <div className="flex-1 flex flex-col border-r border-slate-700">
          <div className="flex-grow p-4 flex flex-col bg-slate-900">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button onClick={onBack} className="group flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all" title="Back to Missions">
                            <span className="text-lg transform group-hover:-translate-x-0.5 transition-transform">←</span>
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-blue-400">
                        {activeMission ? activeMission.title : "Deep Blue Editor"}
                    </h2>
                </div>
                <div className="flex gap-2">
                    {/* [YOUR ADDITION] SAVE BUTTON */}
                    {activeMission && (
                        <button onClick={handleSave} className="bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 px-4 rounded transition flex items-center gap-2" title="Save to Database">
                            <span>💾</span>
                        </button>
                    )}
                    <button onClick={handleRun} className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 px-4 rounded transition shadow-lg hover:shadow-green-500/20 flex items-center gap-2">
                        <span>▶</span> Run
                    </button>
                    <button onClick={handleAnalyze} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded transition shadow-lg hover:shadow-blue-500/20 flex items-center gap-2">
                        <span>🚀</span> Analyze
                    </button>
                </div>
            </div>
            <textarea
                ref={textareaRef}
                className="flex-1 bg-slate-800 p-4 rounded-lg font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-gray-100 shadow-inner leading-6"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck="false"
            />
          </div>
          <div className="h-1/3 bg-black p-4 border-t border-slate-700 font-mono text-sm overflow-auto shadow-inner">
            <div className="text-slate-500 mb-2 text-xs uppercase tracking-wider font-bold flex justify-between">
                <span>Terminal Output</span>
                <span className="text-slate-700">Python 3.9 Runtime</span>
            </div>
            <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="h-2/3 bg-black relative border-b border-slate-700 overflow-hidden">
            {!isPremium && (
                <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-sm">
                        <div className="text-5xl mb-4">🔒</div>
                        <h3 className="text-2xl font-bold text-white mb-2">3D Logic View Locked</h3>
                        <p className="text-slate-400 mb-6 text-sm">Upgrade to PRO to visualize syntax.</p>
                        <button onClick={() => setIsPremium(true)} className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-6 rounded-full transition-transform hover:scale-105">
                            🔓 Unlock Now
                        </button>
                    </div>
                </div>
            )}
            {visualData ? (
              <CodeVisualizer data={visualData} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                <p className="opacity-50">Hit "Analyze" to see 3D Structure</p>
              </div>
            )}
          </div>
          <div className="h-1/3 p-6 bg-slate-900 overflow-auto">
            <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2"><span>🧠</span> Socratic AI</h3>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 shadow-sm">
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">{aiFeedback}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;