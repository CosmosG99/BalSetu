import React from 'react';
import { Eye, Send, Cpu, Network, ShieldCheck, Lock, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
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
      color: 'from-blue-500 to-indigo-600'
    },
    {
      num: '02',
      title: 'REPORT',
      subtitle: 'Submit a quick report without creating an account.',
      desc: 'Using a 30-second mobile-first interface, the bystander submits key details: incident type, approximate location, description, optional photo with face-blur, and anonymous status.',
      icon: Send,
      color: 'from-purple-500 to-magenta-500'
    },
    {
      num: '03',
      title: 'TRIAGE',
      subtitle: 'AI assists in classifying and prioritizing the report.',
      desc: 'Rakshak AI structures the incoming observation, assesses risk indicators (0-100 score), generates non-definitive trauma-informed explanations, and alerts priority queues.',
      icon: Cpu,
      color: 'from-amber-500 to-red-500'
    },
    {
      num: '04',
      title: 'CONNECT',
      subtitle: 'Route the case to the appropriate response category.',
      desc: 'Simulated smart routing dispatches notification recommendations to local station protection cells, child welfare desks, and verified support partners simultaneously.',
      icon: Network,
      color: 'from-brand-purple to-indigo-600'
    },
    {
      num: '05',
      title: 'RESPOND',
      subtitle: 'Authorized responders verify and act.',
      desc: 'Human responders review the case details, conduct a physical ground welfare check, update the live audit trail, and ensure safe resolution or family reunion.',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-magenta" />
          <span>Core Product Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">How Rakshak Works</h1>
        <p className="text-base text-slate-300 max-w-2xl mx-auto">
          Connecting bystander observation to human ground intervention in 5 structured steps.
        </p>

        <div className="pt-2 flex items-center justify-center space-x-2 text-xs font-mono font-bold text-brand-purple">
          <span>AI assists. Humans decide.</span>
        </div>
      </div>

      {/* 5-Step Vertical Cards */}
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-xl relative overflow-hidden group hover:border-brand-purple/40 transition-all"
            >
              {/* Step Number & Icon */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-105 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="font-mono text-3xl font-extrabold text-brand-purple">{step.num}</div>
              </div>

              {/* Step Content */}
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">{step.title}</h3>
                  <span className="text-xs text-purple-300 font-semibold">— {step.subtitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-2 max-w-3xl mx-auto shadow-xl">
        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center space-x-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>System Positioning Guarantee</span>
        </div>
        <p className="text-xs text-slate-300">
          "Rakshak is designed to complement existing child-protection systems, not replace them."
        </p>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <Link
          to="/report"
          className="inline-flex items-center space-x-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple hover:scale-105 transition-all"
        >
          <span>Try Citizen Reporting Flow</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
