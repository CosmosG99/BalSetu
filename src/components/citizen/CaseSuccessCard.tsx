import React, { useState } from 'react';
import { CaseModel } from '../../types';
import { QRCard } from '../common/QRCard';
import { CheckCircle2, Copy, Check, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CaseSuccessCardProps {
  caseData: CaseModel;
}

export const CaseSuccessCard: React.FC<CaseSuccessCardProps> = ({ caseData }) => {
  const [copied, setCopied] = useState(false);

  const copyCaseId = () => {
    navigator.clipboard.writeText(caseData.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 max-w-2xl mx-auto space-y-8 shadow-2xl text-center animate-fade-in">
      
      {/* Top Banner Icon */}
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-glow-purple">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Your Report Has Been Submitted Safely</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Thank you for taking action. Your report has been classified and securely routed to authorized responders.
        </p>
      </div>

      {/* Case ID Box */}
      <div className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Unique Case Reference ID</span>
        <div className="flex items-center justify-center space-x-3">
          <span className="text-3xl font-extrabold font-mono text-brand-purple tracking-wider">{caseData.id}</span>
          <button
            onClick={copyCaseId}
            className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            title="Copy Case ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Status Progress Checklist */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-left space-y-3">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Initiated Case Milestones</span>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Report securely received</span>
          </div>
          <div className="flex items-center space-x-2.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>AI triage completed (Assessed Risk: {caseData.aiAnalysis.riskScore}/100)</span>
          </div>
          <div className="flex items-center space-x-2.5 text-purple-700 dark:text-purple-300 font-medium">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-brand-purple" />
            <span>Responder routing initiated for {caseData.report.stationName || caseData.report.location.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* QR Code Component */}
      <QRCard caseId={caseData.id} />

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <Link
          to={`/track/${caseData.id}`}
          className="py-3.5 px-5 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-sm shadow-glow-purple flex items-center justify-center space-x-2 transition-all"
        >
          <span>Track My Report Status</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/responder"
          className="py-3.5 px-5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-300 dark:border-slate-700 flex items-center justify-center space-x-2 transition-all"
        >
          <ShieldCheck className="w-4 h-4 text-brand-purple" />
          <span>Open Responder Portal</span>
        </Link>
      </div>

    </div>
  );
};
