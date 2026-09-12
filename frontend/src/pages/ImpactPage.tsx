import React from 'react';
import { Sparkles, ArrowRight, Users, ShieldCheck, Heart, Zap, Cpu, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ImpactPage: React.FC = () => {
  const metrics = [
    {
      label: 'Faster First-Mile Reporting',
      val: '< 30s',
      desc: 'Zero account creation friction enables instant observation submission.',
      accentText: 'text-accentBlue',
      borderTop: 'border-t-4 border-accentBlue',
      badgeColor: 'text-accentBlue border-accentBlue/30 bg-accentBlue/10',
      icon: Zap,
      tag: 'Speed Metric'
    },
    {
      label: 'AI-Assisted Advisory Triage',
      val: '0-100',
      desc: 'Instant trauma risk scoring and indicator detection to guide human responders.',
      accentText: 'text-accentPurple',
      borderTop: 'border-t-4 border-accentPurple',
      badgeColor: 'text-accentPurple border-accentPurple/30 bg-accentPurple/10',
      icon: Cpu,
      tag: 'AI Intelligence'
    },
    {
      label: 'Community Participation',
      val: '100%',
      desc: 'Default privacy and face-blur protection ensures safe bystander reporting.',
      accentText: 'text-accentPink',
      borderTop: 'border-t-4 border-accentPink',
      badgeColor: 'text-accentPink border-accentPink/30 bg-accentPink/10',
      icon: Users,
      tag: 'Community Trust'
    },
    {
      label: 'Successful Ground Resolution',
      val: '24/7',
      desc: 'Continuous coordination connecting bystanders to verified station protection cells.',
      accentText: 'text-accentGreen',
      borderTop: 'border-t-4 border-accentGreen',
      badgeColor: 'text-accentGreen border-accentGreen/30 bg-accentGreen/10',
      icon: CheckCircle2,
      tag: 'Safe Reunion'
    }
  ];

  const impactAreas = [
    {
      title: 'COMMUNITY',
      sub: 'Empowering Citizens Safely',
      desc: 'Bystanders, passengers, shopkeepers, and station staff can report concerning observations without fear of retaliation or burdensome legal processes.',
      icon: Users,
      accent: 'border-l-4 border-accentPink',
      iconBg: 'bg-accentPink/10 text-accentPink border-accentPink/30'
    },
    {
      title: 'RESPONDERS',
      sub: 'Actionable & Structured Information',
      desc: 'Station protection desks receive structured location tags, trauma indicators, and non-definitive AI advice to conduct targeted physical welfare checks.',
      icon: ShieldCheck,
      accent: 'border-l-4 border-teal-700',
      iconBg: 'bg-teal-700/10 text-teal-700 dark:text-teal-400 border-teal-700/30'
    },
    {
      title: 'CHILDREN',
      sub: 'Faster Escalation for Safer Outcomes',
      desc: 'Rapid identification of lost or unaccompanied children during early observation windows reduces risks of distress or exploitation.',
      icon: Heart,
      accent: 'border-l-4 border-accentCoral',
      iconBg: 'bg-accentCoral/10 text-accentCoral border-accentCoral/30'
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

      {/* Target Metric Cards with Distinct Top Accent Borders & Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className={`natural-panel p-6 rounded-3xl space-y-3 shadow-card text-center flex flex-col justify-between ${m.borderTop}`}>
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-2xl mx-auto flex items-center justify-center font-bold border ${m.badgeColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`text-4xl font-extrabold font-mono tracking-tight ${m.accentText}`}>{m.val}</div>
                <h3 className="text-xs font-bold text-charcoal-800 dark:text-charcoal-100 uppercase tracking-wider">{m.label}</h3>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">{m.desc}</p>
              </div>
              <div className="pt-2">
                <span className={`inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${m.badgeColor}`}>
                  {m.tag}
                </span>
              </div>
            </div>
          );
        })}
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
                  <div className={`p-3 rounded-2xl border font-bold ${area.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider block">{area.title}</span>
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
            className="py-3 px-6 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs border border-teal-500/40 shadow-xs transition-colors"
          >
            Responder Portal
          </Link>
        </div>
      </div>

    </div>
  );
};
