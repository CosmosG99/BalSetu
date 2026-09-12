import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Shield,
  ArrowRight,
  Globe,
  Sun,
  Moon,
  Sparkles,
  Users,
  Cpu,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { Language } from '../types';
import { InteractiveGlobe3D } from '../components/common/InteractiveGlobe3D';

export const LandingEntryPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  // Mouse parallax state for desktop depth effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Small normalized shift (-15px to 15px)
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEnterApp = () => {
    navigate('/app');
  };

  return (
    <div className="relative min-h-screen bg-[#061B16] text-white font-sans selection:bg-teal-500/30 selection:text-white overflow-hidden flex flex-col justify-between">
      
      {/* Background Ambient Grid & Radial Spotlights */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-teal-700/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[700px] h-[700px] bg-teal-500/15 rounded-full blur-[160px] pointer-events-none" />

      {/* ============================================================ */}
      {/* 1. TOP HEADER (NO SIDEBAR ON LANDING PAGE)                   */}
      {/* ============================================================ */}
      <header className="relative z-30 max-w-7xl mx-auto w-full px-6 sm:px-8 py-6 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-teal-500 text-charcoal-950 flex items-center justify-center font-extrabold shadow-subtle group-hover:scale-105 transition-transform">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-white leading-none mb-1">
              {t('appName')}
            </div>
            <div className="text-[11px] font-medium text-teal-300 tracking-wide uppercase">
              Protect. Connect. Respond.
            </div>
          </div>
        </Link>

        {/* Top-Right Language & Theme Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-white/10 dark:bg-charcoal-900/80 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-white shadow-subtle hover:border-teal-400/50 transition-colors">
            <Globe className="w-4 h-4 mr-2 text-teal-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-1 text-xs"
            >
              <option value="en" className="bg-charcoal-900 text-white">English</option>
              <option value="hi" className="bg-charcoal-900 text-white">हिन्दी</option>
              <option value="mr" className="bg-charcoal-900 text-white">मराठी</option>
            </select>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/10 dark:bg-charcoal-900/80 backdrop-blur-md border border-white/20 dark:border-white/10 text-white hover:text-teal-300 transition-all shadow-subtle flex items-center justify-center cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amberGold-500" /> : <Moon className="w-4 h-4 text-teal-300" />}
          </button>

        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO FIRST VIEWPORT SECTION                               */}
      {/* ============================================================ */}
      <main className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-8 py-4 my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Hero Text & Primary Action */}
        <div className="lg:col-span-6 space-y-6 text-left animate-fade-in">
          
          {/* Hero Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-extrabold shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="uppercase tracking-wider">A SAFER TOMORROW TOGETHER</span>
          </div>

          {/* Hero Impactful Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
            Stronger <br />
            Communities. <br />
            <span className="text-teal-400">Safer Children.</span>
          </h1>

          {/* Hero Short Description */}
          <p className="text-base sm:text-lg text-charcoal-300 max-w-xl leading-relaxed">
            RAKSHAK connects community reports, AI-powered triage, and coordinated response to protect vulnerable children in public spaces.
          </p>

          {/* Dominant ENTER RAKSHAK CTA Button */}
          <div className="pt-3 space-y-3">
            <button
              onClick={handleEnterApp}
              className="group px-9 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-charcoal-950 font-extrabold text-sm sm:text-base shadow-modal hover:scale-105 active:scale-95 transition-all duration-300 flex items-center space-x-3 cursor-pointer"
            >
              <span>ENTER RAKSHAK</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <div className="text-xs text-charcoal-400 font-medium tracking-wide">
              Be alert. Report. Make a difference.
            </div>
          </div>

        </div>

        {/* Right Column: Interactive 3D Globe + Floating Alert Cards */}
        <div
          className="lg:col-span-6 relative flex items-center justify-center overflow-visible"
          style={{
            transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0px)`,
            transition: 'transform 0.2s ease-out'
          }}
        >
          {/* 1. Interactive 3D Canvas Globe Background */}
          <div className="w-full max-w-[560px] aspect-square relative flex items-center justify-center overflow-visible">
            
            <InteractiveGlobe3D />




            {/* 3. Floating Glassmorphism Alert Cards Surrounding Globe (Exact Reference Copy) */}

            {/* Card 1: Top-Left Floating Alert Card */}
            <div
              className="absolute -top-2 left-0 sm:-left-6 z-30 bg-charcoal-900/90 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl shadow-modal space-y-1 text-xs max-w-[210px] animate-bounce-slow"
              style={{
                transform: `translate3d(${mousePos.x * -0.8}px, ${mousePos.y * -0.8}px, 0px)`
              }}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accentCoral animate-ping" />
                <span className="font-extrabold text-white text-[11px]">High Risk Activity</span>
              </div>
              <div className="text-[11px] font-medium text-charcoal-300">
                Location: <span className="text-white font-semibold">Mumbai Central</span>
              </div>
              <div className="text-[10px] font-mono text-charcoal-400">
                2 reports in last 1 hour
              </div>
            </div>

            {/* Card 2: Top-Right Floating Alert Card */}
            <div
              className="absolute top-6 -right-2 sm:-right-6 z-30 bg-charcoal-900/90 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl shadow-modal space-y-1 text-xs max-w-[200px]"
              style={{
                transform: `translate3d(${mousePos.x * 0.8}px, ${mousePos.y * -0.6}px, 0px)`
              }}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accentCoral animate-ping" />
                <span className="font-extrabold text-white text-[11px]">Alert</span>
              </div>
              <div className="text-[11px] font-medium text-charcoal-300">
                Location: <span className="text-white font-semibold">New Delhi</span>
              </div>
              <div className="text-[10px] font-mono text-charcoal-400">
                3 reports in last 2 hours
              </div>
            </div>

            {/* Card 3: Middle-Right Floating Alert Card */}
            <div
              className="absolute bottom-28 -right-4 sm:-right-8 z-30 bg-charcoal-900/90 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl shadow-modal space-y-1 text-xs max-w-[200px]"
              style={{
                transform: `translate3d(${mousePos.x * 1.0}px, ${mousePos.y * 0.6}px, 0px)`
              }}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accentCoral animate-pulse" />
                <span className="font-extrabold text-white text-[11px]">Possible Distress</span>
              </div>
              <div className="text-[11px] font-medium text-charcoal-300">
                Location: <span className="text-white font-semibold">Howrah</span>
              </div>
              <div className="text-[10px] font-mono text-charcoal-400">
                1 report just now
              </div>
            </div>

            {/* Card 4: Bottom-Right Real-Time Awareness Card */}
            <div
              className="absolute -bottom-4 right-2 sm:right-6 z-30 bg-charcoal-900/95 backdrop-blur-md border border-teal-500/40 p-3.5 rounded-2xl shadow-modal flex items-center space-x-3 text-xs max-w-[230px]"
              style={{
                transform: `translate3d(${mousePos.x * -0.5}px, ${mousePos.y * 1.0}px, 0px)`
              }}
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span className="font-bold text-teal-300 text-[11px]">Real-time Awareness</span>
                </div>
                <p className="text-[10px] text-charcoal-300 leading-tight">
                  Monitoring public spaces for a safer tomorrow.
                </p>
              </div>

              {/* Animated Activity Indicator Bars */}
              <div className="flex items-end space-x-1 h-6 flex-shrink-0">
                <span className="w-1.5 h-3 bg-teal-400 rounded-full animate-pulse" />
                <span className="w-1.5 h-5 bg-teal-300 rounded-full animate-pulse delay-100" />
                <span className="w-1.5 h-4 bg-teal-500 rounded-full animate-pulse delay-200" />
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* ============================================================ */}
      {/* 3. BOTTOM CAPABILITY STRIP (FIRST VIEWPORT BOTTOM)          */}
      {/* ============================================================ */}
      <footer className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-8 pb-6 pt-4">
        
        <div className="text-center pb-3">
          <span className="text-[10px] font-mono font-semibold text-charcoal-400 uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            LIVE CHILD SAFETY NETWORK
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Item 1: Community Reporting (Pink) */}
          <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-charcoal-900/60 border border-accentPink/30 flex items-center space-x-3 backdrop-blur-xs">
            <div className="p-2.5 rounded-xl bg-accentPink/15 text-accentPink font-bold flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Community Reporting</div>
              <div className="text-[11px] text-charcoal-400">30s anonymous bystander submission</div>
            </div>
          </div>

          {/* Item 2: AI-Assisted Triage (Purple) */}
          <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-charcoal-900/60 border border-accentPurple/30 flex items-center space-x-3 backdrop-blur-xs">
            <div className="p-2.5 rounded-xl bg-accentPurple/15 text-accentPurple font-bold flex-shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">AI-Assisted Triage</div>
              <div className="text-[11px] text-charcoal-400">Advisory trauma risk assessment</div>
            </div>
          </div>

          {/* Item 3: Location Awareness (Cyan) */}
          <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-charcoal-900/60 border border-accentCyan/30 flex items-center space-x-3 backdrop-blur-xs">
            <div className="p-2.5 rounded-xl bg-accentCyan/15 text-accentCyan font-bold flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Location Awareness</div>
              <div className="text-[11px] text-charcoal-400">Transit hub concourse mapping</div>
            </div>
          </div>

          {/* Item 4: Coordinated Response (Orange) */}
          <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-charcoal-900/60 border border-accentOrange/30 flex items-center space-x-3 backdrop-blur-xs">
            <div className="p-2.5 rounded-xl bg-accentOrange/15 text-accentOrange font-bold flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Coordinated Response</div>
              <div className="text-[11px] text-charcoal-400">RPF & child welfare dispatch</div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
