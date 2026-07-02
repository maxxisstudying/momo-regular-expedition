import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../context/GameContext';

interface AttackMeterProps {
  onComplete: (multiplier: number) => void;
  baseAttack: number;
}

const AttackMeter: React.FC<AttackMeterProps> = ({ onComplete, baseAttack }) => {
  const { keyBindings } = useGame();
  const [position, setPosition] = useState(0); // 0-100
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [stopped, setStopped] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Zone definitions (percentage positions)
  // Total width = 100
  // Layout: [0-15: 0.2x] [15-30: 0.33x] [30-40: 1x] [40-46: 1.2x] [46-48: 1.7x] [48-49: 3x] [49-51: 5x] [51-52: 3x] [52-54: 1.7x] [54-60: 1.2x] [60-70: 1x] [70-85: 0.33x] [85-100: 0.2x]
  const zones = [
    { start: 0, end: 15, multiplier: 0.2, color: 'bg-slate-600', label: '/5' },
    { start: 15, end: 30, multiplier: 0.33, color: 'bg-slate-500', label: '/3' },
    { start: 30, end: 40, multiplier: 1, color: 'bg-blue-600', label: '1x' },
    { start: 40, end: 46, multiplier: 1.2, color: 'bg-green-600', label: '1.2x' },
    { start: 46, end: 48, multiplier: 1.7, color: 'bg-yellow-600', label: '1.7x' },
    { start: 48, end: 49, multiplier: 3, color: 'bg-orange-500', label: '3x' },
    { start: 49, end: 51, multiplier: 5, color: 'bg-red-500', label: '5x' },
    { start: 51, end: 52, multiplier: 3, color: 'bg-orange-500', label: '3x' },
    { start: 52, end: 54, multiplier: 1.7, color: 'bg-yellow-600', label: '1.7x' },
    { start: 54, end: 60, multiplier: 1.2, color: 'bg-green-600', label: '1.2x' },
    { start: 60, end: 70, multiplier: 1, color: 'bg-blue-600', label: '1x' },
    { start: 70, end: 85, multiplier: 0.33, color: 'bg-slate-500', label: '/3' },
    { start: 85, end: 100, multiplier: 0.2, color: 'bg-slate-600', label: '/5' },
  ];

  const getMultiplier = (pos: number): number => {
    for (const zone of zones) {
      if (pos >= zone.start && pos < zone.end) {
        return zone.multiplier;
      }
    }
    return 1;
  };

  const animate = useCallback((timestamp: number) => {
    if (stopped) return;

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    const speed = 0.15; // Adjust for difficulty
    const movement = speed * delta;

    setPosition(prev => {
      let newPos = prev + direction * movement;
      
      // Bounce at edges
      if (newPos >= 100) {
        newPos = 100;
        setDirection(-1);
      } else if (newPos <= 0) {
        newPos = 0;
        setDirection(1);
      }
      
      return newPos;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [direction, stopped]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const handleStop = useCallback(() => {
    if (stopped) return;
    
    setStopped(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const multiplier = getMultiplier(position);
    setTimeout(() => onComplete(multiplier), 300);
  }, [position, stopped, onComplete]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === keyBindings.select || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleStop();
    }
  }, [keyBindings, handleStop]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const currentMultiplier = getMultiplier(position);
  const estimatedDamage = Math.round(baseAttack * currentMultiplier);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-600 p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold text-slate-200 text-center mb-4">Attack!</h3>
        <p className="text-center text-slate-400 mb-4">
          Press {keyBindings.select === ' ' ? 'SPACE' : keyBindings.select.toUpperCase()} or click to attack!
        </p>

        {/* Damage meter visualization */}
        <div className="relative h-12 rounded-lg overflow-hidden mb-4 border border-slate-600">
          {/* Zone backgrounds */}
          <div className="absolute inset-0 flex">
            {zones.map((zone, i) => (
              <div
                key={i}
                className={`${zone.color} relative`}
                style={{ width: `${zone.end - zone.start}%` }}
              >
                {zone.multiplier >= 1 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white/70">
                    {zone.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Moving indicator */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg shadow-white/50 transition-none"
            style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
          />
        </div>

        {/* Current multiplier display */}
        <div className="text-center mb-4">
          <p className="text-2xl font-bold" style={{
            color: currentMultiplier >= 3 ? '#ef4444' :
                   currentMultiplier >= 1.5 ? '#f59e0b' :
                   currentMultiplier >= 1 ? '#22c55e' : '#64748b'
          }}>
            {currentMultiplier}x
          </p>
          <p className="text-slate-400">Est. Damage: {estimatedDamage}</p>
        </div>

        {/* Click to attack button */}
        <button
          onClick={handleStop}
          disabled={stopped}
          className={`w-full py-3 rounded-lg font-bold transition-colors ${
            stopped
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-500 text-white'
          }`}
        >
          {stopped ? 'Attacking...' : 'ATTACK!'}
        </button>
      </div>
    </div>
  );
};

export default AttackMeter;
