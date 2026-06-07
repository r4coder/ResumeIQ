import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Zap, BarChart2, Search, Target, Download,
  ChevronRight, Star, ArrowRight, CheckCircle, Brain
} from 'lucide-react';
import Navbar from '../components/ui/Navbar.jsx';

const FEATURES = [
  { icon: Zap, title: 'ATS Score Analysis', desc: 'Get your Applicant Tracking System compatibility score with detailed breakdown and improvement tips.', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  { icon: Brain, title: 'AI-Powered Insights', desc: 'Gemini AI analyzes your resume to extract deep insights, strengths, weaknesses, and actionable recommendations.', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { icon: Search, title: 'Skill Extraction', desc: 'Automatically detect and categorize all skills: languages, frameworks, databases, cloud, tools, and soft skills.', color: '#0891b2', bg: 'rgba(8,145,178,0.1)' },
  { icon: Target, title: 'Job Role Matching', desc: 'Compare your resume against 9 job roles to see match percentage and identify critical missing skills.', color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  { icon: BarChart2, title: 'Visual Analytics', desc: 'Beautiful charts and visualizations make it easy to understand your resume performance at a glance.', color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  { icon: Download, title: 'PDF Report', desc: 'Download a comprehensive professional PDF report with all analysis results to share with your career advisor.', color: '#e11d48', bg: 'rgba(225,29,72,0.1)' },
];

const STATS = [
  { value: '98%', label: 'Analysis Accuracy' },
  { value: '9+', label: 'Job Roles Supported' },
  { value: '<30s', label: 'Average Analysis Time' },
  { value: '100%', label: 'Privacy Guaranteed' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef();

  useEffect(() => {
    // Particle animation
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1
    }));

    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${p.opacity})`;
        ctx.fill();
      });
      // Draw connections
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="min-h-screen bg-obsidian-50 dark:bg-obsidian-950">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden" ref={heroRef}>
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <canvas id="hero-canvas" className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,58,237,0.08) 0%, transparent 70%)',
            }} />
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full blur-3xl opacity-15"
            style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium"
              style={{
                background: 'rgba(124,58,237,0.08)',
                borderColor: 'rgba(124,58,237,0.25)',
                color: '#7c3aed'
              }}>
              <Star size={13} fill="currentColor" />
              AI-Powered Resume Analysis
              <Star size={13} fill="currentColor" />
            </div>

            <h1 className="font-display font-bold leading-tight tracking-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
              Get Your Resume
              <span className="block text-gradient-violet">Analyzed by AI</span>
              in Seconds
            </h1>

            <p className="text-lg text-obsidian-500 dark:text-obsidian-400 max-w-2xl mx-auto leading-relaxed">
              Upload your PDF resume and get an instant ATS compatibility score, skill analysis,
              job role matching, and actionable AI recommendations — completely free.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary flex items-center gap-2.5 px-8 py-4 text-base"
              >
                <FileText size={18} />
                Analyze My Resume
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border transition-all duration-200 text-obsidian-600 dark:text-obsidian-300 hover:text-obsidian-900 dark:hover:text-white"
                style={{ borderColor: 'var(--border-color)' }}
              >
                See Features
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {['No signup required', 'PDF files only', 'Results in 30 seconds', 'Gemini AI powered'].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-obsidian-400 dark:text-obsidian-500">
                  <CheckCircle size={14} className="text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Hero card mockup */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="glass-card p-6 relative overflow-hidden"
              style={{ boxShadow: '0 25px 60px rgba(124,58,237,0.15), 0 0 0 1px rgba(124,58,237,0.1)' }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent)' }} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 flex flex-col items-center gap-4 p-4">
                  <div className="relative w-28 h-28">
                    <svg viewBox="0 0 120 120" className="w-full h-full">
                      <circle cx="60" cy="60" r="48" fill="none" strokeWidth="10" stroke="rgba(124,58,237,0.1)" />
                      <circle cx="60" cy="60" r="48" fill="none" strokeWidth="10" stroke="#7c3aed"
                        strokeDasharray="301.6" strokeDashoffset="45" strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', filter: 'drop-shadow(0 0 6px #7c3aed66)' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display font-bold text-2xl text-gradient-violet">85</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-violet-500">Good Match</div>
                    <div className="text-xs text-obsidian-400 dark:text-obsidian-500">ATS Score</div>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'].map(s => (
                      <span key={s} className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg"
                        style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#7c3aed' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {['Strong technical skill diversity', 'Quantified achievements present', 'Good keyword optimization'].map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-obsidian-600 dark:text-obsidian-300">
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-obsidian-100 dark:bg-obsidian-800 overflow-hidden">
                      <div className="h-full w-4/5 rounded-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #00d4ff)' }} />
                    </div>
                    <span className="text-xs font-semibold text-violet-500">80% Match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y" style={{ borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center px-2">
                <span className="font-display font-bold text-3xl sm:text-4xl whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {value}
                </span>
                <span className="text-sm text-obsidian-500 dark:text-obsidian-400 leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="section-label mb-3">What You Get</div>
            <h2 className="font-display font-bold text-4xl text-obsidian-900 dark:text-obsidian-50">
              Everything you need to<br />
              <span className="text-gradient-violet">land your dream job</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="glass-card p-6 group hover:scale-[1.01] transition-transform duration-200">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: bg }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-display font-bold text-lg text-obsidian-900 dark:text-obsidian-50 mb-2">{title}</h3>
                <p className="text-sm text-obsidian-500 dark:text-obsidian-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="glass-card p-12 relative overflow-hidden"
            style={{ boxShadow: '0 25px 50px rgba(124,58,237,0.1)' }}>
            <div className="absolute inset-0 opacity-20"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.4), transparent 70%)' }} />
            <div className="relative">
              <h2 className="font-display font-bold text-4xl text-obsidian-900 dark:text-obsidian-50 mb-4">
                Ready to optimize your resume?
              </h2>
              <p className="text-obsidian-500 dark:text-obsidian-400 mb-8 max-w-xl mx-auto">
                Join thousands of job seekers who have improved their resume scores and landed more interviews.
              </p>
              <button onClick={() => navigate('/dashboard')} className="btn-primary px-10 py-4 text-base flex items-center gap-2.5 mx-auto">
                <FileText size={18} />
                Start Free Analysis
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t text-center text-sm text-obsidian-400 dark:text-obsidian-600"
        style={{ borderColor: 'var(--border-color)' }}>
        <p>© 2024 ResumeIQ · Built with Gemini AI · All analysis is private and secure</p>
      </footer>
    </div>
  );
}
