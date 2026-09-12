import React from 'react';
import { Eye, Send, Cpu, Network, ShieldCheck, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: 'SPOT',
      subtitle: 'Notice something that doesn\'t feel right.',
      desc: 'A citizen, railway staff member, station vendor, auto driver, or bystander notices a child who appears lost, distressed, travelling alone, or at possible risk in a high-footfall transit area.',
      icon: Eye,
      bgColor: 'bg-forest-900 text-ivory-100'
    },
    {
      num: '02',
      title: 'REPORT',
      subtitle: 'Submit a quick report without creating an account.',
      desc: 'Using a 30-second mobile-first interface, the bystander submits key details: incident type, approximate location, description, optional photo with face-blur, and anonymous status.',
      icon: Send,
      bgColor: 'bg-sage-600 text-white'
    },
    {
      num: '03',
      title: 'TRIAGE',
      subtitle: 'AI assists in classifying and prioritizing the report.',
      desc: 'Rakshak AI structures the incoming observation, assesses risk indicators (0-100 score), generates non-definitive trauma-informed explanations, and alerts priority queues.',
      icon: Cpu,
      bgColor: 'bg-terracotta-600 text-white'
    },
    {
      num: '04',
      title: 'CONNECT',
      subtitle: 'Route the case to the appropriate response category.',
      desc: 'Simulated smart routing dispatches notification recommendations to local station protection cells, child welfare desks, and verified support partners simultaneously.',
      icon: Network,
      bgColor: 'bg-amberGold-600 text-white'
    },
    {
      num: '05',
      title: 'RESPOND',
      subtitle: 'Authorized responders verify and act.',
      desc: 'Human responders review the case details, conduct a physical ground welfare check, update the live audit trail, and ensure safe resolution or family reunion.',
      icon: ShieldCheck,
      bgColor: 'bg-forest-800 text-ivory-100'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-forest-900/10 dark:bg-sage-400/10 text-forest-800 dark:text-sage-300 border border-forest-800/20 dark:border-sage-400/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-forest-700 dark:text-sage-300" />
          <span>Core Product Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900 dark:text-ivory-100">{t('navHowItWorks')}</h1>
        <p className="text-base text-charcoal-600 dark:text-ivory-300 max-w-2xl mx-auto">
          {t('processSub')}
        </p>

        <div className="pt-2 flex items-center justify-center space-x-2 text-xs font-mono font-bold text-forest-800 dark:text-sage-300">
          <span>AI assists. Humans decide.</span>
        </div>
      </div>

      {/* 5-Step Vertical Cards */}
      <div className="space-y-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="natural-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm relative overflow-hidden group hover:border-forest-700/40 transition-all"
            >
              {/* Step Number & Icon */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                <div className={`w-14 h-14 rounded-2xl ${step.bgColor} flex items-center justify-center font-bold text-xl shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="font-mono text-3xl font-extrabold text-forest-800 dark:text-sage-300">{step.num}</div>
              </div>

              {/* Step Content */}
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-charcoal-900 dark:text-ivory-100 tracking-tight">{step.title}</h3>
                  <span className="text-xs text-forest-700 dark:text-sage-300 font-semibold">— {step.subtitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-charcoal-600 dark:text-ivory-300 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer Banner */}
      <div className="p-6 rounded-3xl bg-white/90 dark:bg-charcoal-900/90 border border-ivory-300 dark:border-charcoal-800 text-center space-y-2 max-w-3xl mx-auto shadow-sm">
        <div className="text-xs font-bold text-amberGold-600 dark:text-amberGold-400 uppercase tracking-wider flex items-center justify-center space-x-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>System Positioning Guarantee</span>
        </div>
        <p className="text-xs text-charcoal-600 dark:text-ivory-300">
          "Rakshak is designed to complement existing child-protection systems, not replace them."
        </p>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <Link
          to="/report"
          className="inline-flex items-center space-x-2 py-4 px-8 rounded-2xl bg-forest-900 hover:bg-forest-800 text-ivory-100 font-bold text-sm shadow-sm hover:scale-105 transition-all"
        >
          <span>{t('btnReportConcern')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
