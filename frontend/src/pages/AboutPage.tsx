import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-forest-900/10 dark:bg-sage-400/10 text-forest-800 dark:text-sage-300 border border-forest-800/20 dark:border-sage-400/20 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-forest-700 dark:text-sage-300" />
          <span>Bit N Build Hackathon • Track 2 — Bal Suraksha</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900 dark:text-ivory-100">About Rakshak</h1>
        <p className="text-base text-charcoal-600 dark:text-ivory-300 leading-relaxed">
          Creating a trustworthy, privacy-first humanitarian technology bridge for child safety in transit hubs.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="natural-panel p-8 rounded-3xl space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-charcoal-900 dark:text-ivory-100 border-b border-ivory-300 dark:border-charcoal-800 pb-3">
          Product Vision & Mission
        </h2>
        <p className="text-sm text-charcoal-600 dark:text-ivory-300 leading-relaxed">
          Rakshak is designed to address a critical vulnerability in public spaces like railway stations, bus terminals, and metro concourses: the first-mile observation gap. When a bystander notices a lost, distressed, or unaccompanied child, they often lack the means to report quickly, safely, and anonymously.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-charcoal-900/90 border border-ivory-300 dark:border-charcoal-800 space-y-1 shadow-sm">
            <span className="text-xs font-bold text-forest-800 dark:text-sage-300 uppercase tracking-wider">Privacy-First Design</span>
            <p className="text-xs text-charcoal-600 dark:text-ivory-400">Anonymous by default, zero mandatory personal data collection, automatic face blur simulation on images.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-charcoal-900/90 border border-ivory-300 dark:border-charcoal-800 space-y-1 shadow-sm">
            <span className="text-xs font-bold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-wider">AI Assists • Humans Decide</span>
            <p className="text-xs text-charcoal-600 dark:text-ivory-400">AI provides advisory risk triage and explanations without making definitive accusations or legal determinations.</p>
          </div>
        </div>
      </div>

      {/* Prototype Disclaimers */}
      <div className="p-6 rounded-3xl bg-amberGold-500/10 border border-amberGold-500/30 text-charcoal-800 dark:text-ivory-200 space-y-2 text-xs">
        <div className="font-bold text-charcoal-900 dark:text-ivory-100 flex items-center space-x-2 text-sm">
          <AlertTriangle className="w-4 h-4 text-amberGold-600 dark:text-amberGold-400" />
          <span>Prototype & Hackathon Scope Disclaimer</span>
        </div>
        <p className="text-charcoal-700 dark:text-ivory-300">
          This application is intended for operational child-safety response workflows and is not an official government database. It is designed to support secure reporting, AI-assisted triage, and responder coordination for real incidents.
        </p>
      </div>

      <div className="text-center pt-2">
        <Link
          to="/"
          className="py-3 px-6 rounded-xl bg-forest-900 hover:bg-forest-800 text-ivory-100 font-bold text-xs shadow-sm inline-block transition-colors"
        >
          Return to Home
        </Link>
      </div>

    </div>
  );
};
