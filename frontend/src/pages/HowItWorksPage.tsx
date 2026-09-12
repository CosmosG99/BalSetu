import React from 'react';
import { Eye, Send, Cpu, ShieldCheck, Sparkles, ArrowRight, Network } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  const { t } = useLanguage();

  const narrativeSteps = [
    {
      num: '01',
      title: 'NOTICE',
      subtitle: 'Bystander Observation',
      desc: 'A citizen, railway staff member, station vendor, auto driver, or bystander notices a child who appears lost, distressed, travelling alone, or at risk.',
      icon: Eye,
      iconColor: 'text-accentCyan',
      iconBg: 'bg-accentCyan/15 border-accentCyan/30 group-hover:bg-accentCyan/25',
      numColor: 'text-accentCyan',
      badgeColor: 'bg-accentCyan/10 text-accentCyan border-accentCyan/30',
      accentBorder: 'hover:border-accentCyan/60'
    },
    {
      num: '02',
      title: 'REPORT',
      subtitle: '30-Second Anonymous Submission',
      desc: 'Using a fast mobile interface, the reporter submits incident type, approximate location, description, and optional photo with face-blur protection.',
      icon: Send,
      iconColor: 'text-teal-700 dark:text-teal-400',
      iconBg: 'bg-teal-700/15 dark:bg-teal-500/25 border-teal-700/30 group-hover:bg-teal-700/25',
      numColor: 'text-teal-700 dark:text-teal-400',
      badgeColor: 'bg-teal-700/10 text-teal-700 dark:text-teal-300 border-teal-700/30',
      accentBorder: 'hover:border-teal-700/60'
    },
    {
      num: '03',
      title: 'ASSESS',
      subtitle: 'Advisory AI Triage',
      desc: 'Rakshak AI assesses trauma risk indicators (0–100 score), prioritizes urgent cases, and generates human-readable advisory explanations.',
      icon: Cpu,
      iconColor: 'text-accentPurple',
      iconBg: 'bg-accentPurple/15 border-accentPurple/30 group-hover:bg-accentPurple/25',
      numColor: 'text-accentPurple',
      badgeColor: 'bg-accentPurple/10 text-accentPurple border-accentPurple/30',
      accentBorder: 'hover:border-accentPurple/60'
    },
    {
      num: '04',
      title: 'ROUTE',
      subtitle: 'Smart Dispatch Matrix',
      desc: 'Notifications dispatch simultaneously to platform RPF protection cells, child welfare desks, and verified support partners.',
      icon: Network,
      iconColor: 'text-accentOrange',
      iconBg: 'bg-accentOrange/15 border-accentOrange/30 group-hover:bg-accentOrange/25',
      numColor: 'text-accentOrange',
      badgeColor: 'bg-accentOrange/10 text-accentOrange border-accentOrange/30',
      accentBorder: 'hover:border-accentOrange/60'
    },
    {
      num: '05',
      title: 'RESPOND',
      subtitle: 'Safe Ground Resolution',
      desc: 'On-duty human responders conduct a physical ground check, update the live audit trail, and facilitate safe reunion or shelter handoff.',
      icon: ShieldCheck,
      iconColor: 'text-accentGreen',
      iconBg: 'bg-accentGreen/15 border-accentGreen/30 group-hover:bg-accentGreen/25',
      numColor: 'text-accentGreen',
      badgeColor: 'bg-accentGreen/10 text-accentGreen border-accentGreen/30',
      accentBorder: 'hover:border-accentGreen/60'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Top Hero with Dual CTAs */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
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

        {/* Dual Top CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            to="/report"
            className="px-7 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-card hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2"
          >
            <span>REPORT A CONCERN</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/responder"
            className="px-7 py-3.5 rounded-xl bg-teal-700/10 hover:bg-teal-700/20 dark:bg-teal-500/20 dark:hover:bg-teal-500/30 text-teal-700 dark:text-teal-300 border border-teal-700/30 dark:border-teal-500/40 font-bold text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2"
          >
            <span>EXPLORE RESPONDER PORTAL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 5-Step Visual Journey with Colorful Accents */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-charcoal-800 dark:text-charcoal-100">From Observation to Safe Reunion</h2>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-400">Five coordinated steps ensuring fast escalation and verified resolution.</p>
        </div>

        <div className="space-y-4">
          {narrativeSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`natural-panel p-6 sm:p-7 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-6 shadow-card transition-all duration-200 hover:-translate-y-1 group border border-charcoal-200/80 dark:border-white/10 ${step.accentBorder}`}
              >
                <div className="flex items-center space-x-4 flex-shrink-0">
                  <div className={`w-14 h-14 rounded-2xl border ${step.iconBg} flex items-center justify-center font-bold text-xl shadow-xs transition-all`}>
                    <Icon className={`w-7 h-7 ${step.iconColor}`} />
                  </div>
                  <div className={`font-mono text-3xl font-extrabold ${step.numColor}`}>{step.num}</div>
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-charcoal-800 dark:text-charcoal-100 tracking-tight">{step.title}</h3>
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
      </div>

      {/* Software Preview Section with Secondary CTA retained */}
      <div className="natural-panel p-6 sm:p-10 rounded-3xl space-y-6 shadow-modal border border-charcoal-200 dark:border-charcoal-800 text-center">
        <h2 className="text-2xl font-extrabold text-charcoal-800 dark:text-charcoal-100">
          Inside the Responder Command Center
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 max-w-xl mx-auto">
          Explore the live operational dashboard used by platform responders and child protection desks to triage, assign, and resolve active cases.
        </p>

        <div className="pt-2">
          <Link
            to="/responder"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-card transition-all"
          >
            <span>EXPLORE FULL RESPONDER PORTAL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
