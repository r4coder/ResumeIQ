import React, { useState } from 'react';
import { Target, CheckCircle, AlertTriangle, ExternalLink, Briefcase, GraduationCap, ChevronDown, ChevronUp, ListChecks } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { SkillBadge } from '../ui/SkillBadge.jsx';

function getMatchColor(pct) {
  if (pct >= 80) return '#10b981';
  if (pct >= 60) return '#6366f1';
  if (pct >= 40) return '#f59e0b';
  return '#f43f5e';
}

function MatchDonut({ pct }) {
  const color = getMatchColor(pct);
  const data = [{ value: pct, fill: color }];
  return (
    <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="68%" outerRadius="100%"
          data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'rgba(124,58,237,0.07)' }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-xl leading-none" style={{ color }}>{pct}%</span>
        <span className="text-xs text-obsidian-400 dark:text-obsidian-500 mt-0.5">match</span>
      </div>
    </div>
  );
}

function MatchBlock({ label, value, color, bg }) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: bg }}>
      <div className="font-display font-bold text-xl leading-none" style={{ color }}>{value}</div>
      <div className="text-xs text-obsidian-500 dark:text-obsidian-400 mt-1 leading-tight">{label}</div>
    </div>
  );
}

// ── Role-based match panel ────────────────────────────────────────────────────
function RoleMatchPanel({ jobMatch, missingSkills }) {
  const { role, matchPercentage, matchedSkills = [], totalRequired = 0 } = jobMatch;
  const matchLabel = matchPercentage >= 80 ? 'Strong Match' : matchPercentage >= 60 ? 'Good Match' : matchPercentage >= 40 ? 'Partial Match' : 'Low Match';
  const color = getMatchColor(matchPercentage);

  return (
    <div className="space-y-5">
      {/* Score row */}
      <div className="flex items-center gap-5">
        <MatchDonut pct={matchPercentage} />
        <div className="flex-1 space-y-3 min-w-0">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold" style={{ color }}>{matchLabel}</span>
              <span className="text-xs text-obsidian-400 dark:text-obsidian-500 font-mono">{matchedSkills.length}/{totalRequired} skills</span>
            </div>
            <div className="h-2 rounded-full bg-obsidian-100 dark:bg-obsidian-800 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${matchPercentage}%`, background: color }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <MatchBlock label="Matched" value={matchedSkills.length}
              color="#10b981" bg="rgba(16,185,129,0.08)" />
            <MatchBlock label="Missing" value={missingSkills.length}
              color="#f43f5e" bg="rgba(244,63,94,0.08)" />
          </div>
        </div>
      </div>

      {/* Matched */}
      {matchedSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={12} className="text-emerald-500" />
            <span className="section-label">Matched Skills</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.slice(0, 10).map((s, i) => <SkillBadge key={i} skill={s} category="matched" />)}
            {matchedSkills.length > 10 && <span className="text-xs text-obsidian-400 self-center">+{matchedSkills.length - 10} more</span>}
          </div>
        </div>
      )}

      {/* Missing */}
      {missingSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={12} className="text-amber-500" />
            <span className="section-label">Missing Skills</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.slice(0, 12).map((s, i) => <SkillBadge key={i} skill={s} category="missing" />)}
            {missingSkills.length > 12 && <span className="text-xs text-obsidian-400 self-center">+{missingSkills.length - 12} more</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── JD-based match panel ──────────────────────────────────────────────────────
function JDMatchPanel({ jdMatch, jdUrl }) {
  const [showResponsibilities, setShowResponsibilities] = useState(false);
  const { matchPercentage, matchedKeywords = [], missingKeywords = [],
    jdTitle, jdCompany, experienceRequired, educationRequired, keyResponsibilities = [] } = jdMatch;
  const color = getMatchColor(matchPercentage);
  const matchLabel = matchPercentage >= 80 ? 'Strong Match' : matchPercentage >= 60 ? 'Good Match' : matchPercentage >= 40 ? 'Partial Match' : 'Low Match';

  return (
    <div className="space-y-5">
      {/* JD info */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-violet-50/60 dark:bg-violet-500/8 border border-violet-100 dark:border-violet-500/15">
        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Briefcase size={14} className="text-violet-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-obsidian-800 dark:text-obsidian-100 truncate">
            {jdTitle || 'Job Description'}
          </p>
          {jdCompany && <p className="text-xs text-obsidian-500 dark:text-obsidian-400">{jdCompany}</p>}
          <div className="flex flex-wrap gap-3 mt-1.5">
            {experienceRequired && (
              <span className="text-xs text-obsidian-500 dark:text-obsidian-400 flex items-center gap-1">
                <span className="font-medium text-obsidian-700 dark:text-obsidian-200">Exp:</span> {experienceRequired}
              </span>
            )}
            {educationRequired && (
              <span className="text-xs text-obsidian-500 dark:text-obsidian-400 flex items-center gap-1">
                <GraduationCap size={11} /> {educationRequired}
              </span>
            )}
          </div>
        </div>
        {jdUrl && (
          <a href={jdUrl} target="_blank" rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-600 flex-shrink-0" title="View original JD">
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Score row */}
      <div className="flex items-center gap-5">
        <MatchDonut pct={matchPercentage} />
        <div className="flex-1 space-y-3 min-w-0">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold" style={{ color }}>{matchLabel}</span>
              <span className="text-xs text-obsidian-400 dark:text-obsidian-500 font-mono">
                {matchedKeywords.length}/{matchedKeywords.length + missingKeywords.length} keywords
              </span>
            </div>
            <div className="h-2 rounded-full bg-obsidian-100 dark:bg-obsidian-800 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${matchPercentage}%`, background: color }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <MatchBlock label="Matched" value={matchedKeywords.length}
              color="#10b981" bg="rgba(16,185,129,0.08)" />
            <MatchBlock label="Missing" value={missingKeywords.length}
              color="#f43f5e" bg="rgba(244,63,94,0.08)" />
          </div>
        </div>
      </div>

      {/* Key responsibilities toggle */}
      {keyResponsibilities.length > 0 && (
        <div>
          <button
            onClick={() => setShowResponsibilities(v => !v)}
            className="flex items-center gap-2 text-xs font-semibold text-obsidian-500 dark:text-obsidian-400 hover:text-violet-500 transition-colors mb-2">
            <ListChecks size={13} />
            Key Responsibilities from JD
            {showResponsibilities ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showResponsibilities && (
            <ul className="space-y-1.5 pl-1">
              {keyResponsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-obsidian-600 dark:text-obsidian-300">
                  <span className="w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Matched keywords */}
      {matchedKeywords.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={12} className="text-emerald-500" />
            <span className="section-label">Keywords Found in Resume</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedKeywords.slice(0, 12).map((s, i) => <SkillBadge key={i} skill={s} category="matched" />)}
            {matchedKeywords.length > 12 && <span className="text-xs text-obsidian-400 self-center">+{matchedKeywords.length - 12} more</span>}
          </div>
        </div>
      )}

      {/* Missing keywords */}
      {missingKeywords.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={12} className="text-rose-500" />
            <span className="section-label">Missing JD Keywords</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.slice(0, 12).map((s, i) => <SkillBadge key={i} skill={s} category="missing" />)}
            {missingKeywords.length > 12 && <span className="text-xs text-obsidian-400 self-center">+{missingKeywords.length - 12} more</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function JobMatchCard({ jobMatch, missingSkills = [], jdMatch, jdUrl }) {
  const hasJD = jdMatch && jdMatch.matchPercentage != null;
  const [activeTab, setActiveTab] = useState(hasJD ? 'jd' : 'role');

  if (!jobMatch && !jdMatch) return null;

  return (
    <div className="glass-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display font-bold text-lg text-obsidian-900 dark:text-obsidian-50">Job Match</h3>
          <p className="text-sm text-obsidian-500 dark:text-obsidian-400 mt-0.5">
            {hasJD && activeTab === 'jd'
              ? 'Matched against your Job Description URL'
              : `Compatibility for ${jobMatch?.role || ''}`}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center flex-shrink-0">
          <Target size={18} className="text-violet-500" />
        </div>
      </div>

      {/* Tab switcher — only show if both exist */}
      {hasJD && jobMatch && (
        <div className="flex items-center gap-1 p-1 rounded-xl bg-obsidian-100 dark:bg-obsidian-800/80 w-fit">
          {[
            { key: 'jd', label: 'JD URL Match' },
            { key: 'role', label: 'Role Match' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-obsidian-700 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-obsidian-500 dark:text-obsidian-400 hover:text-obsidian-700'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Panel */}
      {activeTab === 'jd' && hasJD
        ? <JDMatchPanel jdMatch={jdMatch} jdUrl={jdUrl} />
        : <RoleMatchPanel jobMatch={jobMatch} missingSkills={missingSkills} />
      }
    </div>
  );
}
