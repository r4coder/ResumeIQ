import React from 'react';
import { User, Calendar, FileText } from 'lucide-react';

export default function SummaryCard({ data }) {
  if (!data) return null;
  const { summary, fileName, fileSize, analyzedAt, atsScore } = data;

  const formattedDate = analyzedAt
    ? new Date(analyzedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '';

  const fileSizeKB = fileSize ? (fileSize / 1024).toFixed(1) : '—';

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed22, #6366f122)' }}>
            <User size={22} className="text-violet-500" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-obsidian-900 dark:text-obsidian-50">Candidate Summary</h3>
            <div className="flex items-center gap-3 mt-0.5">
              {fileName && (
                <span className="flex items-center gap-1.5 text-xs text-obsidian-400 dark:text-obsidian-500">
                  <FileText size={11} />
                  {fileName} ({fileSizeKB} KB)
                </span>
              )}
              {formattedDate && (
                <span className="flex items-center gap-1.5 text-xs text-obsidian-400 dark:text-obsidian-500">
                  <Calendar size={11} />
                  {formattedDate}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 text-center px-4 py-2 rounded-xl"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(99,102,241,0.1))' }}>
          <div className="font-display font-bold text-2xl text-gradient-violet">{atsScore}</div>
          <div className="text-xs text-obsidian-400 dark:text-obsidian-500 font-medium">ATS</div>
        </div>
      </div>

      <p className="text-sm text-obsidian-600 dark:text-obsidian-300 leading-relaxed">{summary}</p>
    </div>
  );
}
