import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, FileText, BarChart2, FileDown, Menu, X, Zap } from 'lucide-react';
import { useTheme, useAnalysis } from '../../App.jsx';

export default function Navbar() {
  const { dark, toggleDark } = useTheme();
  const { analysisData } = useAnalysis();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: Zap },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart2 },
    ...(analysisData ? [{ path: '/report', label: 'Report', icon: FileDown }] : [])
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-card border-b mx-0 rounded-none py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-10">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #00d4ff)' }}>
            <FileText size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Resume<span className="text-gradient-violet">IQ</span>
          </span>
        </Link>

        {/* Desktop nav — centered */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                location.pathname === path
                  ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10'
                  : 'text-obsidian-500 dark:text-obsidian-300 hover:text-obsidian-900 dark:hover:text-white hover:bg-obsidian-50 dark:hover:bg-obsidian-800/50'
              }`}>
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={toggleDark}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 text-obsidian-400 dark:text-obsidian-300 hover:bg-obsidian-100 dark:hover:bg-obsidian-800">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button onClick={() => navigate('/dashboard')}
            className="hidden sm:flex btn-primary text-sm items-center gap-2 h-9 px-4">
            <BarChart2 size={15} />
            Analyze Resume
          </button>

          <button
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-obsidian-100 dark:hover:bg-obsidian-800"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-card mx-4 mt-2 p-3 flex flex-col gap-1">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                location.pathname === path
                  ? 'text-violet-600 bg-violet-50 dark:bg-violet-500/10'
                  : 'text-obsidian-500 dark:text-obsidian-300'
              }`}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <button onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}
            className="btn-primary flex items-center justify-center gap-2 mt-2 py-2.5 text-sm">
            <BarChart2 size={15} />
            Analyze Resume
          </button>
        </div>
      )}
    </nav>
  );
}