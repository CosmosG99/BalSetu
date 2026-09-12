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
    <div className="natural-panel p-6 sm:p-8 rounded-3xl border border-accentPurple/40 bg-white dark:bg-forest-900 max-w-2xl mx-auto space-y-6 shadow-modal animate-fade-in">
      
      {/* Top Header with Purple AI Identity */}
      <div className="flex items-center space-x-3 border-b border-charcoal-200/80 dark:border-charcoal-800 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-accentPurple text-white flex items-center justify-center font-bold shadow-subtle">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-charcoal-800 dark:text-charcoal-100">{t('aiTriageTitle')}</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accentPurple/10 text-accentPurple border border-accentPurple/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t('aiTriageBadge')}
            </span>
          </div>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-400">{t('aiTriageSub')}</p>
        </div>
      </div>

      {/* Processing Animation */}
      {!isComplete ? (
        <div className="py-8 space-y-4 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-accentPurple/15 border border-accentPurple/40 flex items-center justify-center text-accentPurple animate-bounce shadow-xs">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-charcoal-800 dark:text-charcoal-100">
              {processingSteps[Math.min(stepIndex, processingSteps.length - 1)]}
            </div>
            <div className="w-full bg-ivory-200 dark:bg-charcoal-950 rounded-full h-2 overflow-hidden border border-charcoal-300 dark:border-charcoal-800 max-w-md mx-auto">
              <div
                className="bg-accentPurple h-full transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / processingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Completed Result Card */
        <div className="space-y-6 animate-fade-in">
          
          {/* Risk Score Highlight Box */}
          <div className="p-6 rounded-2xl bg-ivory-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="text-xs text-charcoal-500 font-semibold uppercase tracking-wider">{t('assessedRiskScore')}</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-charcoal-800 dark:text-charcoal-100 font-mono">{analysis.riskScore}</span>
                <span className="text-sm text-charcoal-500 font-mono">/ 100</span>
              </div>
            </div>
            <RiskBadge level={analysis.riskLevel} score={analysis.riskScore} size="lg" />
          </div>

          {/* Non-Definitive Advisory Disclaimer */}
          <div className="p-3.5 rounded-xl bg-accentPurple/10 border border-accentPurple/30 text-accentPurple text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-accentPurple flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">{t('advisoryAiAssessment')}</span>
              <span>{t('advisoryAiText')}</span>
            </div>
          </div>

          {/* Detected Risk Indicators */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-charcoal-800 dark:text-charcoal-200 uppercase tracking-wider">{t('detectedIndicatorsTitle')}</h4>
            <div className="space-y-1.5">
              {analysis.indicators.map((ind, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 text-xs text-charcoal-800 dark:text-charcoal-200 flex items-center space-x-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-accentGreen flex-shrink-0" />
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Explanation: Why Was This Flagged? */}
          <div className="border border-charcoal-200 dark:border-charcoal-800 rounded-2xl overflow-hidden bg-ivory-50 dark:bg-charcoal-950/60">
            <button
              onClick={() => setExpandedWhy(!expandedWhy)}
              className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-charcoal-800 dark:text-charcoal-200 hover:bg-ivory-100 dark:hover:bg-charcoal-800/50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-accentPurple" />
                <span>{t('whyFlaggedTitle')}</span>
              </div>
              {expandedWhy ? <ChevronUp className="w-4 h-4 text-charcoal-400" /> : <ChevronDown className="w-4 h-4 text-charcoal-400" />}
            </button>

            {expandedWhy && (
              <div className="p-4 pt-0 border-t border-charcoal-200/60 dark:border-charcoal-800/60 space-y-2 text-xs text-charcoal-700 dark:text-charcoal-300">
                {analysis.explanations.map((exp, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-accentPurple font-mono font-bold">•</span>
                    <p>{exp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={onProceed}
            className="w-full py-3.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-subtle hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('generateCaseIdBtn')}</span>
          </button>

        </div>
      )}

    </div>
  );
};
