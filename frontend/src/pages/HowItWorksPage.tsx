import React from 'react';
import { Eye, Send, Cpu, ShieldCheck, Sparkles, ArrowRight, Network, FileCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: 'NOTICE',
      subtitle: 'Bystander Observation',
      desc: 'A citizen, railway staff member, station vendor, auto driver, or bystander notices a child who appears lost, distressed, travelling alone, or at risk.',
      icon: Eye,
      color: 'bg-accentBlue text-white',
      badgeColor: 'bg-accentBlue/10 text-accentBlue border-accentBlue/30',
      accentBorder: 'border-accentBlue'
    },
    {
      num: '02',
      title: 'REPORT',
      subtitle: '30-Second Anonymous Submission',
      desc: 'Using a fast mobile interface, the reporter submits incident type, approximate location, description, and optional photo with face-blur protection.',
      icon: Send,
      color: 'bg-teal-700 text-white',
      badgeColor: 'bg-teal-700/10 text-teal-700 dark:text-teal-300 border-teal-700/30',
      accentBorder: 'border-teal-700'
    },
    {
      num: '03',
      title: 'AI TRIAGE',
      subtitle: 'Advisory Risk Assessment',
      desc: 'Rakshak AI assesses trauma risk indicators (0–100 score), prioritizes urgent cases, and generates human-readable advisory explanations.',
      icon: Cpu,
      color: 'bg-accentPurple text-white',
      badgeColor: 'bg-accentPurple/10 text-accentPurple border-accentPurple/30',
      accentBorder: 'border-accentPurple'
    },
    {
      num: '04',
      title: 'CASE CREATED',
      subtitle: 'Unified Case Reference',
      desc: 'A unique reference ID (e.g., RKS-2026-00421) and trackable QR code are generated for continuous, secure monitoring.',
      icon: FileCheck,
      color: 'bg-accentCyan text-charcoal-950 font-bold',
      badgeColor: 'bg-accentCyan/10 text-accentCyan border-accentCyan/30',
      accentBorder: 'border-accentCyan'
    },
    {
      num: '05',
      title: 'RESPONDER CONNECTED',
      subtitle: 'Smart Dispatch Matrix',
      desc: 'Notifications dispatch simultaneously to platform RPF protection cells, child welfare desks, and verified support partners.',
      icon: Network,
      color: 'bg-accentOrange text-white',
      badgeColor: 'bg-accentOrange/10 text-accentOrange border-accentOrange/30',
      accentBorder: 'border-accentOrange'
    },
    {
      num: '06',
      title: 'FOLLOW-UP',
      subtitle: 'Safe Ground Resolution',
      desc: 'On-duty human responders conduct a physical ground check, update the live audit trail, and facilitate safe reunion or shelter handoff.',
      icon: ShieldCheck,
      color: 'bg-accentGreen text-white',
      badgeColor: 'bg-accentGreen/10 text-accentGreen border-accentGreen/30',
      accentBorder: 'border-accentGreen'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-700/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-700/20 dark:border-teal-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Product Walkthrough</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal-800 dark:text-charcoal-100">
          How Rakshak turns a concern into coordinated action.
        </h1>
        <p className="text-base text-charcoal-600 dark:text-charcoal-300">
          An end-to-end humanitarian technology bridge connecting public observations to ground responders.
        </p>
      </div>

      {/* 6-Step Visual Journey */}
      <div className="space-y-6 relative">
        <div className="hidden lg:block absolute left-8 top-10 bottom-10 w-0.5 bg-charcoal-200 dark:bg-charcoal-800 -z-10" />

        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className={`natural-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-6 shadow-card relative border-l-4 ${step.accentBorder} transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-center space-x-4 flex-shrink-0">
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center font-bold text-xl shadow-md`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="font-mono text-3xl font-extrabold text-charcoal-800 dark:text-charcoal-100">{step.num}</div>
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-charcoal-800 dark:text-charcoal-100 tracking-tight">{step.title}</h3>
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${step.badgeColor}`}>
                    {step.subtitle}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <Link
          to="/report"
          className="inline-flex items-center space-x-2 py-4 px-8 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-card hover:scale-105 transition-all"
        >
          <span>{t('btnReportConcern')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
