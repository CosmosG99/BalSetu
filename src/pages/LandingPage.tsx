import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
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
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  Zap,
  HelpCircle,
  FileText
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const workflowSteps = [
    {
      num: '01',
      titleKey: 'stepNoticeTitle',
      subKey: 'stepNoticeSub',
      descKey: 'stepNoticeDesc',
      icon: Eye,
      mockDesc: 'Platform 4 • Child alone near ticket counter • Crying'
    },
    {
      num: '02',
      titleKey: 'stepReportTitle',
      subKey: 'stepReportSub',
      descKey: 'stepReportDesc',
      icon: Send,
      mockDesc: 'Case ID: RB-2026-10482 • Anonymous = ON • Face Blur = ACTIVE'
    },
    {
      num: '03',
      titleKey: 'stepRespondTitle',
      subKey: 'stepRespondSub',
      descKey: 'stepRespondDesc',
      icon: ShieldCheck,
      mockDesc: 'Officer R. Sharma assigned • Ground welfare check in progress'
    }
  ];

  const productCapabilities = [
    { titleKey: 'cap30sTitle', descKey: 'cap30sDesc', icon: Zap, color: 'text-brand-purple' },
    { titleKey: 'capAiTitle', descKey: 'capAiDesc', icon: Cpu, color: 'text-brand-magenta' },
    { titleKey: 'capIdTitle', descKey: 'capIdDesc', icon: FileText, color: 'text-blue-400' },
    { titleKey: 'capRoutingTitle', descKey: 'capRoutingDesc', icon: Network, color: 'text-indigo-400' },
    { titleKey: 'capTrackingTitle', descKey: 'capTrackingDesc', icon: Lock, color: 'text-emerald-400' },
    { titleKey: 'capResponseTitle', descKey: 'capResponseDesc', icon: ShieldCheck, color: 'text-purple-300' }
  ];

  const faqs = [
    {
      q: 'What is Rakshak?',
      a: 'Rakshak is a first-mile child-safety coordination platform designed for transit hubs, railway stations, and bus terminals. It connects bystander observations to a coordinated response network quickly, safely, and anonymously.'
    },
    {
      q: 'Can I report a concern completely anonymously?',
      a: 'Yes. Anonymous reporting is enabled by default. We do not require your name, phone number, email, or account creation to submit a child safety concern.'
    },
    {
      q: 'Does Rakshak use facial recognition to identify children?',
      a: 'No. Rakshak does NOT perform facial identification or public surveillance. Images submitted by bystanders automatically feature face-blur protection and are strictly restricted to authorized ground responders for physical verification.'
    },
    {
      q: 'Who receives the submitted report?',
      a: 'Reports are processed through Rakshak AI triage and dispatched to the designated local station response cell, child help desk, and verified support partners at that specific transit node.'
    },
    {
      q: 'Is Rakshak connected to government systems?',
      a: 'Integrations displayed in this application represent simulated response concepts. Rakshak is designed to complement existing child protection systems.'
    },
    {
      q: 'What happens after I submit a report?',
      a: 'You receive a unique Case ID (e.g. RB-2026-10482) and QR code. You can track high-level resolution progress anytime without exposing sensitive data.'
    },
    {
      q: 'What information is stored?',
      a: 'Only the incident description, approximate station location, timestamp, and optional evidence media necessary for ground responders to assess the situation.'
    },
    {
      q: 'Can I track my report status?',
      a: 'Yes. Use your unique Case ID on the /track page to view high-level milestone progress (e.g., Report Received → AI Triaged → Responder Assigned → Resolved).'
    }
  ];

  return (
    <div className="space-y-28 pb-20 overflow-x-hidden">
      
      {/* Privacy Guarantee Top Strip */}
      <div className="bg-brand-purple/10 border-b border-brand-purple/25 text-purple-200 text-xs py-2.5 px-4 text-center flex items-center justify-center space-x-2 font-medium">
        <Lock className="w-3.5 h-3.5 text-brand-magenta" />
        <span>{t('heroAnonBadge')} • {t('heroPrivacyBadge')} • {t('heroHumanBadge')}</span>
      </div>

      {/* ============================================================ */}
      {/* 1. CINEMATIC HERO SECTION                                      */}
      {/* ============================================================ */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Glow & Backdrop Accents */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-purple/25 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-magenta/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-xs font-bold text-purple-700 dark:text-purple-300 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-brand-magenta animate-pulse" />
              <span>{t('heroBadge')}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              {t('heroHeadline1')} <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-brand-purple via-purple-600 dark:via-purple-300 to-brand-magenta bg-clip-text text-transparent">
                {t('heroHeadlineHighlight')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed">
              {t('heroSubhead')}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/report"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple hover:shadow-glow-magenta hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <span>{t('heroReportCTA')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/how-it-works"
                className="px-8 py-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 transition-all flex items-center justify-center space-x-2 text-center shadow-sm"
              >
                <span>{t('heroHowCTA')}</span>
              </Link>
            </div>

            <div className="pt-2 flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {t('heroAnonBadge')}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {t('heroPrivacyBadge')}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {t('heroHumanBadge')}
              </span>
            </div>

          </div>

          {/* Hero Right Column: Transit Concourse Simulation + Live Case Card */}
          <div className="lg:col-span-5 relative">
            
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl relative space-y-4 overflow-hidden">
              
              <div className="relative h-64 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                
                <svg className="absolute inset-0 w-full h-full opacity-40">
                  <path d="M 0 100 Q 150 50 300 120 T 450 80" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 0 180 Q 200 120 450 160" fill="none" stroke="#D946EF" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                <div className="relative w-28 h-28 rounded-full border-2 border-brand-purple/40 flex items-center justify-center animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-brand-purple/20 border border-brand-purple/60 flex items-center justify-center text-brand-purple">
                    <MapPin className="w-8 h-8 animate-bounce" />
                  </div>
                </div>

                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>{t('liveTransitRadar')}</span>
                </div>
              </div>

              {/* Floating Case Overlay */}
              <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-brand-purple/40 shadow-glow-purple space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-brand-purple">RB-2026-10482</span>
                  <RiskBadge level="HIGH" score={78} size="sm" />
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white">{t('incDistressed')}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Mumbai Central Station • Platform 4</span>
                  <StatusBadge status="ROUTED" size="sm" />
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* 2. SECTION — WHY THIS MATTERS (THE FIRST-MILE GAP)            */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8 shadow-2xl">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-brand-magenta uppercase">{t('firstMileGapTitle')}</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t('firstMileGapHeading')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {t('firstMileGapDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <div className="text-xs font-bold text-purple-700 dark:text-purple-300">{t('bystanderSignal')}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t('bystanderSignalDesc')}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <div className="text-xs font-bold text-amber-700 dark:text-amber-300">{t('uncertainty')}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t('uncertaintyDesc')}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <div className="text-xs font-bold text-red-600 dark:text-red-400">{t('criticalDelay')}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t('criticalDelayDesc')}</p>
            </div>

            <div className="p-5 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 border border-brand-purple/40 space-y-2 shadow-sm">
              <div className="text-xs font-bold text-slate-900 dark:text-white">{t('rakshakBridge')}</div>
              <p className="text-xs text-purple-900 dark:text-purple-200">{t('rakshakBridgeDesc')}</p>
            </div>
          </div>

          <div className="text-center pt-2 font-mono text-xs font-bold text-brand-purple">
            {t('rakshakClosesGap')}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SECTION — HOW RAKSHAK WORKS (SIMPLE 3-STEP PROCESS)        */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">{t('processBadge')}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{t('processHeading')}</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {t('processSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowSteps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="glass-panel glass-panel-hover p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 text-left shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple border border-brand-purple/30 flex items-center justify-center font-bold text-xl">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300">{s.num}</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{t(s.titleKey)}</h3>
                  <div className="text-xs font-semibold text-brand-purple">{t(s.subKey)}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{t(s.descKey)}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  {s.mockDesc}
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ============================================================ */}
      {/* 4. SECTION — PRODUCT CAPABILITIES                             */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-brand-purple uppercase">{t('capabilitiesBadge')}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{t('capabilitiesHeading')}</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {t('capabilitiesSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCapabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-3 text-left shadow-lg"
              >
                <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center ${cap.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{t(cap.titleKey)}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{t(cap.descKey)}</p>
              </div>
            );
          })}
        </div>

      </section>

      {/* ============================================================ */}
      {/* 5. SECTION — PRIVACY & SAFETY                                 */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8 text-center shadow-2xl">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t('privacyQuote')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {t('privacySub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <div className="text-xs font-bold text-slate-900 dark:text-white">{t('privacyAnonTitle')}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t('privacyAnonDesc')}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <div className="text-xs font-bold text-slate-900 dark:text-white">{t('privacyMinimalTitle')}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t('privacyMinimalDesc')}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <div className="text-xs font-bold text-slate-900 dark:text-white">{t('privacyHumanTitle')}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t('privacyHumanDesc')}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <div className="text-xs font-bold text-slate-900 dark:text-white">{t('privacyNoPublicTitle')}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t('privacyNoPublicDesc')}</p>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. SECTION — RESPONSE ECOSYSTEM                               */}
      {/* ============================================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Simulated Network Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Response Ecosystem</h2>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono font-bold">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-white">CITIZEN REPORT</div>
            <span className="text-brand-purple">→</span>
            <div className="p-3 rounded-xl bg-brand-purple text-white shadow-glow-purple">RAKSHAK AI TRIAGE</div>
            <span className="text-brand-purple">→</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-purple-300">Railway Response</div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-magenta-300">Child Protection</div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">Support Partner</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Note: All network routing options represented in this application are simulated concepts.
          </p>
        </div>

      </section>

      {/* ============================================================ */}
      {/* 7. SECTION — IMPACT / COVERAGE                                */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">{t('targetsBadge')}</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t('targetsHeading')}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-purple font-mono">{t('target30s')}</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase">{t('target30sLabel')}</div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-magenta font-mono">{t('target1Id')}</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase">{t('target1IdLabel')}</div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-500 dark:text-blue-400 font-mono">{t('target3Layers')}</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase">{t('target3LayersLabel')}</div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{t('target247')}</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase">{t('target247Label')}</div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. SECTION — RESOURCES & TRUSTED REPORTER                     */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-purple-950/60 border border-purple-500/30 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-2 text-left">
            <span className="text-xs font-mono font-bold text-brand-purple uppercase flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              {t('communityBadge')}
            </span>
            <h3 className="text-xl font-extrabold text-white">{t('trustedRepHeading')}</h3>
            <p className="text-xs text-slate-300">
              {t('trustedRepDesc')}
            </p>
          </div>

          <Link
            to="/trusted-reporter"
            className="py-3 px-5 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs shadow-glow-purple inline-block text-center transition-all"
          >
            {t('exploreTrustedBtn')}
          </Link>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-2 text-left">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              {t('safetyEduBadge')}
            </span>
            <h3 className="text-xl font-extrabold text-white">{t('safetyEduHeading')}</h3>
            <p className="text-xs text-slate-300">
              {t('safetyEduDesc')}
            </p>
          </div>

          <Link
            to="/resources"
            className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 inline-block text-center transition-all"
          >
            {t('exploreResourcesBtn')}
          </Link>
        </div>

      </section>

      {/* ============================================================ */}
      {/* 9. FAQ ACCORDION SECTION                                     */}
      {/* ============================================================ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-brand-purple uppercase">{t('faqBadge')}</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t('faqHeading')}</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/60 transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-brand-purple" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* ============================================================ */}
      {/* 10. HUGE FINAL CLOSING CTA SECTION                            */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-purple-950/80 border border-brand-purple/40 space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {t('finalCtaHeading')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {t('finalCtaSub')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/report"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{t('heroReportCTA')}</span>
            </Link>
            <Link
              to="/how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 transition-all text-center"
            >
              <span>{t('heroHowCTA')}</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
