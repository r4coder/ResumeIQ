import React, { useEffect, useRef, useState } from 'react';

function getScoreCategory(score) {
  if (score >= 90) return { label: 'Excellent', color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' };
  if (score >= 75) return { label: 'Good', color: '#6366f1', bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400' };
  if (score >= 60) return { label: 'Average', color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' };
  return { label: 'Needs Work', color: '#f43f5e', bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400' };
}

export default function ATSScoreRing({ score = 0, size = 180, animate = true }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const category = getScoreCategory(score);

  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      setProgress(score);
      return;
    }

    let start = null;
    const duration = 1500;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const pct = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setDisplayScore(Math.round(eased * score));
      setProgress(eased * score);
      if (pct < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score, animate]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="drop-shadow-lg">
          {/* Background ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            strokeWidth="12"
            stroke="currentColor"
            className="text-obsidian-100 dark:text-obsidian-800"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            strokeWidth="12"
            stroke={category.color}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              transition: 'stroke-dashoffset 0.05s linear',
              filter: `drop-shadow(0 0 8px ${category.color}66)`
            }}
          />
          {/* Glow ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            strokeWidth="20"
            stroke={category.color}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              transition: 'stroke-dashoffset 0.05s linear',
              opacity: 0.15
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold leading-none" style={{ fontSize: size * 0.22, color: category.color }}>
            {displayScore}
          </span>
          <span className="text-xs font-semibold text-obsidian-400 dark:text-obsidian-500 uppercase tracking-wider mt-1">ATS Score</span>
        </div>
      </div>

      {/* Category badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${category.bg}`}>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }}></div>
        <span className={`text-sm font-semibold ${category.text}`}>{category.label}</span>
      </div>

      {/* Scale indicators */}
      <div className="grid grid-cols-4 gap-1.5 w-full">
        {[
          { range: '90-100', label: 'Excellent', color: '#10b981', active: score >= 90 },
          { range: '75-89', label: 'Good', color: '#6366f1', active: score >= 75 && score < 90 },
          { range: '60-74', label: 'Average', color: '#f59e0b', active: score >= 60 && score < 75 },
          { range: '<60', label: 'Needs Work', color: '#f43f5e', active: score < 60 },
        ].map(item => (
          <div key={item.range}
            className={`rounded-lg p-2 text-center transition-all ${item.active ? 'ring-1 scale-105' : 'opacity-50'}`}
            style={{
              background: item.active ? `${item.color}15` : undefined,
              ringColor: item.active ? item.color : undefined,
              borderColor: item.active ? item.color : undefined,
              border: item.active ? `1px solid ${item.color}40` : '1px solid transparent'
            }}>
            <div className="text-xs font-mono font-medium" style={{ color: item.color }}>{item.range}</div>
            <div className="text-xs text-obsidian-400 dark:text-obsidian-500 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
