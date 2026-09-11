import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, Lock, ShieldCheck, CheckCircle2, Circle, Clock, MapPin, AlertCircle, FileText } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { RiskBadge } from '../components/common/RiskBadge';

export const TrackPage: React.FC = () => {
  const { caseId: paramCaseId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getCaseById } = useCases();

  const [inputCaseId, setInputCaseId] = useState(paramCaseId || 'RB-2026-10482');
  const activeCase = paramCaseId ? getCaseById(paramCaseId) : getCaseById(inputCaseId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCaseId.trim()) {
      navigate(`/track/${inputCaseId.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple border border-brand-purple/40 mx-auto flex items-center justify-center">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t('trackTitle')}</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">{t('trackSubtitle')}</p>

        {/* Input Form */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 max-w-md mx-auto pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputCaseId}
              onChange={(e) => setInputCaseId(e.target.value)}
              placeholder={t('trackPlaceholder')}
              className="w-full pl-4 pr-4 py-3 bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-purple shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="py-3 px-5 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs shadow-glow-purple transition-all"
          >
            {t('trackBtn')}
          </button>
        </form>
      </div>

      {/* Case Details Display */}
      {activeCase ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-2xl animate-fade-in">
          
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-3">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">Case Reference</span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{activeCase.id}</h2>
              <div className="flex items-center space-x-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-brand-purple" />
                <span>Approx. Location: {activeCase.report.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <RiskBadge level={activeCase.aiAnalysis.riskLevel} score={activeCase.aiAnalysis.riskScore} size="sm" />
              <StatusBadge status={activeCase.status} size="sm" />
            </div>
          </div>

          {/* Privacy Disclaimer Card */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>High-level public status view. Sensitive evidence and personal responder data remain encrypted.</span>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Resolution Progress Milestones
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {activeCase.timeline.map((step) => (
                <div key={step.id} className="relative space-y-0.5">
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border border-slate-300 dark:border-slate-800'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${step.completed ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                      {step.title}
                    </span>
                    <span className="font-mono text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                      {step.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 dark:text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Case Found for "{paramCaseId || inputCaseId}"</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Please check the Case ID reference string and try again. Example: <span className="font-mono text-brand-purple font-bold">RB-2026-10482</span>
          </p>
        </div>
      )}

    </div>
  );
};
