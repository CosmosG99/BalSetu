import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Shield, Globe, Menu, X, ArrowRight, Lock, Sun, Moon } from 'lucide-react';
import { Language } from '../../types';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
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
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border-b border-charcoal-200/80 dark:border-charcoal-800 shadow-subtle transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold shadow-subtle">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-charcoal-800 dark:text-charcoal-100">
              {t('appName')} <span className="text-xs text-teal-700 dark:text-teal-400 font-mono font-medium">| Citizen Report</span>
            </span>
          </Link>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-ivory-100 dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 text-charcoal-800 dark:text-charcoal-100 hover:text-teal-700 transition-colors"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amberGold-500" /> : <Moon className="w-4 h-4 text-teal-700" />}
            </button>

            <div className="flex items-center space-x-1.5 text-charcoal-600 dark:text-charcoal-400 font-medium">
              <Lock className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span className="hidden sm:inline">{t('encryptedNotice')}</span>
            </div>
            <Link to="/" className="text-charcoal-600 hover:text-charcoal-900 dark:hover:text-charcoal-100 px-2 py-1 transition-colors font-medium">
              {t('exitFlow')}
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
          ? 'bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border-b border-charcoal-200/80 dark:border-charcoal-800 shadow-subtle py-3'
          : 'bg-transparent py-4 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* RAKSHAK Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold shadow-subtle group-hover:scale-105 transition-transform">
              <Shield className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-charcoal-800 dark:text-charcoal-100">
                  {t('appName')}
                </span>
              </div>
              <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 font-medium tracking-wide hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Public Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/')
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-700/10 dark:bg-teal-500/20'
                  : 'text-charcoal-800 dark:text-charcoal-100 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-700/5 dark:hover:bg-charcoal-800'
              }`}
            >
              {t('navHome')}
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/how-it-works')
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-700/10 dark:bg-teal-500/20'
                  : 'text-charcoal-800 dark:text-charcoal-100 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-700/5 dark:hover:bg-charcoal-800'
              }`}
            >
              {t('navHowItWorks')}
            </Link>
            <Link
              to="/impact"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/impact')
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-700/10 dark:bg-teal-500/20'
                  : 'text-charcoal-800 dark:text-charcoal-100 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-700/5 dark:hover:bg-charcoal-800'
              }`}
            >
              {t('navImpact')}
            </Link>
            <Link
              to="/resources"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/resources')
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-700/10 dark:bg-teal-500/20'
                  : 'text-charcoal-800 dark:text-charcoal-100 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-700/5 dark:hover:bg-charcoal-800'
              }`}
            >
              {t('navResources')}
            </Link>
            <Link
              to="/track"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/track')
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-700/10 dark:bg-teal-500/20'
                  : 'text-charcoal-800 dark:text-charcoal-100 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-700/5 dark:hover:bg-charcoal-800'
              }`}
            >
              {t('navTrack')}
            </Link>
          </nav>

          {/* Right Controls: Language, Theme Toggle, Report a Concern CTA */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 rounded-xl px-2.5 py-1.5 text-xs text-charcoal-800 dark:text-charcoal-100 shadow-sm">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-teal-700 dark:text-teal-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-charcoal-800 dark:text-charcoal-100 font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-white dark:bg-charcoal-900 text-charcoal-800 dark:text-charcoal-100">English</option>
                <option value="hi" className="bg-white dark:bg-charcoal-900 text-charcoal-800 dark:text-charcoal-100">हिन्दी</option>
                <option value="mr" className="bg-white dark:bg-charcoal-900 text-charcoal-800 dark:text-charcoal-100">मराठी</option>
              </select>
            </div>

            {/* Sun / Moon Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 text-charcoal-800 dark:text-charcoal-100 hover:text-teal-700 transition-all shadow-sm flex items-center justify-center"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amberGold-500" /> : <Moon className="w-4 h-4 text-teal-700" />}
            </button>

            {/* Primary Report CTA */}
            <Link
              to="/report"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-subtle hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>{t('btnReportConcern')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

          </div>

          {/* Mobile Hamburger Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-ivory-100 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 text-charcoal-800 dark:text-charcoal-100"
            >
              {isDark ? <Sun className="w-4 h-4 text-amberGold-500" /> : <Moon className="w-4 h-4 text-teal-700" />}
            </button>
            <Link
              to="/report"
              className="px-3.5 py-1.5 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-sm"
            >
              Report
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal-800 dark:text-charcoal-100 hover:bg-ivory-200 dark:hover:bg-charcoal-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-charcoal-900 border-b border-charcoal-200 dark:border-charcoal-800 px-4 pt-4 pb-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-800 dark:text-charcoal-100 hover:bg-ivory-100 dark:hover:bg-charcoal-800"
            >
              {t('navHome')}
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-800 dark:text-charcoal-100 hover:bg-ivory-100 dark:hover:bg-charcoal-800"
            >
              {t('navHowItWorks')}
            </Link>
            <Link
              to="/impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-800 dark:text-charcoal-100 hover:bg-ivory-100 dark:hover:bg-charcoal-800"
            >
              {t('navImpact')}
            </Link>
            <Link
              to="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-800 dark:text-charcoal-100 hover:bg-ivory-100 dark:hover:bg-charcoal-800"
            >
              {t('navResources')}
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-800 dark:text-charcoal-100 hover:bg-ivory-100 dark:hover:bg-charcoal-800"
            >
              {t('navTrack')}
            </Link>
          </div>

          <div className="pt-3 border-t border-charcoal-200 dark:border-charcoal-800 flex items-center justify-between">
            <span className="text-xs text-charcoal-600 dark:text-charcoal-400 font-medium">{t('selectLang')}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs rounded-lg ${language === 'en' ? 'bg-teal-700 text-white' : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-800 dark:text-charcoal-300'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs rounded-lg ${language === 'hi' ? 'bg-teal-700 text-white' : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-800 dark:text-charcoal-300'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('mr')}
                className={`px-2.5 py-1 text-xs rounded-lg ${language === 'mr' ? 'bg-teal-700 text-white' : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-800 dark:text-charcoal-300'}`}
              >
                मराठी
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-charcoal-200 dark:border-charcoal-800 text-center">
            <Link
              to="/responder"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-teal-700 dark:text-teal-400 font-bold"
            >
              Go to Response Center Portal →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
