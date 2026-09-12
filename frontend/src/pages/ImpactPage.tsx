import React from 'react';
import { Sparkles, ArrowRight, Users, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ImpactPage: React.FC = () => {
  const metrics = [
    { label: 'Faster First-Mile Reporting', val: '< 30s', desc: 'Zero account creation friction enables instant observation submission.', color: 'text-accentBlue border-accentBlue/30 bg-accentBlue/10', tag: 'Prototype metric' },
    { label: 'Structured Case Handoff', val: '100%', desc: 'Unified Case Reference ID bridges bystander observations to dispatch cells.', color: 'text-teal-700 dark:text-teal-400 border-teal-700/30 bg-teal-700/10', tag: 'Prototype metric' },
    { label: 'Anonymous Community Participation', val: '100%', desc: 'Default privacy protection ensures bystander safety.', color: 'text-accentPurple border-accentPurple/30 bg-accentPurple/10', tag: 'Demo data' },
    { label: 'Human-in-the-Loop Response', val: '24/7', desc: 'Continuous AI advisory triage supported by human verification.', color: 'text-accentGreen border-accentGreen/30 bg-accentGreen/10', tag: 'Demo data' }
  ];

  const impactAreas = [
    {
      title: 'COMMUNITY',
      sub: 'Empowering Citizens Safely',
      desc: 'Bystanders, passengers, shopkeepers, and station staff can report concerning observations without fear of retaliation or burdensome legal processes.',
      icon: Users,
      accent: 'border-l-4 border-accentBlue'
    },
    {
      title: 'RESPONDERS',
      sub: 'Actionable & Structured Information',
      desc: 'Station protection desks receive structured location tags, trauma indicators, and non-definitive AI advice to conduct targeted physical welfare checks.',
      icon: ShieldCheck,
      accent: 'border-l-4 border-teal-700'
    },
    {
      title: 'CHILDREN',
      sub: 'Faster Escalation for Safer Outcomes',
      desc: 'Rapid identification of lost or unaccompanied children during early observation windows reduces risks of distress or exploitation.',
      icon: Heart,
      accent: 'border-l-4 border-accentCoral'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-700/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-700/20 dark:border-teal-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Impact Framework</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal-800 dark:text-charcoal-100">
          Small moments of awareness can create meaningful protection.
        </h1>
        <p className="text-base text-charcoal-600 dark:text-charcoal-300">
          Quantifying first-mile child protection efficiency across high-footfall transit hubs.
        </p>
      </div>

      {/* Target Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <div key={idx} className="natural-panel p-6 rounded-3xl space-y-3 shadow-card text-center flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-4xl font-extrabold font-mono tracking-tight text-charcoal-800 dark:text-charcoal-100">{m.val}</div>
              <h3 className="text-xs font-bold text-charcoal-800 dark:text-charcoal-100 uppercase tracking-wider">{m.label}</h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">{m.desc}</p>
            </div>
            <div className="pt-2">
              <span className={`inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${m.color}`}>
                {m.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3 Impact Areas */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-charcoal-800 dark:text-charcoal-100">Three Pillars of Protection</h2>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-400">Designed to support every stakeholder in the transit safety ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {impactAreas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <div key={idx} className={`natural-panel p-6 rounded-3xl space-y-4 shadow-card ${area.accent}`}>
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-teal-700/10 text-teal-700 dark:text-teal-400 font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">{area.title}</span>
                    <h3 className="text-sm font-bold text-charcoal-800 dark:text-charcoal-100">{area.sub}</h3>
                  </div>
                </div>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{area.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-teal-700 text-white text-center space-y-4 max-w-3xl mx-auto shadow-modal">
        <h3 className="text-xl font-bold">Experience the Coordination Concept</h3>
        <p className="text-xs text-teal-100">
          Try the citizen reporting flow or inspect the responder command center dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/report"
            className="py-3 px-6 rounded-xl bg-white text-teal-900 font-bold text-xs shadow-card flex items-center space-x-1.5 transition-colors"
          >
            <span>Report a Concern</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/responder"
            className="py-3 px-6 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs border border-teal-500/40 shadow-sm transition-colors"
          >
            Responder Portal
          </Link>
        </div>
      </div>

    </div>
  );
};
