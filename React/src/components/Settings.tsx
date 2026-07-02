import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useGame } from '../context/GameContext';
import { KeyBindings } from '../types';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { keyBindings, setKeyBindings } = useGame();
  const [editingKey, setEditingKey] = useState<keyof KeyBindings | null>(null);
  const [tempBindings, setTempBindings] = useState<KeyBindings>(keyBindings);

  const keyLabels: Record<keyof KeyBindings, string> = {
    moveLeft: 'Move Left',
    moveRight: 'Move Right',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    select: 'Select / Attack',
  };

  const formatKeyDisplay = (key: string): string => {
    if (key === ' ') return 'SPACE';
    if (key === 'arrowup') return '↑';
    if (key === 'arrowdown') return '↓';
    if (key === 'arrowleft') return '←';
    if (key === 'arrowright') return '→';
    return key.toUpperCase();
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!editingKey) return;

    e.preventDefault();
    const newKey = e.key.toLowerCase();

    setTempBindings(prev => ({
      ...prev,
      [editingKey]: newKey,
    }));
    setEditingKey(null);
  }, [editingKey]);

  useEffect(() => {
    if (editingKey) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [editingKey, handleKeyPress]);

  const handleSave = () => {
    setKeyBindings(tempBindings);
    navigate(-1);
  };

  const handleReset = () => {
    const defaultBindings: KeyBindings = {
      moveLeft: 'a',
      moveRight: 'd',
      moveUp: 'w',
      moveDown: 's',
      select: ' ',
    };
    setTempBindings(defaultBindings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-3xl font-bold text-slate-200 mb-8">Settings</h1>

      <div className="w-full max-w-md bg-slate-800/60 rounded-lg border border-slate-600 p-6">
        <h2 className="text-xl font-bold text-slate-200 mb-4">Key Bindings</h2>
        <p className="text-slate-400 text-sm mb-6">
          Click on a key binding to change it, then press the new key.
        </p>

        <div className="space-y-3">
          {(Object.keys(keyLabels) as (keyof KeyBindings)[]).map(key => (
            <div
              key={key}
              className="flex items-center justify-between"
            >
              <span className="text-slate-300">{keyLabels[key]}</span>
              <button
                onClick={() => setEditingKey(key)}
                className={`px-4 py-2 rounded min-w-24 font-mono transition-colors ${
                  editingKey === key
                    ? 'bg-blue-600 text-white animate-pulse'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                {editingKey === key
                  ? 'Press any key...'
                  : formatKeyDisplay(tempBindings[key])}
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Editing Overlay */}
      {editingKey && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setEditingKey(null)}
        />
      )}
    </div>
  );
};

export default Settings;
