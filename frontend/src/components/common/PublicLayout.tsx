import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Home,
  Workflow,
  BarChart3,
  BookOpen,
  Search,
  ArrowRight,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  Lock,
  ExternalLink,
  Sparkles,
  PanelLeftOpen
} from 'lucide-react';
import { Language } from '../../types';
import { OfflineBanner } from './OfflineBanner';
import { Footer } from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPath = location.pathname;
  const isLandingPage = currentPath === '/app' || currentPath === '/app/';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isLandingPage);

  // Close mobile drawer on route change, and auto-collapse the sidebar on the landing page
  useEffect(() => {
    setMobileMenuOpen(false);
    setSidebarCollapsed(isLandingPage);
  }, [location.pathname, isLandingPage]);

  const navItems = [
    { label: t('navHome'), path: '/app', icon: Home, exact: true },
    { label: t('navHowItWorks'), path: '/app/how-it-works', icon: Workflow, exact: false },
    { label: t('navImpact'), path: '/app/impact', icon: BarChart3, exact: false },
    { label: t('navResources'), path: '/app/resources', icon: BookOpen, exact: false },
    { label: t('navTrack'), path: '/app/track', icon: Search, exact: false },
  ];

  const isNavItemActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return currentPath === '/app' || currentPath === '/app/';
    }
    return currentPath === item.path || currentPath.startsWith(`${item.path}/`);
  };

  const isReportFlow = currentPath.includes('/report');

  return (
    <div className="min-h-screen flex bg-ivory-100 dark:bg-charcoal-950 text-charcoal-800 dark:text-ivory-100 font-sans transition-colors duration-300">
      
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-charcoal-950/70 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* ================================================== */}
      {/* FIXED LEFT SIDEBAR (Desktop: 256px / w-64, 100vh)   */}
      {/* ================================================== */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-charcoal-900 border-r border-charcoal-200/80 dark:border-charcoal-800 flex flex-col justify-between transition-transform duration-300 shadow-subtle ${
          mobileMenuOpen || !sidebarCollapsed ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* -------------------------------------------------- */}
        {/* 1. SIDEBAR BRANDING LOGO                           */}
        {/* -------------------------------------------------- */}
        <div className="p-5 border-b border-charcoal-200/80 dark:border-charcoal-800 flex items-center justify-between">
          <div className="flex-1" />

          {/* Close button for mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-800 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* -------------------------------------------------- */}
        {/* 2. SIDEBAR MAIN NAVIGATION LINKS                  */}
        {/* -------------------------------------------------- */}
        <div className="flex-1 px-3.5 py-4 space-y-5 overflow-y-auto">
          
          <nav className="space-y-1.5">
            <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isNavItemActive(item);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-teal-700/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold border-l-4 border-teal-700 dark:border-teal-400 shadow-xs'
                      : 'text-charcoal-700 dark:text-charcoal-300 hover:bg-teal-700/5 dark:hover:bg-charcoal-850 hover:text-teal-700 dark:hover:text-teal-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${active ? 'text-teal-700 dark:text-teal-300' : 'text-charcoal-500 dark:text-charcoal-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* -------------------------------------------------- */}
          {/* 3. PROMINENT REPORT A CONCERN CTA BUTTON          */}
          {/* -------------------------------------------------- */}
          <div className="pt-2">
            <Link
              to="/app/report"
              className="group w-full flex items-center justify-between px-4 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-subtle hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <div className="flex items-center space-x-2">
                <img src="/rakshak-mark.svg" alt="Rakshak logo" className="w-4 h-4 object-contain" />
                <span className="tracking-wide uppercase text-[11px]">{t('btnReportConcern')}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* -------------------------------------------------- */}
          {/* 4. RESPONDER ACCESS & LANDING FRONT DOOR LINK    */}
          {/* -------------------------------------------------- */}
          <div className="pt-2 space-y-1 border-t border-charcoal-200/60 dark:border-charcoal-800/60">

            <Link
              to="/responder"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-semibold text-charcoal-600 hover:text-teal-700 dark:text-charcoal-400 dark:hover:text-teal-300 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                <span>Response Center Portal</span>
              </div>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </aside>

      {/* ================================================== */}
      {/* MAIN RIGHT CONTENT AREA (Offset by Sidebar Width)  */}
      {/* ================================================== */}
      <div className={`flex-1 ${sidebarCollapsed ? '' : 'lg:pl-64'} flex flex-col min-w-0`}>
        
        {/* Mobile Header Bar (Visible on mobile viewports < lg) */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border-b border-charcoal-200/80 dark:border-charcoal-800 px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex-1" />

          <div className="flex items-center space-x-2">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 rounded-xl px-2 py-1 text-xs text-charcoal-800 dark:text-charcoal-100 shadow-xs">
              <Globe className="w-3.5 h-3.5 mr-1 text-teal-700 dark:text-teal-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-charcoal-800 dark:text-charcoal-100 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
                <option value="mr">MR</option>
              </select>
            </div>

            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 text-charcoal-800 dark:text-charcoal-100 hover:text-teal-700 transition-colors shadow-xs"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amberGold-500" /> : <Moon className="w-4 h-4 text-teal-700" />}
            </button>

            <Link
              to="/app/report"
              className="px-3 py-1.5 rounded-lg bg-teal-700 text-white font-bold text-xs shadow-xs"
            >
              {t('btnReportConcern')}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal-800 dark:text-charcoal-100 hover:bg-ivory-200 dark:hover:bg-charcoal-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Desktop Top Utility Header Bar (Language & Theme in Top-Right) */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-md border-b border-charcoal-200/80 dark:border-charcoal-800 px-8 py-3 items-center justify-between shadow-xs transition-colors duration-300">
          <div className="flex-1" />

          {/* Top-Right Utility Area (Language Selector + Theme Toggle) */}
          <div className="flex items-center space-x-3">
            
            {/* Language Dropdown */}
            <div className="relative flex items-center bg-white dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 rounded-xl px-3 py-1.5 text-xs text-charcoal-800 dark:text-charcoal-100 shadow-xs hover:border-teal-700/50 transition-colors">
              <Globe className="w-3.5 h-3.5 mr-2 text-teal-700 dark:text-teal-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-charcoal-800 dark:text-charcoal-100 font-bold focus:outline-none cursor-pointer pr-1 text-xs"
              >
                <option value="en" className="bg-white dark:bg-charcoal-900 text-charcoal-800 dark:text-charcoal-100">English</option>
                <option value="hi" className="bg-white dark:bg-charcoal-900 text-charcoal-800 dark:text-charcoal-100">हिन्दी</option>
                <option value="mr" className="bg-white dark:bg-charcoal-900 text-charcoal-800 dark:text-charcoal-100">मराठी</option>
              </select>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 text-charcoal-800 dark:text-charcoal-100 hover:text-teal-700 dark:hover:text-teal-300 transition-all shadow-xs flex items-center justify-center"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amberGold-500" /> : <Moon className="w-4 h-4 text-teal-700" />}
            </button>

          </div>
        </header>

        <OfflineBanner />

        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 items-center gap-2 rounded-full border border-charcoal-200/80 bg-white/95 px-3 py-2 text-[11px] font-bold text-charcoal-700 shadow-subtle transition-all hover:border-teal-700/40 hover:text-teal-700"
            aria-label="Expand navigation sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
            <span>Expand</span>
          </button>
        )}

        {/* Main Content Body */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>

    </div>
  );
};
