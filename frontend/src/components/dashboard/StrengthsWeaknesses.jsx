import React from 'react';
import { ThumbsUp, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';

export function StrengthsCard({ strengths = [] }) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
          <ThumbsUp size={18} className="text-emerald-500" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base text-obsidian-900 dark:text-obsidian-50">Strengths</h3>
          <p className="text-xs text-obsidian-400 dark:text-obsidian-500">{strengths.length} positive highlights</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {strengths.map((strength, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ChevronRight size={11} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm text-obsidian-700 dark:text-obsidian-300 leading-relaxed">{strength}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeaknessesCard({ weaknesses = [] }) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
          <AlertTriangle size={18} className="text-amber-500" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base text-obsidian-900 dark:text-obsidian-50">Areas to Improve</h3>
          <p className="text-xs text-obsidian-400 dark:text-obsidian-500">{weaknesses.length} areas flagged</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {weaknesses.map((weakness, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
            <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle size={10} className="text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm text-obsidian-700 dark:text-obsidian-300 leading-relaxed">{weakness}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecommendationsCard({ recommendations = [] }) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
          <Lightbulb size={18} className="text-violet-500" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base text-obsidian-900 dark:text-obsidian-50">Recommendations</h3>
          <p className="text-xs text-obsidian-400 dark:text-obsidian-500">AI-powered improvement suggestions</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {recommendations.map((rec, i) => (
          <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-violet-50/50 dark:bg-violet-500/5 border border-violet-100 dark:border-violet-500/10">
            <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', color: 'white' }}>
              {i + 1}
            </div>
            <p className="text-sm text-obsidian-700 dark:text-obsidian-300 leading-relaxed">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
