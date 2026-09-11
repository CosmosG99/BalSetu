import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCases } from '../context/CaseContext';
import {
  ShieldAlert,
  ArrowRight,
  Eye,
  Send,
  Cpu,
  Network,
  ShieldCheck,
  Lock,
  HeartHandshake,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const { setActiveRole } = useCases();
  const navigate = useNavigate();

  const processSteps = [
    { num: '01', titleKey: 'stepSpot', descKey: 'stepSpotDesc', icon: Eye, color: 'from-blue-500 to-indigo-500' },
    { num: '02', titleKey: 'stepReport', descKey: 'stepReportDesc', icon: Send, color: 'from-purple-500 to-magenta-500' },
    { num: '03', titleKey: 'stepTriage', descKey: 'stepTriageDesc', icon: Cpu, color: 'from-amber-500 to-red-500' },
    { num: '04', titleKey: 'stepConnect', descKey: 'stepConnectDesc', icon: Network, color: 'from-brand-purple to-indigo-600' },
    { num: '05', titleKey: 'stepRespond', descKey: 'stepRespondDesc', icon: ShieldCheck, color: 'from-emerald-500 to-teal-500' }
  ];

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      
      {/* Privacy Guarantee Strip */}
      <div className="bg-brand-purple/15 border-b border-brand-purple/30 text-purple-200 text-xs py-2 px-4 text-center flex items-center justify-center space-x-2 font-medium">
        <Lock className="w-3.5 h-3.5 text-brand-magenta" />
        <span>{t('privacyBanner')}</span>
      </div>

      {/* Hero Section */}
      <section className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Tag Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-purple-300 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-brand-magenta" />
          <span>Bal Suraksha Child Protection Prototype • Track 2</span>
        </div>

        {/* Hero Headlines */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {t('heroSubhead')}
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/report"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-base shadow-glow-purple hover:shadow-glow-magenta hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3"
          >
            <ShieldAlert className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>{t('heroPrimaryCTA')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/how-it-works"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center space-x-2"
          >
            <span>{t('heroSecondaryCTA')}</span>
          </Link>
        </div>

        {/* Animated Process Flow Graphic */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Coordinated First-Mile Response Pipeline
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              {processSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center space-y-2 group hover:border-brand-purple/50 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold">{step.num}</span>
                    <span className="text-xs font-bold text-white">{t(step.titleKey)}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-xs font-semibold text-purple-300 font-mono tracking-wide">
              {t('aiHumanMotto')}
            </div>
          </div>
        </div>

      </section>

      {/* Emergency Notice Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-300">{t('emergencyCardTitle')}</h3>
              <p className="text-xs text-amber-200/90">{t('emergencyCardText')}</p>
            </div>
          </div>

          <Link
            to="/resources"
            className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold text-xs transition-all whitespace-nowrap"
          >
            View Emergency Resources
          </Link>
        </div>
      </section>

      {/* Three Application Roles Quick Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Explore Application Roles</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Test the complete ecosystem using Demo Mode role views for Citizen, Responder, and Admin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Role 1: Citizen / Reporter */}
          <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 text-brand-purple border border-brand-purple/40 flex items-center justify-center">
                <Send className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">ROLE 1</span>
              <h3 className="text-xl font-bold text-white">Citizen / Bystander</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mobile-first 30-second reporting flow. Anonymous reporting by default, face blur on photos, and Case ID tracking.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveRole('CITIZEN');
                navigate('/report');
              }}
              className="w-full py-3 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs shadow-sm transition-all"
            >
              Report a Concern
            </button>
          </div>

          {/* Role 2: Responder */}
          <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-magenta/20 text-brand-magenta border border-brand-magenta/40 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-magenta-400 uppercase">ROLE 2</span>
              <h3 className="text-xl font-bold text-white">Responder Command</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Desktop command center. Triage review, simulated smart network routing, incident maps, status updates, and missing-child matching.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveRole('RESPONDER');
                navigate('/responder');
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 transition-all"
            >
              Open Responder Dashboard
            </button>
          </div>

          {/* Role 3: Admin / Network Operator */}
          <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center">
                <Network className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase">ROLE 3</span>
              <h3 className="text-xl font-bold text-white">Admin & Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Executive level oversight. Recharts analytical visualizations, transit hub density analysis, and response time metrics.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveRole('ADMIN');
                navigate('/admin');
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 transition-all"
            >
              Open Admin Dashboard
            </button>
          </div>

        </div>
      </section>

      {/* Trusted Reporter Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-purple-950/60 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-left">
            <div className="flex items-center space-x-2 text-brand-purple font-mono font-bold text-xs uppercase">
              <HeartHandshake className="w-4 h-4" />
              <span>Community Protection Network</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">Are you a station vendor or rickshaw driver?</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Join the Trusted Community Reporter network for faster transit reporting, saved location presets, and verification badges.
            </p>
          </div>

          <Link
            to="/trusted-reporter"
            className="py-3.5 px-6 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs shadow-glow-purple whitespace-nowrap transition-all"
          >
            Become a Verified Reporter
          </Link>
        </div>
      </section>

    </div>
  );
};
