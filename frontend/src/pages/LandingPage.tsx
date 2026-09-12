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
      mockDesc: 'Platform 4 • Child alone near ticket counter'
    },
    {
      num: '02',
      titleKey: 'stepReportTitle',
      subKey: 'stepReportSub',
      descKey: 'stepReportDesc',
      icon: Send,
      mockDesc: 'Case ID: RKS-2026-00421 • Anonymous = ON'
    },
    {
      num: '03',
      titleKey: 'stepRespondTitle',
      subKey: 'stepRespondSub',
      descKey: 'stepRespondDesc',
      icon: ShieldCheck,
      mockDesc: 'Officer R. Sharma assigned • Welfare check active'
    }
  ];

  const productCapabilities = [
    { titleKey: 'cap30sTitle', descKey: 'cap30sDesc', icon: Zap, color: 'text-forest-900 dark:text-sage-300' },
    { titleKey: 'capAiTitle', descKey: 'capAiDesc', icon: Cpu, color: 'text-terracotta-600 dark:text-terracotta-500' },
    { titleKey: 'capIdTitle', descKey: 'capIdDesc', icon: FileText, color: 'text-forest-800 dark:text-sage-400' },
    { titleKey: 'capRoutingTitle', descKey: 'capRoutingDesc', icon: Network, color: 'text-amberGold-600' },
    { titleKey: 'capTrackingTitle', descKey: 'capTrackingDesc', icon: Lock, color: 'text-forest-900 dark:text-sage-300' },
    { titleKey: 'capResponseTitle', descKey: 'capResponseDesc', icon: ShieldCheck, color: 'text-sage-600' }
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
      a: 'You receive a unique Case ID (e.g. RKS-2026-00421) and QR code. You can track high-level resolution progress anytime without exposing sensitive data.'
    }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      
      {/* Privacy Guarantee Top Strip */}
      <div className="bg-forest-900/10 dark:bg-forest-800/20 border-b border-forest-900/20 dark:border-forest-700/30 text-forest-900 dark:text-sage-300 text-xs py-2.5 px-4 text-center flex items-center justify-center space-x-2 font-medium">
        <Lock className="w-3.5 h-3.5 text-forest-900 dark:text-sage-300" />
        <span>{t('heroAnonBadge')} • {t('heroPrivacyBadge')} • {t('heroHumanBadge')}</span>
      </div>

      {/* ============================================================ */}
      {/* 1. ASYMMETRIC HERO SECTION (MATCHING BLUEPRINT)              */}
      {/* ============================================================ */}
      <section className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-forest-900/10 dark:bg-forest-800/30 border border-forest-900/20 dark:border-forest-700/40 text-[11px] font-bold text-forest-900 dark:text-sage-300">
              <Sparkles className="w-3.5 h-3.5 text-forest-900 dark:text-sage-300" />
              <span className="uppercase tracking-wider">A SAFER TOMORROW FOR EVERY CHILD</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal-800 dark:text-ivory-100 tracking-tight leading-[1.15]">
              Turn a moment <br className="hidden sm:block" />
              of concern into a <br className="hidden sm:block" />
              <span className="text-forest-900 dark:text-sage-300">moment of protection.</span>
            </h1>

            <p className="text-base text-charcoal-600 dark:text-charcoal-400 max-w-xl leading-relaxed">
              Rakshak connects people who notice vulnerable children with a coordinated response ecosystem — quickly, safely and anonymously.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/report"
                className="px-7 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-sm shadow-subtle hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <span>Report a Concern</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/how-it-works"
                className="px-7 py-3.5 rounded-xl bg-white dark:bg-charcoal-900 hover:bg-ivory-100 dark:hover:bg-charcoal-800 text-charcoal-800 dark:text-ivory-100 font-semibold text-sm border border-charcoal-200 dark:border-charcoal-800 transition-all flex items-center justify-center space-x-2 text-center shadow-sm"
              >
                <span>See How It Works</span>
              </Link>
            </div>

            {/* Pill Features List at Bottom of Left Column */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
              <div className="p-2 rounded-xl bg-white/80 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 flex items-center space-x-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-900 dark:text-sage-300 flex-shrink-0" />
                <span className="truncate">Anonymous Reporting</span>
              </div>
              <div className="p-2 rounded-xl bg-white/80 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 flex items-center space-x-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-900 dark:text-sage-300 flex-shrink-0" />
                <span className="truncate">Privacy First</span>
              </div>
              <div className="p-2 rounded-xl bg-white/80 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 flex items-center space-x-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-900 dark:text-sage-300 flex-shrink-0" />
                <span className="truncate">AI-Assisted Triage</span>
              </div>
              <div className="p-2 rounded-xl bg-white/80 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 flex items-center space-x-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-900 dark:text-sage-300 flex-shrink-0" />
                <span className="truncate">Coordinated Response</span>
              </div>
            </div>

          </div>

          {/* Hero Right Column: Warm, Human Transit Image Container */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-charcoal-200 dark:border-charcoal-800 shadow-modal bg-charcoal-900">
              
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
                alt="Child at transit station concourse"
                className="w-full h-[420px] object-cover opacity-90 brightness-95"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border border-charcoal-200 dark:border-charcoal-800 shadow-card flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-mono text-xs font-extrabold text-forest-900 dark:text-sage-300">RKS-2026-00421</span>
                  <div className="text-xs font-bold text-charcoal-800 dark:text-ivory-100">Child appears lost & distressed</div>
                  <div className="text-[11px] text-charcoal-500">Mumbai Central Station • Platform 4</div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <RiskBadge level="HIGH" score={78} size="sm" />
                  <StatusBadge status="ROUTED" size="sm" />
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-charcoal-950/80 backdrop-blur-md text-ivory-100 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-charcoal-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-terracotta-600 animate-ping" />
                <span>A safer tomorrow is a shared responsibility</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SECTION — FROM NOTICE TO ACTION (3-CARD WORKFLOW)          */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-charcoal-200/80 dark:border-charcoal-800 pb-4 gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-forest-900 dark:text-sage-400 uppercase">HOW RAKSHAK WORKS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800 dark:text-ivory-100">From notice to action.</h2>
            <p className="text-xs text-charcoal-500">A simple process. A stronger tomorrow.</p>
          </div>
          <Link to="/how-it-works" className="text-xs font-bold text-forest-900 dark:text-sage-300 hover:underline">
            Learn more about workflow →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowSteps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="natural-panel p-6 space-y-4 natural-card-hover text-left flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-forest-900/10 dark:bg-forest-800/30 text-forest-900 dark:text-sage-300 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-extrabold text-forest-900 dark:text-sage-400">{s.num}</span>
                  </div>

                  <h3 className="text-lg font-bold text-charcoal-800 dark:text-ivory-100">{t(s.titleKey)}</h3>
                  <div className="text-xs font-semibold text-forest-900 dark:text-sage-300">{t(s.subKey)}</div>
                  <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">{t(s.descKey)}</p>
                </div>

                <div className="p-3 rounded-xl bg-ivory-100/80 dark:bg-charcoal-950 border border-charcoal-200/80 dark:border-charcoal-800 text-[11px] font-mono text-charcoal-600 dark:text-charcoal-400">
                  {s.mockDesc}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SECTION — PRODUCT CAPABILITIES                             */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-mono font-bold text-forest-900 dark:text-sage-400 uppercase">Core Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800 dark:text-ivory-100">Product Capabilities</h2>
          <p className="text-xs text-charcoal-500">Built for speed, privacy, and responder coordination.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCapabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div key={idx} className="natural-panel p-6 space-y-3 natural-card-hover text-left">
                <div className="w-9 h-9 rounded-xl bg-ivory-100 dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${cap.color}`} />
                </div>
                <h3 className="text-base font-bold text-charcoal-800 dark:text-ivory-100">{t(cap.titleKey)}</h3>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">{t(cap.descKey)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SECTION — FAQ ACCORDION                                    */}
      {/* ============================================================ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-forest-900 dark:text-sage-400 uppercase">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="text-2xl font-extrabold text-charcoal-800 dark:text-ivory-100">Everything You Need to Know</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="natural-panel overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm font-bold text-charcoal-800 dark:text-ivory-100 hover:bg-ivory-100 dark:hover:bg-charcoal-850 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-forest-900 dark:text-sage-300" /> : <ChevronDown className="w-4 h-4 text-charcoal-400" />}
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed border-t border-charcoal-200/80 dark:border-charcoal-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FINAL CLOSING CTA SECTION                                  */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-forest-900 text-ivory-100 space-y-6 shadow-modal relative overflow-hidden">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              See something concerning?
            </h2>
            <p className="text-xs text-sage-200">
              A structured report can help the right people respond faster.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/report"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-ivory-100 hover:bg-white text-forest-950 font-bold text-sm shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <ShieldAlert className="w-4 h-4 text-terracotta-600" />
              <span>Report a Concern</span>
            </Link>
            <Link
              to="/how-it-works"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-forest-950/60 hover:bg-forest-950 text-ivory-100 font-semibold text-sm border border-forest-800 transition-all text-center"
            >
              <span>How It Works</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
