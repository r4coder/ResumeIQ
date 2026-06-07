import React from 'react';

const CATEGORY_STYLES = {
  languages: { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.3)', text: '#6366f1', darkText: '#a5b4fc' },
  frameworks: { bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.3)', text: '#7c3aed', darkText: '#c4b5fd' },
  databases: { bg: 'rgba(0, 212, 255, 0.1)', border: 'rgba(0, 212, 255, 0.3)', text: '#0891b2', darkText: '#67e8f9' },
  cloud: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#059669', darkText: '#6ee7b7' },
  tools: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#d97706', darkText: '#fcd34d' },
  softSkills: { bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.3)', text: '#e11d48', darkText: '#fda4af' },
  missing: { bg: 'rgba(244, 63, 94, 0.08)', border: 'rgba(244, 63, 94, 0.25)', text: '#e11d48', darkText: '#fb7185' },
  matched: { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.25)', text: '#059669', darkText: '#34d399' },
};

export function SkillBadge({ skill, category = 'tools', size = 'md', dark = false }) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.tools;

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg font-mono font-medium ${sizes[size]}`}
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: dark ? style.darkText : style.text
      }}>
      {skill}
    </span>
  );
}

export function SkillSection({ title, skills = [], category, icon: Icon, dark = false }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={14} className="text-obsidian-400 dark:text-obsidian-500" />}
        <span className="section-label">{title}</span>
        <span className="ml-auto text-xs font-mono text-obsidian-400 dark:text-obsidian-500 bg-obsidian-100 dark:bg-obsidian-800 px-2 py-0.5 rounded-full">
          {skills.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <SkillBadge key={i} skill={skill} category={category} dark={dark} />
        ))}
      </div>
    </div>
  );
}
