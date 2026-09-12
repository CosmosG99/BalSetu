import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowRight,
  Globe,
  Sun,
  Moon
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

  const marqueeItems = [
    { title: 'Community Reporting', subtitle: '30s anonymous bystander submission' },
    { title: 'AI-Assisted Triage', subtitle: 'Advisory trauma risk assessment' },
    { title: 'Location Awareness', subtitle: 'Transit hub concourse mapping' },
    { title: 'Coordinated Response', subtitle: 'RPF & child welfare dispatch' }
  ];

  return (
    <div className="relative min-h-screen bg-[#edf7f2] text-[#102a24] font-sans selection:bg-teal-500/30 selection:text-[#102a24] overflow-hidden flex flex-col justify-between">
      
      {/* Background Ambient Grid & Radial Spotlights */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[700px] h-[700px] bg-emerald-300/20 rounded-full blur-[160px] pointer-events-none" />

      {/* ============================================================ */}
      {/* 1. TOP HEADER (NO SIDEBAR ON LANDING PAGE)                   */}
      {/* ============================================================ */}
      <header className="relative z-30 max-w-7xl mx-auto w-full px-6 sm:px-8 py-6 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <Link to="/" className="flex items-center space-x-3 group">
          <img src="/rakshak-mark.svg" alt="Rakshak logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
          <div>
            <div className="text-xl font-extrabold tracking-tight text-[#102a24] leading-none mb-1">
              {t('appName')}
            </div>
            <div className="text-[11px] font-medium text-[#2d6b5d] tracking-wide uppercase">
              Protect. Connect. Respond.
            </div>
          </div>
        </Link>

        {/* Top-Right Language & Theme Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-white/70 backdrop-blur-md border border-[#1c4d42]/15 rounded-xl px-3 py-1.5 text-xs text-[#102a24] shadow-subtle hover:border-teal-500/40 transition-colors">
            <Globe className="w-4 h-4 mr-2 text-teal-600" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-[#102a24] font-bold focus:outline-none cursor-pointer pr-1 text-xs"
            >
              <option value="en" className="bg-white text-[#102a24]">English</option>
              <option value="hi" className="bg-white text-[#102a24]">हिन्दी</option>
              <option value="mr" className="bg-white text-[#102a24]">मराठी</option>
            </select>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/70 backdrop-blur-md border border-[#1c4d42]/15 text-[#102a24] hover:text-teal-700 transition-all shadow-subtle flex items-center justify-center cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amberGold-500" /> : <Moon className="w-4 h-4 text-teal-600" />}
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
          {/* Hero Impactful Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#102a24] tracking-tight leading-[1.08]">
            Stronger <br />
            Communities. <br />
            <span className="text-teal-700">Safer Children.</span>
          </h1>

          {/* Hero Short Description */}
          <p className="text-base sm:text-lg text-[#2d6b5d] max-w-xl leading-relaxed">
            RAKSHAK connects community reports, AI-powered triage, and coordinated response to protect vulnerable children in public spaces.
          </p>

          {/* Dominant ENTER RAKSHAK CTA Button */}
          <div className="pt-3 space-y-3">
            <button
              onClick={handleEnterApp}
              className="group px-9 py-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm sm:text-base shadow-modal hover:scale-105 active:scale-95 transition-all duration-300 flex items-center space-x-3 cursor-pointer"
            >
              <span>ENTER RAKSHAK</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <div className="text-xs text-[#2d6b5d] font-medium tracking-wide">
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




          </div>

        </div>

      </main>

      {/* ============================================================ */}
      {/* 3. BOTTOM CAPABILITY MARQUEE                                 */}
      {/* ============================================================ */}
      <footer className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-8 pb-6 pt-4">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        <div className="overflow-hidden rounded-full border border-[#1c4d42]/10 bg-white/60 backdrop-blur-sm shadow-sm">
          <div
            className="flex w-max items-center gap-3 whitespace-nowrap px-2 py-2.5"
            style={{ animation: 'marquee 22s linear infinite' }}
          >
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="flex items-center gap-3 rounded-full border border-[#1c4d42]/10 bg-white/70 px-4 py-2 text-left"
              >
                <span className="text-sm font-bold text-[#102a24]">{item.title}</span>
                <span className="text-xs text-[#4a665f]">{item.subtitle}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
};
