import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCases } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { DemoModeDropdown } from './DemoModeDropdown';
import {
  Shield,
  LayoutDashboard,
  Layers,
  AlertTriangle,
  FileText,
  UserCheck,
  Map as MapIcon,
  Users,
  BarChart3,
  HelpCircle,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { Language } from '../../types';

interface ResponderLayoutProps {
  children: React.ReactNode;
}

export const ResponderLayout: React.FC<ResponderLayoutProps> = ({ children }) => {
  const { location: routerLocation } = { location: useLocation() };
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const { cases } = useCases();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeCount = cases.filter((c) => c.status !== 'RESOLVED').length;
  const priorityCount = cases.filter(
    (c) => c.aiAnalysis.riskLevel === 'CRITICAL' || c.aiAnalysis.riskLevel === 'HIGH'
  ).length;
  const newCount = cases.filter((c) => c.status === 'NEW' || c.status === 'TRIAGED').length;

  const currentPath = routerLocation.pathname;

  const navItems = [
    { label: 'Overview', path: '/responder', icon: LayoutDashboard, exact: true },
    { label: 'Active Cases', path: '/responder?filter=active', icon: Layers, badge: activeCount },
    { label: 'High Priority', path: '/responder?filter=priority', icon: AlertTriangle, badge: priorityCount, badgeColor: 'bg-coral-600 text-white' },
    { label: 'New Reports', path: '/responder?filter=new', icon: FileText, badge: newCount, badgeColor: 'bg-teal-700 text-white' },
    { label: 'Assigned to Me', path: '/responder?filter=assigned', icon: UserCheck },
    { label: 'Map', path: '/responder/map', icon: MapIcon },
    { label: 'Potential Matches', path: '/responder/matches', icon: Users },
    { label: 'Analytics', path: '/admin', icon: BarChart3 },
    { label: 'Resources', path: '/resources', icon: HelpCircle },
    { label: 'Settings', path: '/responder?tab=settings', icon: Settings }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (searchQuery.toUpperCase().startsWith('RB-') || searchQuery.toUpperCase().startsWith('RKS-')) {
        navigate(`/responder/cases/${searchQuery.trim().toUpperCase()}`);
      } else {
        navigate(`/responder?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-ivory-100 dark:bg-charcoal-950 text-charcoal-800 dark:text-charcoal-100 transition-colors duration-300">
      
      {/* Sidebar Overlay for Mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-charcoal-950/70 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Fixed Left Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-charcoal-900 border-r border-charcoal-200/80 dark:border-charcoal-800 flex flex-col justify-between transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Sidebar Brand */}
        <div className="p-5 border-b border-charcoal-200/80 dark:border-charcoal-800 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold shadow-subtle group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-charcoal-800 dark:text-charcoal-100">
                RAKSHAK
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Response Center
              </div>
            </div>
          </Link>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-charcoal-600 hover:text-charcoal-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? currentPath === item.path
              : currentPath.startsWith(item.path.split('?')[0]) && item.path !== '/responder';

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white dark:bg-teal-500/25 dark:text-teal-300 shadow-subtle border-l-4 border-teal-700 dark:border-teal-400'
                    : 'text-charcoal-800 dark:text-charcoal-300 hover:bg-teal-700/5 dark:hover:bg-charcoal-850 hover:text-teal-700 dark:hover:text-teal-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white dark:text-teal-300' : 'text-charcoal-600 dark:text-charcoal-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      item.badgeColor || 'bg-charcoal-200 dark:bg-charcoal-800 text-charcoal-800 dark:text-charcoal-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile Status */}
        <div className="p-4 border-t border-charcoal-200/80 dark:border-charcoal-800 bg-ivory-50/50 dark:bg-charcoal-950/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs font-mono">
              R
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal-800 dark:text-charcoal-100">Responder</div>
              <div className="flex items-center space-x-1 text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 animate-pulse" />
                <span>On Duty</span>
              </div>
            </div>
          </div>

          <Link to="/" className="text-[11px] font-semibold text-charcoal-600 hover:text-teal-700 dark:hover:text-charcoal-100">
            Exit
          </Link>
        </div>
      </aside>

      {/* Main Right Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Command Bar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md border-b border-charcoal-200/80 dark:border-charcoal-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-charcoal-800 dark:text-charcoal-100 hover:bg-ivory-200 dark:hover:bg-charcoal-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Input with Ctrl+K shortcut badge */}
            <form onSubmit={handleSearchSubmit} className="relative w-64 sm:w-80 flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-charcoal-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases, locations..."
                className="w-full pl-9 pr-14 py-2 bg-ivory-100/80 dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 rounded-xl text-xs text-charcoal-800 dark:text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-teal-700 dark:focus:border-teal-500 transition-colors"
              />
              <div className="absolute right-2.5 pointer-events-none">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-charcoal-500 bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 rounded shadow-xs">
                  ⌘K
                </kbd>
              </div>
            </form>
          </div>

          {/* Right Top Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Language Selector */}
            <div className="relative hidden sm:flex items-center bg-ivory-100 dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 rounded-xl px-2.5 py-1.5 text-xs text-charcoal-800 dark:text-charcoal-100">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-teal-700 dark:text-teal-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-charcoal-800 dark:text-charcoal-100 font-medium focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-white dark:bg-charcoal-900">English</option>
                <option value="hi" className="bg-white dark:bg-charcoal-900">हिन्दी</option>
                <option value="mr" className="bg-white dark:bg-charcoal-900">मराठी</option>
              </select>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-ivory-100 dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 text-charcoal-800 dark:text-charcoal-100 hover:text-teal-700 transition-colors"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amberGold-500" /> : <Moon className="w-4 h-4 text-teal-700" />}
            </button>

            {/* Notification Bell */}
            <button
              className="p-2 rounded-xl bg-ivory-100 dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 text-charcoal-800 dark:text-charcoal-100 hover:text-teal-700 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral-600" />
            </button>

            {/* Demo Mode Dropdown */}
            <DemoModeDropdown />

          </div>

        </header>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
};
