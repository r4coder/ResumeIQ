import React, { useState } from 'react';
import { Code, Layers, Database, Cloud, Wrench, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { SkillSection } from '../ui/SkillBadge.jsx';

const CATEGORIES = [
  { key: 'languages', label: 'Programming Languages', icon: Code, color: '#6366f1' },
  { key: 'frameworks', label: 'Frameworks & Libraries', icon: Layers, color: '#7c3aed' },
  { key: 'databases', label: 'Databases', icon: Database, color: '#0891b2' },
  { key: 'cloud', label: 'Cloud & Infrastructure', icon: Cloud, color: '#059669' },
  { key: 'tools', label: 'Tools & Platforms', icon: Wrench, color: '#d97706' },
  { key: 'softSkills', label: 'Soft Skills', icon: Heart, color: '#e11d48' },
];

function SkillsChart({ skills }) {
  const totalSkills = Object.values(skills).flat().length;
  const categories = CATEGORIES.map(cat => ({
    ...cat,
    count: (skills[cat.key] || []).length,
    pct: totalSkills > 0 ? Math.round(((skills[cat.key] || []).length / totalSkills) * 100) : 0
  })).filter(c => c.count > 0);

  return (
    <div className="space-y-2">
      {categories.map(cat => (
        <div key={cat.key} className="flex items-center gap-3">
          <div className="w-24 text-right">
            <span className="text-xs text-obsidian-400 dark:text-obsidian-500 font-medium">{cat.label.split(' ')[0]}</span>
          </div>
          <div className="flex-1 h-5 bg-obsidian-100 dark:bg-obsidian-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
              style={{
                width: `${Math.max(cat.pct, 5)}%`,
                background: cat.color,
                minWidth: cat.count > 0 ? '40px' : '0'
              }}
            >
              <span className="text-xs text-white font-mono font-bold">{cat.count}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-between text-xs text-obsidian-400 dark:text-obsidian-500 pt-1">
        <span>{totalSkills} total skills detected</span>
        <span>{categories.length} categories</span>
      </div>
    </div>
  );
}

export default function SkillsSection({ skills }) {
  const [showChart, setShowChart] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);

  if (!skills) return null;
  const totalSkills = Object.values(skills).flat().length;

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display font-bold text-lg text-obsidian-900 dark:text-obsidian-50">Extracted Skills</h3>
          <p className="text-sm text-obsidian-500 dark:text-obsidian-400 mt-0.5">
            <span className="font-semibold text-violet-500">{totalSkills}</span> skills detected from your resume
          </p>
        </div>
        <button
          onClick={() => setShowChart(v => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-obsidian-500 dark:text-obsidian-400 hover:text-violet-500 transition-colors bg-obsidian-100 dark:bg-obsidian-800 px-3 py-1.5 rounded-lg"
        >
          {showChart ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {showChart ? 'Hide Chart' : 'View Chart'}
        </button>
      </div>

      {showChart && (
        <div className="p-4 rounded-xl bg-obsidian-50 dark:bg-obsidian-800/50">
          <SkillsChart skills={skills} />
        </div>
      )}

      {/* Skill categories */}
      <div className="space-y-4">
        {CATEGORIES.map(cat => {
          const catSkills = skills[cat.key] || [];
          if (catSkills.length === 0) return null;
          return (
            <div key={cat.key}>
              <SkillSection
                title={cat.label}
                skills={catSkills}
                category={cat.key}
                icon={cat.icon}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
