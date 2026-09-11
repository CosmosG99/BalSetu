import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Shield, Globe, Menu, X, ArrowRight, Lock, Sun, Moon } from 'lucide-react';
import { Language } from '../../types';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isCitizenApp = location.pathname.startsWith('/report');

  if (isCitizenApp) {
    return (
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-purple to-brand-magenta p-0.5 shadow-glow-purple">
              <div className="w-full h-full bg-white dark:bg-brand-dark rounded-[10px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-brand-purple" />
              </div>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              RAKSHAK <span className="text-xs text-brand-purple font-mono font-medium">| Report App</span>
            </span>
          </Link>

          <div className="flex items-center space-x-3 text-xs">
            {/* Theme Toggle in Citizen Header */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-purple transition-colors"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>

            <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">256-Bit Encrypted</span>
            </div>
            <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 transition-colors">
              Exit Flow
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-brand-dark/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-lg py-3'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* RAKSHAK Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-magenta p-0.5 shadow-glow-purple group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-brand-dark rounded-[14px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand-purple group-hover:text-brand-magenta transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {t('appName')}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20 dark:border-purple-500/25">
                  Bal Suraksha
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Public Web Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/')
                  ? 'text-slate-900 dark:text-white bg-slate-200/70 dark:bg-white/10'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/how-it-works')
                  ? 'text-slate-900 dark:text-white bg-slate-200/70 dark:bg-white/10'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/impact"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/impact')
                  ? 'text-slate-900 dark:text-white bg-slate-200/70 dark:bg-white/10'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Impact
            </Link>
            <Link
              to="/resources"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/resources')
                  ? 'text-slate-900 dark:text-white bg-slate-200/70 dark:bg-white/10'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Resources
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/about')
                  ? 'text-slate-900 dark:text-white bg-slate-200/70 dark:bg-white/10'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Controls: Language Selector, Theme Toggle, Track Link, Primary CTA */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Language Selector */}
            <div className="relative flex items-center bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-brand-purple" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">English</option>
                <option value="hi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">हिन्दी</option>
                <option value="mr" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">मराठी</option>
              </select>
            </div>

            {/* Sun / Moon Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-purple transition-all shadow-sm flex items-center justify-center"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>

            {/* Track Report Link */}
            <Link
              to="/track"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Track Report
            </Link>

            {/* Primary Action Button */}
            <Link
              to="/report"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-xs shadow-glow-purple hover:shadow-glow-magenta hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>REPORT A CONCERN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

          </div>

          {/* Mobile Hamburger Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
            <Link
              to="/report"
              className="px-3 py-1.5 rounded-lg bg-brand-purple text-white font-bold text-xs shadow-sm"
            >
              Report
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 px-4 pt-4 pb-6 space-y-4 animate-fade-in shadow-xl">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              How It Works
            </Link>
            <Link
              to="/impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Impact
            </Link>
            <Link
              to="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Resources
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              About
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Track Report
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Select Language:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs rounded-lg ${language === 'en' ? 'bg-brand-purple text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs rounded-lg ${language === 'hi' ? 'bg-brand-purple text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('mr')}
                className={`px-2.5 py-1 text-xs rounded-lg ${language === 'mr' ? 'bg-brand-purple text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'}`}
              >
                मराठी
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
            <Link
              to="/responder"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-brand-purple font-mono font-bold"
            >
              Go to Response Center Portal →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
