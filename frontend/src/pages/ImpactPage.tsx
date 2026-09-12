import React from 'react';
import { ShieldCheck, Clock, Network, Sparkles, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ImpactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-magenta" />
          <span>Prototype Design Targets & Impact Framework</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">Target Impact Metrics</h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          How Rakshak quantifies first-mile child protection efficiency across high-footfall transit hubs.
        </p>
      </div>

      {/* Target Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-3 text-center shadow-md">
          <div className="text-4xl font-extrabold text-brand-purple font-mono">&lt; 30s</div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Target Reporting Time</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Zero account creation overhead allows instant reporting in urgent moments.</p>
          <span className="text-[10px] text-slate-500 font-mono block">Design Target</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-3 text-center shadow-md">
          <div className="text-4xl font-extrabold text-brand-magenta font-mono">1</div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Unified Case Reference</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Single accountable tracking string across citizen, dispatch, and ground teams.</p>
          <span className="text-[10px] text-slate-500 font-mono block">Design Target</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-3 text-center shadow-md">
          <div className="text-4xl font-extrabold text-blue-500 dark:text-blue-400 font-mono">3</div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Response Network Layers</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Simulated routing matrix linking transit cells, welfare desks, and NGO partners.</p>
          <span className="text-[10px] text-slate-500 font-mono block">Design Target</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-3 text-center shadow-md">
          <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">24/7</div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Designed Availability</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Continuous AI-assisted triage monitoring for station concourses and bus bays.</p>
          <span className="text-[10px] text-slate-500 font-mono block">Design Target</span>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-3xl mx-auto shadow-2xl">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Experience the Coordination Concept</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Try the citizen reporting flow or inspect the responder command center dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/report"
            className="py-3 px-6 rounded-xl bg-brand-purple text-white font-bold text-xs shadow-glow-purple flex items-center space-x-1.5"
          >
            <span>Report a Concern</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/responder"
            className="py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 shadow-sm"
          >
            Responder Portal
          </Link>
        </div>
      </div>

    </div>
  );
};
