import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ImpactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-forest-900/10 dark:bg-sage-400/10 text-forest-800 dark:text-sage-300 border border-forest-800/20 dark:border-sage-400/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-forest-700 dark:text-sage-300" />
          <span>Prototype Design Targets & Impact Framework</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900 dark:text-ivory-100">Target Impact Metrics</h1>
        <p className="text-base text-charcoal-600 dark:text-ivory-300 leading-relaxed">
          How Rakshak quantifies first-mile child protection efficiency across high-footfall transit hubs.
        </p>
      </div>

      {/* Target Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="natural-panel p-6 rounded-3xl space-y-3 text-center shadow-sm">
          <div className="text-4xl font-extrabold text-forest-800 dark:text-sage-300 font-mono">&lt; 30s</div>
          <h3 className="text-xs font-bold text-charcoal-900 dark:text-ivory-100 uppercase tracking-wider">Target Reporting Time</h3>
          <p className="text-xs text-charcoal-600 dark:text-ivory-400">Zero account creation overhead allows instant reporting in urgent moments.</p>
          <span className="text-[10px] text-charcoal-500 dark:text-ivory-400 font-mono block">Design Target</span>
        </div>

        <div className="natural-panel p-6 rounded-3xl space-y-3 text-center shadow-sm">
          <div className="text-4xl font-extrabold text-terracotta-600 dark:text-terracotta-400 font-mono">1</div>
          <h3 className="text-xs font-bold text-charcoal-900 dark:text-ivory-100 uppercase tracking-wider">Unified Case Reference</h3>
          <p className="text-xs text-charcoal-600 dark:text-ivory-400">Single accountable tracking string across citizen, dispatch, and ground teams.</p>
          <span className="text-[10px] text-charcoal-500 dark:text-ivory-400 font-mono block">Design Target</span>
        </div>

        <div className="natural-panel p-6 rounded-3xl space-y-3 text-center shadow-sm">
          <div className="text-4xl font-extrabold text-amberGold-600 dark:text-amberGold-400 font-mono">3</div>
          <h3 className="text-xs font-bold text-charcoal-900 dark:text-ivory-100 uppercase tracking-wider">Response Network Layers</h3>
          <p className="text-xs text-charcoal-600 dark:text-ivory-400">Simulated routing matrix linking transit cells, welfare desks, and NGO partners.</p>
          <span className="text-[10px] text-charcoal-500 dark:text-ivory-400 font-mono block">Design Target</span>
        </div>

        <div className="natural-panel p-6 rounded-3xl space-y-3 text-center shadow-sm">
          <div className="text-4xl font-extrabold text-sage-600 dark:text-sage-300 font-mono">24/7</div>
          <h3 className="text-xs font-bold text-charcoal-900 dark:text-ivory-100 uppercase tracking-wider">Designed Availability</h3>
          <p className="text-xs text-charcoal-600 dark:text-ivory-400">Continuous AI-assisted triage monitoring for station concourses and bus bays.</p>
          <span className="text-[10px] text-charcoal-500 dark:text-ivory-400 font-mono block">Design Target</span>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-white/90 dark:bg-charcoal-900/90 border border-ivory-300 dark:border-charcoal-800 text-center space-y-4 max-w-3xl mx-auto shadow-sm">
        <h3 className="text-xl font-bold text-charcoal-900 dark:text-ivory-100">Experience the Coordination Concept</h3>
        <p className="text-xs text-charcoal-600 dark:text-ivory-300">
          Try the citizen reporting flow or inspect the responder command center dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/report"
            className="py-3 px-6 rounded-xl bg-forest-900 hover:bg-forest-800 text-ivory-100 font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <span>Report a Concern</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/responder"
            className="py-3 px-6 rounded-xl bg-ivory-200 hover:bg-ivory-300 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-charcoal-900 dark:text-ivory-100 font-bold text-xs border border-ivory-400 dark:border-charcoal-700 shadow-sm transition-colors"
          >
            Responder Portal
          </Link>
        </div>
      </div>

    </div>
  );
};
