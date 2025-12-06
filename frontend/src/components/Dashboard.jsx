import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import CodeVisualizer from '../three-scene/CodeVisualizer';

const Sidebar = ({ isPremium }) => (
  <div className="w-16 flex flex-col items-center py-4 space-y-8 bg-slate-800 border-r border-slate-700 z-10">
    <div className="text-2xl font-bold text-blue-400">DB</div>
    <div className="h-6 w-6 bg-blue-500 rounded-full cursor-pointer hover:scale-110 transition-transform" title="Editor"></div>
    <div className="h-6 w-6 bg-slate-500 rounded-full cursor-pointer hover:scale-110 transition-transform" title="Missions"></div>
    
    {/* Status Indicator (Real Data) */}
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[10px] ${isPremium ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/50' : 'bg-slate-700 text-slate-500'}`} title={isPremium ? "Premium User" : "Free User"}>
        {isPremium ? "PRO" : "FREE"}
    </div>
  </div>
);

const Dashboard = ({ user, initialCode, missionId, missionDesc, onBack }) => {
  // 1. STATE MANAGEMENT
  const [code, setCode] = useState(initialCode || `def solve():\n    pass`);
  const [visualData, setVisualData] = useState(null);
  const [aiFeedback, setAiFeedback] = useState("Ready to analyze...");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("terminal"); // 'terminal' or 'tests'

  // Extract User Info
  const isPremium = user?.is_premium || false;
  const userId = user?.id;

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // Scroll to bottom effect
  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output, testResults, activeTab]);

  // 2. AUTO-INDENTATION LOGIC
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setCode(code.substring(0, start) + "    " + code.substring(end));
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
        setCode(code.substring(0, start) + '\n' + currentIndent + extraIndent + code.substring(end));
        setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 1 + currentIndent.length + extraIndent.length; }, 0);
    }
  };

  // 3. RUN & TEST ENGINE (Calls /execute)
  const handleRun = async () => {
      setLoading(true);
      setOutput("Running...");
      setTestResults(null);
      try {
          const response = await axios.post('http://127.0.0.1:8000/execute', { 
              code, 
              mission_id: missionId 
          });
          setOutput(response.data.output || "No output.");
          
          if (response.data.test_results) {
              setTestResults(response.data.test_results);
              setActiveTab("tests");

              // If all tests pass, save progress!
              const allPassed = response.data.test_results.every(t => t.passed);
              if (allPassed && userId && missionId) {
                  // Call the Save Endpoint
                  await axios.post(`http://127.0.0.1:8000/save-progress?user_id=${userId}&mission_id=${missionId}&code=${encodeURIComponent(code)}`);
                  setOutput(prev => prev + "\n\n✨ MISSION COMPLETE! Progress Saved to Database.");
              }
              
              // If any failed, ask AI automatically
              const failed = response.data.test_results.find(t => !t.passed);
              if(failed) {
                 handleAnalyze(`My code failed on input ${failed.input}. Expected ${failed.expected} but got ${failed.actual}. Help me fix it.`);
              }
          }
      } catch (error) {
          setOutput("Error: Execution failed.");
      }
      setLoading(false);
  };

  // 4. ANALYZE ENGINE (Calls /analyze)
  const handleAnalyze = async (customPrompt = "") => {
    setLoading(true);
    if (!customPrompt) setAiFeedback("Deep Blue is thinking...");
    setVisualData(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze', {
        code: code,
        user_input: customPrompt || "Analyze this logic",
        is_premium: isPremium 
      });
      setVisualData(response.data.visual_data);
      setAiFeedback(response.data.ai_feedback);
      if (response.data.haptic_feedback && navigator.vibrate) navigator.vibrate(200);
    } catch (error) {
      setAiFeedback("Connection Error.");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans">
      <Sidebar isPremium={isPremium} />

      <div className="flex flex-1">
        {/* LEFT: Editor */}
        <div className="flex-1 flex flex-col border-r border-slate-700">
            {/* Mission Header */}
            {missionDesc && (
                <div className="bg-slate-800 p-3 border-b border-slate-700 text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-blue-400 font-bold whitespace-nowrap">MISSION:</span> 
                    <span className="italic">{missionDesc}</span>
                </div>
            )}
            
          <div className="flex-grow p-4 flex flex-col bg-slate-900">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-blue-400">Deep Blue Editor</h2>
                    {onBack && <button onClick={onBack} className="text-xs text-slate-400 hover:text-white transition-colors">← Back to Menu</button>}
                </div>
                <div className="flex gap-2">
                    <button onClick={handleRun} className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 px-4 rounded flex items-center gap-2 shadow-lg shadow-green-900/20">
                        ▶ Run
                    </button>
                    <button onClick={() => handleAnalyze()} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded flex items-center gap-2 shadow-lg shadow-blue-900/20">
                        🚀 Analyze
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
                placeholder="Write your Python code here..."
            />
          </div>
          
          {/* Output Panel */}
          <div className="h-1/3 bg-black p-4 border-t border-slate-700 font-mono text-sm overflow-auto">
              <div className="flex border-b border-slate-800 mb-2">
                  <button onClick={() => setActiveTab("terminal")} className={`px-4 py-1 text-xs font-bold transition-colors ${activeTab === "terminal" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-500 hover:text-slate-300"}`}>TERMINAL</button>
                  <button onClick={() => setActiveTab("tests")} className={`px-4 py-1 text-xs font-bold transition-colors ${activeTab === "tests" ? "text-green-400 border-b-2 border-green-400" : "text-slate-500 hover:text-slate-300"}`}>TEST RESULTS</button>
              </div>
              
              {activeTab === "terminal" ? (
                  <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
              ) : (
                  <div className="space-y-2">
                      {!testResults && <p className="text-slate-600 italic">Run code to see test results.</p>}
                      {testResults && testResults.map((t, i) => (
                          <div key={i} className={`flex justify-between items-center p-2 rounded border ${t.passed ? 'bg-green-900/20 border-green-900/50' : 'bg-red-900/20 border-red-900/50'}`}>
                              <div className="flex items-center gap-3">
                                <span className={t.passed ? "text-green-500 font-bold" : "text-red-500 font-bold"}>{t.passed ? "✔ PASS" : "CX FAIL"}</span>
                                <span className="text-slate-400 text-xs">In: {t.input}</span>
                              </div>
                              <div className="text-right text-xs">
                                  <div className="text-slate-500">Exp: {t.expected}</div>
                                  {!t.passed && <div className="text-red-400">Got: {t.actual}</div>}
                              </div>
                          </div>
                      ))}
                  </div>
              )}
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
          </div>
        </div>

        {/* RIGHT: Visuals */}
        <div className="flex-1 flex flex-col">
          <div className="h-2/3 bg-black relative border-b border-slate-700 overflow-hidden">
            {/* Paywall Overlay */}
            {!isPremium && (
                <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">3D Logic View Locked</h3>
                    <p className="text-slate-400 mb-4 text-sm">Upgrade to PRO to visualize syntax.</p>
                    <button className="bg-slate-700 text-slate-400 font-bold py-2 px-6 rounded-full cursor-not-allowed opacity-75 border border-slate-600">
                        🔒 Pro Feature
                    </button>
                </div>
            )}
            
            {/* Visualizer */}
            {visualData ? <CodeVisualizer data={visualData} /> : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 flex-col">
                    <div className="text-4xl mb-2 opacity-30">🧊</div>
                    <p className="opacity-50 text-sm">Hit "Analyze" to generate 3D Model</p>
                </div>
            )}
          </div>
          
          {/* AI Feedback */}
          <div className="h-1/3 p-6 bg-slate-900 overflow-auto border-l border-slate-700">
            <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                <span>🧠</span> Socratic AI
            </h3>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed font-medium text-sm">{aiFeedback}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;