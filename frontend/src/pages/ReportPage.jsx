import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Printer, CheckCircle, AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react';
import Navbar from '../components/ui/Navbar.jsx';
import ATSScoreRing from '../components/ui/ATSScoreRing.jsx';
import { SkillBadge } from '../components/ui/SkillBadge.jsx';
import { useAnalysis } from '../App.jsx';

const SKILL_CATEGORIES = [
  { key: 'languages', label: 'Languages' },
  { key: 'frameworks', label: 'Frameworks' },
  { key: 'databases', label: 'Databases' },
  { key: 'cloud', label: 'Cloud' },
  { key: 'tools', label: 'Tools' },
  { key: 'softSkills', label: 'Soft Skills' },
];

export default function ReportPage() {
  const { analysisData } = useAnalysis();
  const navigate = useNavigate();
  const reportRef = useRef();
  const [downloading, setDownloading] = useState(false);

  if (!analysisData) return null;

  const { atsScore, summary, strengths = [], weaknesses = [], skills = {}, missingSkills = [], jobMatch, recommendations = [], fileName, analyzedAt } = analysisData;

  const formattedDate = analyzedAt
    ? new Date(analyzedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentW = pageW - margin * 2;
      let y = margin;

      const newPage = () => {
        doc.addPage();
        y = margin;
      };

      const checkY = (needed = 20) => { if (y + needed > pageH - margin) newPage(); };

      // Header background
      doc.setFillColor(26, 12, 64);
      doc.rect(0, 0, pageW, 50, 'F');

      // Gradient bar
      for (let i = 0; i < contentW; i++) {
        const t = i / contentW;
        const r = Math.round(124 + (99 - 124) * t);
        const g = Math.round(58 + (102 - 58) * t);
        const b = Math.round(237 + (241 - 237) * t);
        doc.setFillColor(r, g, b);
        doc.rect(margin + i, 46, 1, 3, 'F');
      }

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('ResumeIQ Analysis Report', margin, 22);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(180, 160, 255);
      doc.text(`${fileName || 'Resume'} · Analyzed on ${formattedDate}`, margin, 32);

      // ATS Score badge
      doc.setFillColor(124, 58, 237);
      doc.roundedRect(pageW - margin - 40, 10, 40, 30, 4, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(String(atsScore), pageW - margin - 20, 24, { align: 'center' });
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('ATS SCORE', pageW - margin - 20, 32, { align: 'center' });

      y = 58;

      // Summary section
      const addSection = (title, color = [124, 58, 237]) => {
        checkY(16);
        doc.setFillColor(...color);
        doc.rect(margin, y, 3, 10, 'F');
        doc.setTextColor(...color);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin + 6, y + 7);
        y += 14;
      };

      const addText = (text, indent = 0) => {
        doc.setTextColor(60, 60, 80);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(text, contentW - indent);
        checkY(lines.length * 5 + 4);
        doc.text(lines, margin + indent, y);
        y += lines.length * 5 + 3;
      };

      const addBullet = (text, bulletColor = [124, 58, 237]) => {
        checkY(12);
        doc.setFillColor(...bulletColor);
        doc.circle(margin + 2.5, y - 1, 1.5, 'F');
        doc.setTextColor(60, 60, 80);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(text, contentW - 10);
        doc.text(lines, margin + 7, y);
        y += lines.length * 5 + 2;
      };

      // Summary
      addSection('Candidate Summary');
      addText(summary);
      y += 4;

      // Score breakdown
      addSection('ATS Score Breakdown', [99, 102, 241]);
      const scoreLabel = atsScore >= 90 ? 'Excellent' : atsScore >= 75 ? 'Good' : atsScore >= 60 ? 'Average' : 'Needs Improvement';
      const scoreColor = atsScore >= 90 ? [16, 185, 129] : atsScore >= 75 ? [99, 102, 241] : atsScore >= 60 ? [245, 158, 11] : [244, 63, 94];

      doc.setFillColor(245, 243, 255);
      doc.roundedRect(margin, y, contentW, 16, 3, 3, 'F');
      doc.setFillColor(...scoreColor);
      doc.roundedRect(margin, y, contentW * (atsScore / 100), 16, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${atsScore}/100 — ${scoreLabel}`, margin + 6, y + 10);
      y += 22;

      // Strengths
      addSection('Strengths', [16, 185, 129]);
      strengths.forEach(s => addBullet(s, [16, 185, 129]));
      y += 4;

      // Weaknesses
      addSection('Areas for Improvement', [245, 158, 11]);
      weaknesses.forEach(w => addBullet(w, [245, 158, 11]));
      y += 4;

      // Skills
      addSection('Extracted Skills');
      SKILL_CATEGORIES.forEach(cat => {
        const catSkills = skills[cat.key] || [];
        if (catSkills.length === 0) return;
        checkY(12);
        doc.setTextColor(124, 58, 237);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`${cat.label}:`, margin, y);
        doc.setTextColor(50, 50, 70);
        doc.setFont('helvetica', 'normal');
        const skillText = catSkills.join(' · ');
        const lines = doc.splitTextToSize(skillText, contentW - 30);
        doc.text(lines, margin + 28, y);
        y += Math.max(6, lines.length * 5);
      });
      y += 4;

      // Job match
      if (jobMatch) {
        addSection('Job Role Match', [5, 150, 105]);
        doc.setFillColor(240, 253, 250);
        doc.roundedRect(margin, y, contentW, 18, 3, 3, 'F');
        doc.setTextColor(5, 150, 105);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${jobMatch.role}: ${jobMatch.matchPercentage}% Match`, margin + 6, y + 8);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 80, 70);
        doc.text(`${jobMatch.matchedSkills?.length || 0} skills matched out of ${jobMatch.totalRequired || 0} required`, margin + 6, y + 14);
        y += 24;

        if (missingSkills.length > 0) {
          doc.setTextColor(100, 60, 60);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          checkY(8);
          doc.text('Missing Skills:', margin, y);
          y += 6;
          addText(missingSkills.join(', '));
        }
      }
      y += 4;

      // Recommendations
      addSection('AI Recommendations', [225, 29, 72]);
      recommendations.forEach((rec, i) => {
        checkY(14);
        doc.setFillColor(254, 242, 242);
        const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, contentW - 4);
        doc.roundedRect(margin, y - 4, contentW, lines.length * 5 + 6, 2, 2, 'F');
        doc.setTextColor(100, 30, 50);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.text(lines, margin + 3, y);
        y += lines.length * 5 + 8;
      });

      // Footer on each page
      const pageCount = doc.internal.getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);
        doc.setFillColor(245, 243, 255);
        doc.rect(0, pageH - 10, pageW, 10, 'F');
        doc.setTextColor(124, 58, 237);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('Generated by ResumeIQ · Powered by Gemini AI', margin, pageH - 3.5);
        doc.text(`Page ${p} of ${pageCount}`, pageW - margin, pageH - 3.5, { align: 'right' });
      }

      doc.save(`ResumeIQ_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const allSkills = Object.values(skills).flat();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-xl flex items-center justify-center border hover:bg-obsidian-100 dark:hover:bg-obsidian-800 transition-colors"
              style={{ borderColor: 'var(--border-color)' }}>
              <ArrowLeft size={17} />
            </button>
            <div>
              <h1 className="font-display font-bold text-2xl text-obsidian-900 dark:text-obsidian-50">Analysis Report</h1>
              <p className="text-sm text-obsidian-500 dark:text-obsidian-400">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-obsidian-100 dark:hover:bg-obsidian-800"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              <Printer size={15} />
              Print
            </button>
            <button onClick={handleDownloadPDF} disabled={downloading}
              className="btn-primary flex items-center gap-2 text-sm disabled:opacity-70">
              {downloading
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Generating...</>
                : <><Download size={15} />Download PDF</>
              }
            </button>
          </div>
        </div>

        {/* Report content */}
        <div ref={reportRef} className="space-y-6">
          {/* Cover card */}
          <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(124,58,237,0.12)' }}>
            <div className="p-8 text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1a0c40 0%, #2d1566 50%, #1a0c40 100%)' }}>
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #7c3aed 0%, transparent 60%)' }} />
              <div className="relative flex items-start justify-between gap-6">
                <div>
                  <div className="text-violet-400 text-sm font-semibold mb-2 font-mono">RESUMEIQ ANALYSIS REPORT</div>
                  <h2 className="font-display font-bold text-3xl mb-2">{fileName || 'Resume Analysis'}</h2>
                  <p className="text-violet-200/70 text-sm">Generated on {formattedDate}</p>
                  <p className="text-white/80 mt-4 max-w-xl text-sm leading-relaxed">{summary}</p>
                </div>
                <div className="flex-shrink-0">
                  <ATSScoreRing score={atsScore} size={160} />
                </div>
              </div>
            </div>
          </div>

          {/* Strengths + Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                <h3 className="font-display font-bold text-lg text-obsidian-900 dark:text-obsidian-50">Strengths</h3>
              </div>
              <div className="space-y-2.5">
                {strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                    <p className="text-sm text-obsidian-700 dark:text-obsidian-300">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                <h3 className="font-display font-bold text-lg text-obsidian-900 dark:text-obsidian-50">Areas to Improve</h3>
              </div>
              <div className="space-y-2.5">
                {weaknesses.map((w, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                    <p className="text-sm text-obsidian-700 dark:text-obsidian-300">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All skills */}
          <div className="glass-card p-6 space-y-5">
            <h3 className="font-display font-bold text-lg text-obsidian-900 dark:text-obsidian-50">
              Extracted Skills <span className="text-obsidian-400 font-normal text-base">({allSkills.length} total)</span>
            </h3>
            <div className="space-y-4">
              {SKILL_CATEGORIES.map(cat => {
                const catSkills = skills[cat.key] || [];
                if (catSkills.length === 0) return null;
                return (
                  <div key={cat.key}>
                    <p className="section-label mb-2">{cat.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((s, i) => (
                        <SkillBadge key={i} skill={s} category={cat.key} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Job match summary */}
          {jobMatch && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-display font-bold text-lg text-obsidian-900 dark:text-obsidian-50">Job Match Results</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-obsidian-700 dark:text-obsidian-300">{jobMatch.role}</span>
                    <span className="font-bold text-violet-500">{jobMatch.matchPercentage}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-obsidian-100 dark:bg-obsidian-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${jobMatch.matchPercentage}%`,
                        background: 'linear-gradient(90deg, #7c3aed, #6366f1)'
                      }}
                    />
                  </div>
                </div>
              </div>
              {missingSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={14} className="text-rose-500" />
                    <p className="section-label">Missing Skills for {jobMatch.role}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((s, i) => (
                      <SkillBadge key={i} skill={s} category="missing" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-violet-500" />
              <h3 className="font-display font-bold text-lg text-obsidian-900 dark:text-obsidian-50">AI Recommendations</h3>
            </div>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-violet-50/50 dark:bg-violet-500/5 border border-violet-100 dark:border-violet-500/15">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono text-white"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-obsidian-700 dark:text-obsidian-300 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
