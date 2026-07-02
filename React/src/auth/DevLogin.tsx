import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import { useGame } from '../context/GameContext';
import * as api from '../services/api';

const DevLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setDevAuthenticated } = useGame();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.devLogin(username, password);
      if (result.success) {
        setDevAuthenticated(true);
        navigate('/dev');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <FaLock className="text-2xl text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-200">Dev Mode</h1>
          <p className="text-slate-400 text-sm mt-1">Enter your credentials</p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-800/60 rounded-lg border border-slate-600 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-200 focus:outline-none focus:border-blue-500"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-200 focus:outline-none focus:border-blue-500"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-3 rounded font-bold transition-colors ${
              loading
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DevLogin;
