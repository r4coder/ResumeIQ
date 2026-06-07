import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';
import Navbar from '../components/ui/Navbar.jsx';
import FileUpload from '../components/dashboard/FileUpload.jsx';
import ATSScoreRing from '../components/ui/ATSScoreRing.jsx';
import SkillsSection from '../components/dashboard/SkillsSection.jsx';
import JobMatchCard from '../components/dashboard/JobMatchCard.jsx';
import SummaryCard from '../components/dashboard/SummaryCard.jsx';
import { StrengthsCard, WeaknessesCard, RecommendationsCard } from '../components/dashboard/StrengthsWeaknesses.jsx';
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx';
import { useAnalysis } from '../App.jsx';

export default function DashboardPage() {
  const { analysisData, setAnalysisData, setUploadedFile } = useAnalysis();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async (file, jobRole, jdUrl = '', jdText = '') => {
    setIsLoading(true);
    setError('');
    setAnalysisData(null);
    setUploadedFile(file);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobRole', jobRole);
      if (jdUrl)  formData.append('jdUrl', jdUrl);
      if (jdText) formData.append('jdText', jdText);

      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || 'Analysis failed. Please try again.');
      setAnalysisData(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => { setAnalysisData(null); setUploadedFile(null); setError(''); };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">

        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-obsidian-900 dark:text-obsidian-50">Resume Dashboard</h1>
            <p className="text-obsidian-500 dark:text-obsidian-400 mt-1">Upload your resume and get instant AI-powered analysis</p>
          </div>
          {analysisData && (
            <div className="flex items-center gap-3">
              <button onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-obsidian-100 dark:hover:bg-obsidian-800"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                <RefreshCw size={15} /> New Analysis
              </button>
              <button onClick={() => navigate('/report')} className="btn-primary flex items-center gap-2 text-sm">
                <Download size={15} /> View Report
              </button>
            </div>
          )}
        </div>

        {/* Upload panel */}
        {!analysisData && !isLoading && (
          <div className="max-w-xl mx-auto">
            <FileUpload onAnalyze={handleAnalyze} isLoading={isLoading} />
            {error && (
              <div className="mt-4 flex items-start gap-3 text-rose-600 bg-rose-50 dark:bg-rose-500/10 rounded-xl px-4 py-3 border border-rose-100 dark:border-rose-500/20">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl glass-card">
                <div className="w-5 h-5 border-2 border-violet-400 border-t-violet-600 rounded-full animate-spin" />
                <span className="text-sm font-medium text-obsidian-600 dark:text-obsidian-300">
                  Analyzing your resume with Gemini AI...
                </span>
              </div>
            </div>
            <LoadingSkeleton />
          </div>
        )}

        {/* Results */}
        {analysisData && !isLoading && (
          <div className="space-y-6">
            <SummaryCard data={analysisData} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="glass-card p-6 flex flex-col items-center gap-4">
                <h3 className="font-display font-bold text-lg text-obsidian-900 dark:text-obsidian-50 self-start">ATS Score</h3>
                <ATSScoreRing score={analysisData.atsScore} />
              </div>
              <div className="lg:col-span-2">
                <SkillsSection skills={analysisData.skills} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StrengthsCard strengths={analysisData.strengths} />
              <WeaknessesCard weaknesses={analysisData.weaknesses} />
            </div>

            {/* Job match — passes both role match + JD match */}
            <JobMatchCard
              jobMatch={analysisData.jobMatch}
              missingSkills={analysisData.missingSkills}
              jdMatch={analysisData.jdMatch}
              jdUrl={analysisData.jdUrl}
            />

            <RecommendationsCard recommendations={analysisData.recommendations} />

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button onClick={() => navigate('/report')} className="btn-primary flex items-center gap-2.5 px-8 py-3.5">
                <Download size={17} /> Download Full PDF Report
              </button>
              <button onClick={handleReset}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-medium border transition-all hover:bg-obsidian-100 dark:hover:bg-obsidian-800"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                <RefreshCw size={15} /> Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
