import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, Lock, CheckCircle2, MapPin, AlertCircle, ArrowRight, ShieldCheck, Cpu, UserCheck, Activity, Loader2 } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { RiskBadge } from '../components/common/RiskBadge';

export const TrackPage: React.FC = () => {
  const { caseId: paramCaseId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getCaseById } = useCases();

  const [inputCaseId, setInputCaseId] = useState(paramCaseId || 'RKS-2026-00421');
  const [isSearching, setIsSearching] = useState(false);

  // Clean case ID search
  const normalizedCaseId = (paramCaseId || inputCaseId || '').trim().toUpperCase();
  const activeCase = getCaseById(normalizedCaseId);

  useEffect(() => {
    if (paramCaseId) {
      setInputCaseId(paramCaseId);
    }
  }, [paramCaseId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCaseId.trim()) return;

    setIsSearching(true);
    const cleaned = inputCaseId.trim().toUpperCase();

    setTimeout(() => {
      setIsSearching(false);
      navigate(`/track/${cleaned}`);
    }, 300);
  };

  const stepColorConfigs = [
    { text: 'text-accentBlue', bg: 'bg-accentBlue', border: 'border-accentBlue/30', badgeBg: 'bg-accentBlue/10', icon: ShieldCheck },
    { text: 'text-accentPurple', bg: 'bg-accentPurple', border: 'border-accentPurple/30', badgeBg: 'bg-accentPurple/10', icon: Cpu },
    { text: 'text-accentViolet', bg: 'bg-accentViolet', border: 'border-accentViolet/30', badgeBg: 'bg-accentViolet/10', icon: UserCheck },
    { text: 'text-accentOrange', bg: 'bg-accentOrange', border: 'border-accentOrange/30', badgeBg: 'bg-accentOrange/10', icon: Activity },
    { text: 'text-accentGreen', bg: 'bg-accentGreen', border: 'border-accentGreen/30', badgeBg: 'bg-accentGreen/10', icon: CheckCircle2 }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      {/* Search Hero */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-700/10 text-teal-700 dark:text-teal-400 border border-teal-700/20 mx-auto flex items-center justify-center font-bold shadow-xs">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-charcoal-800 dark:text-charcoal-100">Track a Report</h1>
        <p className="text-xs text-charcoal-600 dark:text-charcoal-300 max-w-md mx-auto">
          Enter your unique Case Reference ID to check real-time resolution progress.
        </p>

        {/* Large Central Tracking Form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 max-w-lg mx-auto pt-2">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={inputCaseId}
              onChange={(e) => setInputCaseId(e.target.value)}
              placeholder="e.g. RKS-2026-00421"
              disabled={isSearching}
              className="w-full pl-4 pr-4 py-3.5 bg-white dark:bg-forest-850 border border-charcoal-200 dark:border-white/10 rounded-xl text-sm font-mono text-charcoal-800 dark:text-charcoal-100 placeholder-charcoal-400 focus:outline-none focus:border-teal-700 shadow-xs disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !inputCaseId.trim()}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs shadow-card flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Looking up...</span>
              </>
            ) : (
              <>
                <span>TRACK REPORT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Case Details Display */}
      {isSearching ? (
        <div className="natural-panel p-12 rounded-3xl text-center space-y-3 shadow-card">
          <Loader2 className="w-8 h-8 text-teal-700 dark:text-teal-400 animate-spin mx-auto" />
          <div className="text-sm font-bold text-charcoal-800 dark:text-charcoal-100">Looking up your report...</div>
          <div className="text-xs text-charcoal-500 font-mono">Querying case store for "{inputCaseId.trim().toUpperCase()}"</div>
        </div>
      ) : activeCase ? (
        <div className="natural-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-modal border border-charcoal-200/80 dark:border-white/10 animate-fade-in">
          
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-charcoal-200/80 dark:border-charcoal-800 pb-4 gap-3">
            <div>
              <span className="text-[10px] text-charcoal-500 font-mono uppercase">Case Reference ID</span>
              <h2 className="text-2xl font-extrabold text-charcoal-800 dark:text-charcoal-100 font-mono">{activeCase.id}</h2>
              <div className="flex items-center space-x-2 pt-1 text-xs text-charcoal-600 dark:text-charcoal-300">
                <MapPin className="w-3.5 h-3.5 text-accentBlue" />
                <span>Location: {activeCase.report.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <RiskBadge level={activeCase.aiAnalysis.riskLevel} score={activeCase.aiAnalysis.riskScore} size="sm" />
              <StatusBadge status={activeCase.status} size="sm" />
            </div>
          </div>

          {/* Incident Summary Card */}
          <div className="p-4 rounded-2xl bg-ivory-100/70 dark:bg-forest-900 border border-charcoal-200/70 dark:border-charcoal-800 space-y-2 text-xs">
            <div className="font-bold text-charcoal-800 dark:text-charcoal-100">Incident Category: {activeCase.report.incidentTypes.join(', ')}</div>
            <p className="text-charcoal-600 dark:text-charcoal-300">{activeCase.report.description}</p>
            <div className="text-[11px] font-mono text-charcoal-500 pt-1">
              Reporter: {activeCase.report.reporterRole || 'Anonymous Bystander'} • Time: {activeCase.report.approxTime || 'Recent'}
            </div>
          </div>

          {/* Privacy Disclaimer Card */}
          <div className="p-3.5 rounded-xl bg-accentCyan/10 border border-accentCyan/30 text-accentCyan text-xs flex items-center space-x-2">
            <Lock className="w-4 h-4 text-accentCyan flex-shrink-0" />
            <span>Strict privacy mode active. No personal names or identity details are exposed publicly.</span>
          </div>

          {/* Polished Status Timeline with Distinct Semantic Accent Colors */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-charcoal-800 dark:text-charcoal-100 uppercase tracking-wider">
              Resolution Progress & Milestones
            </h3>

            <div className="space-y-3">
              {activeCase.timeline.map((step, idx) => {
                const colorConfig = stepColorConfigs[idx % stepColorConfigs.length];
                const Icon = colorConfig.icon;

                return (
                  <div key={step.id || idx} className={`p-3.5 rounded-xl bg-white dark:bg-forest-900 border ${step.completed ? colorConfig.border : 'border-charcoal-200/80 dark:border-charcoal-800'} flex items-center justify-between shadow-xs transition-all`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${step.completed ? `${colorConfig.bg} text-white shadow-xs` : 'bg-charcoal-200/70 dark:bg-charcoal-800 text-charcoal-500'}`}>
                        {step.completed ? <Icon className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${step.completed ? colorConfig.text : 'text-charcoal-800 dark:text-charcoal-100'}`}>
                          {step.title}
                        </div>
                        <div className="text-[11px] text-charcoal-600 dark:text-charcoal-400">{step.description}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${step.completed ? `${colorConfig.badgeBg} ${colorConfig.text} ${colorConfig.border}` : 'text-charcoal-500 bg-ivory-100 dark:bg-charcoal-850 border-charcoal-200/50 dark:border-charcoal-800'}`}>
                      {step.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        <div className="natural-panel p-8 rounded-3xl text-center space-y-3 shadow-card">
          <AlertCircle className="w-10 h-10 text-amberGold-600 mx-auto" />
          <h3 className="text-lg font-bold text-charcoal-800 dark:text-charcoal-100">No Case Found for "{normalizedCaseId}"</h3>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-400">
            Please check the case reference string and try again. Sample case formats: RKS-2026-00421 or RB-2026-10482.
          </p>
        </div>
      )}

    </div>
  );
};
