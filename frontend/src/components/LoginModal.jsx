import React, { useState } from 'react';
import axios from 'axios';

const LoginModal = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
        setError('Please enter both username and password.');
        return;
    }

    setLoading(true);
    setError('');

    try {
      // Changed to POST body for security
      const response = await axios.post(`http://127.0.0.1:8000/register`, {
          username: username,
          password: password
      });
      
      // Pass the user data back to App.jsx
      onLogin({
        id: response.data.user_id,
        username: username,
        is_premium: response.data.is_premium
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
          setError('Incorrect password. Please try again.');
      } else {
          setError('Connection failed or server error.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="bg-slate-800 p-8 rounded-2xl border border-blue-500/30 shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            DEEP BLUE
          </h1>
          <p className="text-slate-400 mt-2">Identify yourself, Commander.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-600"
              placeholder="Enter callsign..."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-600"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${
              loading 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
            }`}
          >
            {loading ? 'Authenticating...' : 'INITIALIZE SYSTEM'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;