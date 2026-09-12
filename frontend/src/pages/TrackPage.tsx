import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, Lock, CheckCircle2, Circle, MapPin, AlertCircle, ArrowRight, ShieldCheck, Clock, Cpu, UserCheck, Activity } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { RiskBadge } from '../components/common/RiskBadge';

export const TrackPage: React.FC = () => {
  const { caseId: paramCaseId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getCaseById } = useCases();

  const [inputCaseId, setInputCaseId] = useState(paramCaseId || 'RKS-2026-00421');
  const activeCase = paramCaseId ? getCaseById(paramCaseId) : getCaseById(inputCaseId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCaseId.trim()) {
      navigate(`/track/${inputCaseId.trim().toUpperCase()}`);
    }
  };

  const statusTimelineSteps = [
    { title: 'REPORT RECEIVED', desc: 'Bystander observation submitted securely', color: 'text-teal-700 dark:text-teal-400 bg-teal-700/10 border-teal-700/30', icon: ShieldCheck },
    { title: 'TRIAGED', desc: 'AI risk assessment & category classification complete', color: 'text-accentPurple bg-accentPurple/10 border-accentPurple/30', icon: Cpu },
    { title: 'RESPONDER ASSIGNED', desc: 'Platform response team or RPF officer notified', color: 'text-accentViolet bg-accentViolet/10 border-accentViolet/30', icon: UserCheck },
    { title: 'ACTION IN PROGRESS', desc: 'Ground verification check underway', color: 'text-accentOrange bg-accentOrange/10 border-accentOrange/30', icon: Activity },
    { title: 'RESOLVED', desc: 'Child secured and safely reunited or supported', color: 'text-accentGreen bg-accentGreen/10 border-accentGreen/30', icon: CheckCircle2 }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      {/* Search Hero */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-700/10 text-teal-700 dark:text-teal-400 border border-teal-700/20 mx-auto flex items-center justify-center font-bold">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-charcoal-800 dark:text-charcoal-100">Track a Report</h1>
        <p className="text-xs text-charcoal-600 dark:text-charcoal-300 max-w-md mx-auto">
          Enter your unique Case Reference ID to check real-time resolution progress.
        </p>

        {/* Large Central Tracking Component */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 max-w-lg mx-auto pt-2">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={inputCaseId}
              onChange={(e) => setInputCaseId(e.target.value)}
              placeholder="e.g. RKS-2026-00421"
              className="w-full pl-4 pr-4 py-3.5 bg-white dark:bg-forest-850 border border-charcoal-200 dark:border-white/10 rounded-xl text-sm font-mono text-charcoal-800 dark:text-charcoal-100 placeholder-charcoal-400 focus:outline-none focus:border-teal-700 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-card flex items-center justify-center space-x-1.5 transition-all"
          >
            <span>TRACK REPORT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Case Details Display */}
      {activeCase ? (
        <div className="natural-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-modal border border-charcoal-200/80 dark:border-white/10">
          
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-charcoal-200/80 dark:border-charcoal-800 pb-4 gap-3">
            <div>
              <span className="text-[10px] text-charcoal-500 font-mono uppercase">Case Reference ID</span>
              <h2 className="text-2xl font-extrabold text-charcoal-800 dark:text-charcoal-100 font-mono">{activeCase.id}</h2>
              <div className="flex items-center space-x-2 pt-1 text-xs text-charcoal-600 dark:text-charcoal-300">
                <MapPin className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                <span>Location: {activeCase.report.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <RiskBadge level={activeCase.aiAnalysis.riskLevel} score={activeCase.aiAnalysis.riskScore} size="sm" />
              <StatusBadge status={activeCase.status} size="sm" />
            </div>
          </div>

          {/* Privacy Disclaimer Card */}
          <div className="p-3.5 rounded-xl bg-teal-700/10 dark:bg-teal-500/20 border border-teal-700/20 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 text-xs flex items-center space-x-2">
            <Lock className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
            <span>Strict privacy mode active. No personal names or identity details are exposed publicly.</span>
          </div>

          {/* Polished Status Timeline */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-charcoal-800 dark:text-charcoal-100 uppercase tracking-wider">
              Resolution Progress & Milestones
            </h3>

            <div className="space-y-3">
              {statusTimelineSteps.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-ivory-100/60 dark:bg-forest-900 border border-charcoal-200/60 dark:border-charcoal-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg border ${step.color}`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-charcoal-800 dark:text-charcoal-100">{step.title}</div>
                      <div className="text-[11px] text-charcoal-600 dark:text-charcoal-400">{step.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400">Step 0{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="natural-panel p-8 rounded-3xl text-center space-y-3 shadow-card">
          <AlertCircle className="w-10 h-10 text-amberGold-600 mx-auto" />
          <h3 className="text-lg font-bold text-charcoal-800 dark:text-charcoal-100">No Case Found for "{paramCaseId || inputCaseId}"</h3>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-400">
            Please check the case reference string and try again. Sample case format: RKS-2026-00421.
          </p>
        </div>
      )}

    </div>
  );
};
