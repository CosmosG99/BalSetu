import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCases } from '../../context/CaseContext';
import { Shield, Globe, Menu, X, AlertTriangle, LayoutDashboard, ShieldCheck, HeartHandshake, UserCheck } from 'lucide-react';
import { Language } from '../../types';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { activeRole, setActiveRole } = useCases();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-brand-dark/85 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Prototype Tag */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-magenta p-0.5 shadow-glow-purple group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-brand-dark rounded-[14px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-brand-purple group-hover:text-brand-magenta transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                  {t('appName')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Bit N Build Hackathon
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('navHome')}
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/how-it-works') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('navHowItWorks')}
            </Link>
            <Link
              to="/resources"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/resources') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('navResources')}
            </Link>
            <Link
              to="/track"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/track') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('navTrack')}
            </Link>
          </nav>

          {/* Right Side: Role Selector, Language & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Role Demo Switcher */}
            <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center space-x-1 text-xs">
              <button
                onClick={() => {
                  setActiveRole('CITIZEN');
                  navigate('/report');
                }}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeRole === 'CITIZEN' ? 'bg-brand-purple text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => {
                  setActiveRole('RESPONDER');
                  navigate('/responder');
                }}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeRole === 'RESPONDER' ? 'bg-brand-purple text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Responder
              </button>
              <button
                onClick={() => {
                  setActiveRole('ADMIN');
                  navigate('/admin');
                }}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeRole === 'ADMIN' ? 'bg-brand-purple text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-300">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-brand-purple" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="hi" className="bg-slate-900 text-white">हिन्दी</option>
                <option value="mr" className="bg-slate-900 text-white">मराठी</option>
              </select>
            </div>

            {/* Primary Action Button */}
            <Link
              to="/report"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-semibold text-sm shadow-glow-purple hover:shadow-glow-magenta hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{t('btnReportConcern')}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Link
              to="/report"
              className="px-3 py-1.5 rounded-lg bg-brand-purple text-white font-semibold text-xs shadow-sm"
            >
              Report
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              {t('navHome')}
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              {t('navHowItWorks')}
            </Link>
            <Link
              to="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              {t('navResources')}
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              {t('navTrack')}
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400 font-medium">Select Language:</div>
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs rounded-lg ${language === 'en' ? 'bg-brand-purple text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs rounded-lg ${language === 'hi' ? 'bg-brand-purple text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('mr')}
                className={`px-2.5 py-1 text-xs rounded-lg ${language === 'mr' ? 'bg-brand-purple text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                मराठी
              </button>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-2">
            <Link
              to="/responder"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-purple" />
              <span>Responder Dashboard</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-brand-magenta" />
              <span>Admin Analytics</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
