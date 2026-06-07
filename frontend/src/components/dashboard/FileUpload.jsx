import React, { useRef, useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Link2, BarChart2, Loader2, Eye, EyeOff } from 'lucide-react';

const JOB_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Engineer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'DevOps Engineer',
  'Cloud Engineer',
];

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function isValidUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}

export default function FileUpload({ onAnalyze, isLoading }) {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');

  // JD mode
  const [matchMode, setMatchMode] = useState('role'); // 'role' | 'jd'
  const [jdUrl, setJdUrl] = useState('');
  const [jdText, setJdText] = useState('');
  const [jdPreview, setJdPreview] = useState('');
  const [jdFetchStatus, setJdFetchStatus] = useState('idle'); // idle | loading | success | error
  const [jdError, setJdError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const inputRef = useRef();

  const handleFile = useCallback((f) => {
    setFileError('');
    if (!f) return;
    if (f.type !== 'application/pdf') { setFileError('Please upload a PDF file only.'); return; }
    if (f.size > 10 * 1024 * 1024) { setFileError('File size must be under 10MB.'); return; }
    setFile(f);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const switchMode = (mode) => {
    setMatchMode(mode);
    setJdError('');
    setJdFetchStatus('idle');
    setJdText('');
    setJdPreview('');
    setShowPreview(false);
  };

  const handleFetchJD = async () => {
    const url = jdUrl.trim();
    if (!url) { setJdError('Please enter a URL.'); return; }
    if (!isValidUrl(url)) { setJdError('Enter a valid URL starting with https://'); return; }

    setJdFetchStatus('loading');
    setJdError('');
    setJdText('');
    setJdPreview('');

    try {
      const res = await fetch('/api/scrape-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to fetch job description.');
      setJdText(json.jdText);
      setJdPreview(json.jdText.slice(0, 400));
      setJdFetchStatus('success');
    } catch (err) {
      setJdError(err.message);
      setJdFetchStatus('error');
    }
  };

  const handleSubmit = () => {
    if (!file) { setFileError('Please select a PDF file.'); return; }
    if (matchMode === 'jd' && !jdText) { setJdError('Please fetch the job description first.'); return; }
    onAnalyze(
      file,
      jobRole,
      matchMode === 'jd' ? jdUrl : '',
      matchMode === 'jd' ? jdText : ''
    );
  };

  const canSubmit = file && !isLoading && (matchMode === 'role' || (matchMode === 'jd' && jdText));

  return (
    <div className="glass-card p-6 space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl text-obsidian-900 dark:text-obsidian-50">Upload Resume</h2>
        <p className="text-sm text-obsidian-500 dark:text-obsidian-400 mt-1">Upload your PDF resume for AI-powered analysis</p>
      </div>

      {/* ── Drop zone ───────────────────────────────────────────────── */}
      <div
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
            : file
              ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
              : 'border-obsidian-200 dark:border-obsidian-700 hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-500/5'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden"
          onChange={(e) => handleFile(e.target.files[0])} />

        <div className="p-7 flex flex-col items-center gap-3">
          {file ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle size={24} className="text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-obsidian-800 dark:text-obsidian-100 truncate max-w-xs">{file.name}</p>
                <p className="text-sm text-obsidian-500 dark:text-obsidian-400">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setFileError(''); }}
                className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-medium">
                <X size={13} /> Remove file
              </button>
            </>
          ) : (
            <>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                dragActive ? 'bg-violet-100 dark:bg-violet-500/20' : 'bg-obsidian-100 dark:bg-obsidian-800'
              }`}>
                <Upload size={24} className={dragActive ? 'text-violet-500' : 'text-obsidian-400 dark:text-obsidian-500'} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-obsidian-700 dark:text-obsidian-200">
                  {dragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                </p>
                <p className="text-sm text-obsidian-400 dark:text-obsidian-500 mt-1">
                  or <span className="text-violet-500 underline">browse to upload</span>
                </p>
                <p className="text-xs text-obsidian-400 dark:text-obsidian-600 mt-1.5">PDF only · Max 10MB</p>
              </div>
            </>
          )}
        </div>
      </div>

      {fileError && (
        <div className="flex items-center gap-2 text-rose-500 text-sm bg-rose-50 dark:bg-rose-500/10 rounded-xl px-4 py-3">
          <AlertCircle size={15} /><span>{fileError}</span>
        </div>
      )}

      {/* ── Mode toggle: Job Role | JD URL ──────────────────────────── */}
      <div>
        <p className="section-label mb-2">Match Against</p>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-obsidian-100 dark:bg-obsidian-800">
          <button
            type="button"
            onClick={() => switchMode('role')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              matchMode === 'role'
                ? 'bg-white dark:bg-obsidian-700 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-obsidian-500 dark:text-obsidian-400 hover:text-obsidian-800 dark:hover:text-obsidian-100'
            }`}>
            <BarChart2 size={15} />
            Job Role
          </button>
          <button
            type="button"
            onClick={() => switchMode('jd')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              matchMode === 'jd'
                ? 'bg-white dark:bg-obsidian-700 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-obsidian-500 dark:text-obsidian-400 hover:text-obsidian-800 dark:hover:text-obsidian-100'
            }`}>
            <Link2 size={15} />
            JD URL
          </button>
        </div>
      </div>

      {/* ── Job Role selector ───────────────────────────────────────── */}
      {matchMode === 'role' && (
        <div>
          <label className="block section-label mb-2">Target Job Role</label>
          <select
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <p className="text-xs text-obsidian-400 dark:text-obsidian-500 mt-1.5">
            Match against a predefined skill set for this role
          </p>
        </div>
      )}

      {/* ── JD URL input ────────────────────────────────────────────── */}
      {matchMode === 'jd' && (
        <div className="space-y-3">
          <label className="block section-label">Job Description URL</label>

          <div className="flex gap-2">
            <div className="relative flex-1 min-w-0">
              <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 pointer-events-none" />
              <input
                type="url"
                placeholder="https://linkedin.com/jobs/view/..."
                value={jdUrl}
                onChange={(e) => { setJdUrl(e.target.value); setJdError(''); setJdFetchStatus('idle'); }}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchJD()}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <button
              type="button"
              onClick={handleFetchJD}
              disabled={jdFetchStatus === 'loading' || !jdUrl.trim()}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
            >
              {jdFetchStatus === 'loading'
                ? <><Loader2 size={14} className="animate-spin" /> Fetching</>
                : 'Fetch JD'
              }
            </button>
          </div>

          <p className="text-xs text-obsidian-400 dark:text-obsidian-500">
            Supports LinkedIn, Indeed, Naukri, Glassdoor, company sites & more
          </p>

          {jdError && (
            <div className="flex items-start gap-2 text-rose-500 text-xs bg-rose-50 dark:bg-rose-500/10 rounded-xl px-3 py-2.5 border border-rose-100 dark:border-rose-500/20">
              <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
              <span>{jdError}</span>
            </div>
          )}

          {jdFetchStatus === 'success' && (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(16,185,129,0.35)' }}>
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2">
                  <CheckCircle size={13} className="text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    JD fetched · {jdText.length.toLocaleString()} chars
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreview(v => !v)}
                  className="flex items-center gap-1 text-xs text-obsidian-400 hover:text-obsidian-600 dark:hover:text-obsidian-200 transition-colors"
                >
                  {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showPreview ? 'Hide' : 'Preview'}
                </button>
              </div>
              {showPreview && (
                <div className="p-3 max-h-28 overflow-y-auto bg-obsidian-50 dark:bg-obsidian-900/50">
                  <p className="text-xs text-obsidian-600 dark:text-obsidian-400 leading-relaxed whitespace-pre-wrap font-mono">
                    {jdPreview}…
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Analyze button ──────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full btn-primary flex items-center justify-center gap-2.5 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Analyzing with AI...
          </>
        ) : (
          <>
            <FileText size={17} />
            {matchMode === 'jd' ? 'Analyze Against JD' : 'Analyze Resume'}
          </>
        )}
      </button>
    </div>
  );
}