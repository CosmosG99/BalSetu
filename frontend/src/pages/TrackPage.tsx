import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, Lock, CheckCircle2, Circle, MapPin, AlertCircle } from 'lucide-react';
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
        <div className="w-12 h-12 rounded-2xl bg-forest-900/10 dark:bg-sage-400/10 text-forest-800 dark:text-sage-300 border border-forest-800/20 dark:border-sage-400/20 mx-auto flex items-center justify-center">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-charcoal-900 dark:text-ivory-100">{t('trackTitle')}</h1>
        <p className="text-xs text-charcoal-600 dark:text-ivory-300 max-w-md mx-auto">{t('trackSubtitle')}</p>

        {/* Input Form */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 max-w-md mx-auto pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputCaseId}
              onChange={(e) => setInputCaseId(e.target.value)}
              placeholder={t('trackPlaceholder')}
              className="w-full pl-4 pr-4 py-3 bg-white/90 dark:bg-charcoal-900/90 border border-ivory-300 dark:border-charcoal-700 rounded-xl text-sm font-mono text-charcoal-900 dark:text-ivory-100 placeholder-charcoal-400 dark:placeholder-ivory-400 focus:outline-none focus:border-forest-700 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="py-3 px-5 rounded-xl bg-forest-900 hover:bg-forest-800 text-ivory-100 font-bold text-xs shadow-sm transition-colors"
          >
            {t('trackBtn')}
          </button>
        </form>
      </div>

      {/* Case Details Display */}
      {activeCase ? (
        <div className="natural-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm animate-fade-in">
          
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-ivory-300 dark:border-charcoal-800 pb-4 gap-3">
            <div>
              <span className="text-[10px] text-charcoal-500 dark:text-ivory-400 font-mono uppercase">{t('caseReferenceLabel')}</span>
              <h2 className="text-2xl font-extrabold text-charcoal-900 dark:text-ivory-100 font-mono">{activeCase.id}</h2>
              <div className="flex items-center space-x-2 pt-1 text-xs text-charcoal-600 dark:text-ivory-400">
                <MapPin className="w-3.5 h-3.5 text-forest-700 dark:text-sage-300" />
                <span>Location: {activeCase.report.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <RiskBadge level={activeCase.aiAnalysis.riskLevel} score={activeCase.aiAnalysis.riskScore} size="sm" />
              <StatusBadge status={activeCase.status} size="sm" />
            </div>
          </div>

          {/* Privacy Disclaimer Card */}
          <div className="p-3.5 rounded-xl bg-forest-900/10 dark:bg-sage-400/10 border border-forest-800/20 dark:border-sage-400/20 text-forest-900 dark:text-sage-200 text-xs flex items-center space-x-2">
            <Lock className="w-4 h-4 text-forest-700 dark:text-sage-300 flex-shrink-0" />
            <span>{t('privacyDisclaimerTrack')}</span>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-charcoal-800 dark:text-ivory-200 uppercase tracking-wider">
              {t('resolutionProgressTitle')}
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-ivory-300 dark:before:bg-charcoal-800">
              {activeCase.timeline.map((step) => (
                <div key={step.id} className="relative space-y-0.5">
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-forest-900/20 text-forest-800 dark:text-sage-300 border border-forest-800/40'
                        : 'bg-ivory-200 dark:bg-charcoal-800 text-charcoal-400 dark:text-ivory-500 border border-ivory-300 dark:border-charcoal-700'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${step.completed ? 'text-charcoal-900 dark:text-ivory-100' : 'text-charcoal-400 dark:text-ivory-400'}`}>
                      {step.title}
                    </span>
                    <span className="font-mono text-[10px] text-charcoal-600 dark:text-ivory-400 bg-ivory-200 dark:bg-charcoal-800 px-2 py-0.5 rounded border border-ivory-300 dark:border-charcoal-700">
                      {step.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-600 dark:text-ivory-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="natural-panel p-8 rounded-3xl text-center space-y-3 shadow-sm">
          <AlertCircle className="w-10 h-10 text-amberGold-600 dark:text-amberGold-400 mx-auto" />
          <h3 className="text-lg font-bold text-charcoal-900 dark:text-ivory-100">{t('noCaseFoundTitle')} "{paramCaseId || inputCaseId}"</h3>
          <p className="text-xs text-charcoal-600 dark:text-ivory-400">
            {t('noCaseFoundDesc')}
          </p>
        </div>
      )}

    </div>
  );
};
