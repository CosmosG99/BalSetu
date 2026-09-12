import React, { useState, useEffect } from 'react';
import { AiTriageResult } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { Cpu, ShieldCheck, ChevronDown, ChevronUp, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AIAnalysisModalProps {
  analysis: AiTriageResult;
  onProceed: () => void;
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({ analysis, onProceed }) => {
  const { t } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [expandedWhy, setExpandedWhy] = useState(true);

  const processingSteps = [
    'Receiving report payload...',
    'Structuring location & incident parameters...',
    'Assessing risk indicators & vulnerabilities...',
    'Generating prioritized score...',
    'Preparing responder routing recommendations...'
  ];

  useEffect(() => {
    if (stepIndex < processingSteps.length) {
      const timer = setTimeout(() => {
        setStepIndex((prev) => prev + 1);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, processingSteps.length]);

  const isComplete = stepIndex >= processingSteps.length;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 max-w-2xl mx-auto space-y-6 shadow-2xl animate-fade-in">
      
      {/* Top Header */}
      <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center text-white shadow-glow-purple">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('aiTriageTitle')}</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 text-purple-700 dark:text-purple-300 border border-brand-purple/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t('aiTriageBadge')}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('aiTriageSub')}</p>
        </div>
      </div>

      {/* Processing Animation */}
      {!isComplete ? (
        <div className="py-8 space-y-4 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-purple animate-bounce">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {processingSteps[Math.min(stepIndex, processingSteps.length - 1)]}
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-slate-800 max-w-md mx-auto">
              <div
                className="bg-gradient-to-r from-brand-purple to-brand-magenta h-full transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / processingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Completed Result Card */
        <div className="space-y-6 animate-fade-in">
          
          {/* Risk Score Highlight Box */}
          <div className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{t('assessedRiskScore')}</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">{analysis.riskScore}</span>
                <span className="text-sm text-slate-500 font-mono">/ 100</span>
              </div>
            </div>
            <RiskBadge level={analysis.riskLevel} score={analysis.riskScore} size="lg" />
          </div>

          {/* Non-Definitive Advisory Disclaimer */}
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-900 dark:text-purple-200 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-purple-900 dark:text-purple-300 block">{t('advisoryAiAssessment')}</span>
              <span>{t('advisoryAiText')}</span>
            </div>
          </div>

          {/* Detected Risk Indicators */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('detectedIndicatorsTitle')}</h4>
            <div className="space-y-1.5">
              {analysis.indicators.map((ind, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Explanation: Why Was This Flagged? */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-900/50">
            <button
              onClick={() => setExpandedWhy(!expandedWhy)}
              className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-brand-purple" />
                <span>{t('whyFlaggedTitle')}</span>
              </div>
              {expandedWhy ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedWhy && (
              <div className="p-4 pt-0 border-t border-slate-200 dark:border-slate-800/60 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysis.explanations.map((exp, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-brand-purple font-mono font-bold">•</span>
                    <p>{exp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={onProceed}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('generateCaseIdBtn')}</span>
          </button>

        </div>
      )}

    </div>
  );
};
