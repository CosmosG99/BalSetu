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
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  HelpCircle,
  FileText,
  MapPin,
  Layers,
  Activity,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activePreviewTab, setActivePreviewTab] = useState<'queue' | 'ai' | 'map'>('queue');

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const narrativeSteps = [
    {
      num: '01',
      title: 'NOTICE',
      sub: 'Bystander Observation',
      desc: 'A citizen, railway staff member, or vendor spots a child travelling alone or showing signs of distress at a station.',
      icon: Eye,
      tag: 'Step 1'
    },
    {
      num: '02',
      title: 'REPORT',
      subtitle: '30-Second Mobile Submission',
      desc: 'Quick report submitted without creating an account. Optional face-blur photo protection is automatically applied.',
      icon: Send,
      tag: 'Step 2'
    },
    {
      num: '03',
      title: 'ASSESS',
      subtitle: 'Advisory AI Triage',
      desc: 'Rakshak AI assesses trauma risk indicators (0–100 score) and provides human-readable explanations.',
      icon: Cpu,
      tag: 'Step 3'
    },
    {
      num: '04',
      title: 'ROUTE',
      subtitle: 'Smart Dispatch Matrix',
      desc: 'Notifications dispatch simultaneously to platform RPF protection cells, welfare desks, and verified NGO partners.',
      icon: Network,
      tag: 'Step 4'
    },
    {
      num: '05',
      title: 'RESPOND',
      subtitle: 'Ground Welfare Verification',
      desc: 'On-duty responders conduct physical verification, update the live audit log, and facilitate safe reunion.',
      icon: ShieldCheck,
      tag: 'Step 5'
    }
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
      
      {/* Privacy Guarantee Top Banner */}
      <div className="bg-teal-700/10 dark:bg-teal-500/20 border-b border-teal-700/20 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 text-xs py-2.5 px-4 text-center flex items-center justify-center space-x-2 font-semibold">
        <Lock className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
        <span>{t('heroAnonBadge')} • {t('heroPrivacyBadge')} • {t('heroHumanBadge')}</span>
      </div>

      {/* ============================================================ */}
      {/* 1. WEALTH DNA-INSPIRED HERO SECTION                          */}
      {/* ============================================================ */}
      <section className="relative pt-4 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-700/10 dark:bg-teal-500/20 border border-teal-700/20 dark:border-teal-500/30 text-[11px] font-bold text-teal-800 dark:text-teal-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span className="uppercase tracking-wider">A SAFER TOMORROW FOR EVERY CHILD</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal-800 dark:text-charcoal-100 tracking-tight leading-[1.15]">
              Turn a moment <br className="hidden sm:block" />
              of concern into a <br className="hidden sm:block" />
              <span className="text-teal-700 dark:text-teal-400">moment of protection.</span>
            </h1>

            <p className="text-base text-charcoal-600 dark:text-charcoal-400 max-w-xl leading-relaxed">
              Rakshak connects citizens who notice vulnerable or lost children in public transit hubs with an advisory AI-assisted ground response network — quickly, safely, and anonymously.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/report"
                className="px-7 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-card hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <span>REPORT A CONCERN</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/how-it-works"
                className="px-7 py-3.5 rounded-xl bg-white dark:bg-charcoal-900 hover:bg-ivory-100 dark:hover:bg-charcoal-850 text-charcoal-800 dark:text-charcoal-100 font-bold text-sm border border-charcoal-200 dark:border-charcoal-800 transition-all flex items-center justify-center space-x-2 text-center shadow-sm"
              >
                <span>See How It Works</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-charcoal-800 dark:text-charcoal-200">
              <div className="p-2.5 rounded-xl bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 flex items-center space-x-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
                <span className="truncate">Anonymous Reporting</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 flex items-center space-x-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
                <span className="truncate">Privacy First</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 flex items-center space-x-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
                <span className="truncate">AI-Assisted Triage</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 flex items-center space-x-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
                <span className="truncate">Coordinated Response</span>
              </div>
            </div>

          </div>

          {/* Hero Right Column: Prominent Child Safety Photo Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-charcoal-200 dark:border-charcoal-800 shadow-modal bg-charcoal-900">
              
              <img
                src="/hero_child_safety.png"
                alt="Community transit officer safely guiding a child"
                className="w-full h-[440px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/20 to-transparent" />

              {/* Embedded Floating Case Status Pill */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border border-charcoal-200 dark:border-charcoal-800 shadow-card flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-extrabold text-teal-700 dark:text-teal-400">RKS-2026-00421</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-coral-500/10 text-coral-600 dark:text-coral-400 border border-coral-500/20">HIGH PRIORITY</span>
                  </div>
                  <div className="text-xs font-bold text-charcoal-800 dark:text-charcoal-100">Child appears lost & distressed</div>
                  <div className="text-[11px] text-charcoal-600 dark:text-charcoal-400">Mumbai Central Station • Platform 4</div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <RiskBadge level="HIGH" score={78} size="sm" />
                  <StatusBadge status="ROUTED" size="sm" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. PRODUCT STORYTELLING NARRATIVE (01 to 05)                */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Coordinated Protection Lifecycle
          </span>
          <h2 className="text-3xl font-extrabold text-charcoal-800 dark:text-charcoal-100 tracking-tight">
            From Observation to Safe Reunion
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400">
            How Rakshak coordinates bystanders, AI triage, and ground responders seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {narrativeSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="natural-panel natural-card-hover p-5 rounded-2xl space-y-3 shadow-card flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-extrabold text-teal-700 dark:text-teal-400">{step.num}</span>
                    <div className="p-2 rounded-xl bg-teal-700/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-charcoal-800 dark:text-charcoal-100 tracking-tight">{step.title}</h3>
                    <div className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">{step.subtitle}</div>
                  </div>

                  <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-charcoal-200/60 dark:border-charcoal-800 text-[10px] font-mono text-charcoal-500 uppercase tracking-wider">
                  {step.tag}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. INSIDE RAKSHAK — SOFTWARE PREVIEW (WEALTH DNA STYLE)     */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="natural-panel p-6 sm:p-10 rounded-3xl space-y-6 shadow-modal border border-charcoal-200 dark:border-charcoal-800">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-charcoal-200/80 dark:border-charcoal-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                SOFTWARE PREVIEW
              </span>
              <h2 className="text-2xl font-extrabold text-charcoal-800 dark:text-charcoal-100">
                Inside the Responder Command Center
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActivePreviewTab('queue')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activePreviewTab === 'queue'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-ivory-100 dark:bg-charcoal-850 text-charcoal-600 dark:text-charcoal-300'
                }`}
              >
                Queue Overview
              </button>
              <button
                onClick={() => setActivePreviewTab('ai')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activePreviewTab === 'ai'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-ivory-100 dark:bg-charcoal-850 text-charcoal-600 dark:text-charcoal-300'
                }`}
              >
                AI Triage Matrix
              </button>
            </div>
          </div>

          {/* Simulated App Shell Preview */}
          <div className="rounded-2xl border border-charcoal-200 dark:border-charcoal-800 bg-ivory-100 dark:bg-charcoal-950 p-4 sm:p-6 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between border-b border-charcoal-200 dark:border-charcoal-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-coral-500" />
                <span className="w-3 h-3 rounded-full bg-amberGold-500" />
                <span className="w-3 h-3 rounded-full bg-mint-500" />
                <span className="text-xs font-mono font-bold text-charcoal-600 dark:text-charcoal-400 ml-2">rakshak-responder-portal.app</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400 bg-teal-700/10 px-2 py-0.5 rounded">
                SIMULATED PREVIEW
              </span>
            </div>

            {activePreviewTab === 'queue' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800">
                    <div className="text-xl font-extrabold font-mono text-charcoal-800 dark:text-charcoal-100">24</div>
                    <div className="text-[10px] font-bold text-charcoal-500 uppercase">Active Cases</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800">
                    <div className="text-xl font-extrabold font-mono text-coral-600">7</div>
                    <div className="text-[10px] font-bold text-charcoal-500 uppercase">High Priority</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800">
                    <div className="text-xl font-extrabold font-mono text-teal-700 dark:text-teal-400">83</div>
                    <div className="text-[10px] font-bold text-charcoal-500 uppercase">Resolved</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <RiskBadge level="HIGH" score={78} size="sm" />
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-400">RKS-2026-00421</span>
                    <span className="font-bold text-charcoal-800 dark:text-charcoal-100">Child lost near platform 4</span>
                  </div>
                  <StatusBadge status="ROUTED" size="sm" />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-charcoal-800 dark:text-charcoal-100">AI Risk Indicator Assessment</span>
                  <span className="font-mono font-bold text-teal-700 dark:text-teal-400">Score: 78/100</span>
                </div>
                <p className="text-charcoal-600 dark:text-charcoal-400">
                  Indicators detected: Unaccompanied minor in high-density transit node during late evening hours without adult supervision.
                </p>
                <div className="text-[11px] font-mono text-charcoal-500 pt-1">
                  Note: AI provides advisory recommendations only. Human verification required before taking official ground action.
                </div>
              </div>
            )}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/responder"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-card transition-all"
            >
              <span>EXPLORE FULL RESPONDER PORTAL</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FAQ ACCORDION SECTION                                     */}
      {/* ============================================================ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-700/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800 dark:text-charcoal-100">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="natural-panel rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-sm text-charcoal-800 dark:text-charcoal-100 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-charcoal-600 dark:text-charcoal-400 flex-shrink-0" />
                )}
              </button>

              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed border-t border-charcoal-200/50 dark:border-charcoal-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. BOTTOM CTA BANNER                                         */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-teal-700 text-white text-center space-y-6 shadow-modal relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Notice a Child Alone or Distressed?
            </h2>
            <p className="text-sm text-teal-100 leading-relaxed">
              Every second matters in a public transit hub. Submit an anonymous 30-second report to alert local protection teams immediately.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2 relative z-10">
            <Link
              to="/report"
              className="py-3.5 px-8 rounded-xl bg-white text-teal-900 font-extrabold text-sm shadow-card hover:bg-ivory-100 hover:scale-[1.02] transition-all flex items-center space-x-2"
            >
              <span>REPORT A CONCERN NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/track"
              className="py-3.5 px-8 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm border border-teal-500/40 shadow-sm transition-all"
            >
              Track Existing Report
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
