import React from 'react';
import { Shield, Lock, EyeOff, HeartHandshake, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-brand-purple" />
          <span>Bit N Build Hackathon • Track 2 — Bal Suraksha</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">About Rakshak</h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Creating a trustworthy, privacy-first humanitarian technology bridge for child safety in transit hubs.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
          Product Vision & Mission
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Rakshak is designed to address a critical vulnerability in public spaces like railway stations, bus terminals, and metro concourses: the first-mile observation gap. When a bystander notices a lost, distressed, or unaccompanied child, they often lack the means to report quickly, safely, and anonymously.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <span className="text-xs font-bold text-brand-purple uppercase">Privacy-First Design</span>
            <p className="text-xs text-slate-600 dark:text-slate-400">Anonymous by default, zero mandatory personal data collection, automatic face blur simulation on images.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <span className="text-xs font-bold text-brand-magenta uppercase">AI Assists • Humans Decide</span>
            <p className="text-xs text-slate-600 dark:text-slate-400">AI provides advisory risk triage and explanations without making definitive accusations or legal determinations.</p>
          </div>
        </div>
      </div>

      {/* Prototype Disclaimers */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 space-y-2 text-xs">
        <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center space-x-2 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Prototype & Hackathon Scope Disclaimer</span>
        </div>
        <p>
          This application is a conceptual prototype developed exclusively for the Bit N Build Hackathon under Bal Suraksha (Support Ecosystems). It is NOT an official government application and does NOT claim official connection to Indian Railways, RPF, CHILDLINE, TrackChild, Police, or government databases. All cases and match profiles use 100% synthetic mock data.
        </p>
      </div>

      <div className="text-center pt-2">
        <Link
          to="/"
          className="py-3 px-6 rounded-xl bg-brand-purple text-white font-bold text-xs shadow-glow-purple inline-block"
        >
          Return to Home
        </Link>
      </div>

    </div>
  );
};
