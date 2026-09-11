import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { IncidentType, ReportInput, CaseModel } from '../types';
import { IncidentCard } from '../components/citizen/IncidentCard';
import { LocationPicker } from '../components/citizen/LocationPicker';
import { EvidenceUploader } from '../components/citizen/EvidenceUploader';
import { AIAnalysisModal } from '../components/citizen/AIAnalysisModal';
import { CaseSuccessCard } from '../components/citizen/CaseSuccessCard';
import { analyzeReportWithAI } from '../services/mockAiService';
import { ArrowLeft, ArrowRight, Save, PhoneCall, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReportPage: React.FC = () => {
  const { t } = useLanguage();
  const { reportDraft, updateReportDraft, submitReport, saveOfflineDraft } = useCases();

  const [step, setStep] = useState<number>(1);
  const [createdCase, setCreatedCase] = useState<CaseModel | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const incidentTypesList: IncidentType[] = [
    'LOST',
    'DISTRESSED',
    'UNACCOMPANIED',
    'TRAFFICKING',
    'ABUSE',
    'BULLYING',
    'OTHER'
  ];

  const handleToggleIncident = (type: IncidentType) => {
    const current = reportDraft.incidentTypes || [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updateReportDraft({ incidentTypes: next });
  };

  const handleNextStep1 = () => {
    if ((reportDraft.incidentTypes || []).length === 0) return;
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!reportDraft.location || reportDraft.location.trim().length === 0) return;
    setStep(3);
  };

  const handleReviewStep = () => {
    if (!reportDraft.description || reportDraft.description.trim().length === 0) return;
    setStep(4);
  };

  const handleTriggerAITriage = async () => {
    setStep(5);
    setIsAnalyzing(true);
    const fullInput: ReportInput = {
      incidentTypes: reportDraft.incidentTypes || ['LOST'],
      location: reportDraft.location || 'Mumbai Central Railway Station',
      locationType: reportDraft.locationType || 'RAILWAY_STATION',
      stationName: reportDraft.stationName || 'Mumbai Central',
      description: reportDraft.description || 'Child appears lost and distressed.',
      approxAge: reportDraft.approxAge,
      apparentGender: reportDraft.apparentGender,
      clothing: reportDraft.clothing,
      direction: reportDraft.direction,
      platformOrGate: reportDraft.platformOrGate,
      approxTime: reportDraft.approxTime || 'Just Now',
      photoUrl: reportDraft.photoUrl,
      isBlurred: reportDraft.isBlurred !== undefined ? reportDraft.isBlurred : true,
      isAnonymous: reportDraft.isAnonymous !== undefined ? reportDraft.isAnonymous : true,
      reporterRole: reportDraft.reporterRole || 'Citizen'
    };

    const aiRes = await analyzeReportWithAI(fullInput);
    setAiAnalysisResult(aiRes);
    setIsAnalyzing(false);
  };

  const handleFinalSubmit = async () => {
    const fullInput: ReportInput = {
      incidentTypes: reportDraft.incidentTypes || ['LOST'],
      location: reportDraft.location || 'Mumbai Central Railway Station',
      locationType: reportDraft.locationType || 'RAILWAY_STATION',
      stationName: reportDraft.stationName || 'Mumbai Central',
      description: reportDraft.description || 'Child appears lost and distressed.',
      approxAge: reportDraft.approxAge,
      apparentGender: reportDraft.apparentGender,
      clothing: reportDraft.clothing,
      direction: reportDraft.direction,
      platformOrGate: reportDraft.platformOrGate,
      approxTime: reportDraft.approxTime || 'Just Now',
      photoUrl: reportDraft.photoUrl,
      isBlurred: reportDraft.isBlurred !== undefined ? reportDraft.isBlurred : true,
      isAnonymous: reportDraft.isAnonymous !== undefined ? reportDraft.isAnonymous : true,
      reporterRole: reportDraft.reporterRole || 'Citizen'
    };

    const newCase = await submitReport(fullInput);
    setCreatedCase(newCase);
    setStep(6);
  };

  const stepLabels = [
    '01 What happened',
    '02 Where',
    '03 Details',
    '04 Review',
    '05 Submitted'
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* App Step Indicator Pills (Steps 1-4) */}
      {step <= 4 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
              {stepLabels.slice(0, 4).map((label, idx) => {
                const currentIdx = idx + 1;
                const isCurrent = step === currentIdx;
                const isPassed = step > currentIdx;
                return (
                  <span
                    key={label}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'bg-brand-purple text-white shadow-glow-purple'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-500 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => saveOfflineDraft()}
                className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium"
              >
                <Save className="w-3 h-3" />
                <span>{t('btnSaveExit')}</span>
              </button>
              <Link
                to="/resources"
                className="text-[11px] text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 font-bold"
              >
                <PhoneCall className="w-3 h-3" />
                <span>{t('btnHelpNow')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: WHAT DID YOU NOTICE? */}
      {step === 1 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-2xl animate-fade-in">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{t('reportStep1Header')}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t('reportStep1Sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {incidentTypesList.map((type) => (
              <IncidentCard
                key={type}
                type={type}
                selected={(reportDraft.incidentTypes || []).includes(type)}
                onToggle={handleToggleIncident}
              />
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <Link
              to="/"
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              {t('btnCancel')}
            </Link>

            <button
              onClick={handleNextStep1}
              disabled={(reportDraft.incidentTypes || []).length === 0}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center space-x-2"
            >
              <span>{t('btnNext')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: WHERE DID YOU NOTICE IT? */}
      {step === 2 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-2xl animate-fade-in">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{t('reportStep2Header')}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t('reportStep2Sub')}
            </p>
          </div>

          <LocationPicker
            location={reportDraft.location || ''}
            locationType={reportDraft.locationType || 'RAILWAY_STATION'}
            stationName={reportDraft.stationName}
            onChangeLocation={(loc, type, station) =>
              updateReportDraft({ location: loc, locationType: type, stationName: station })
            }
          />

          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('btnBack')}</span>
            </button>

            <button
              onClick={handleNextStep2}
              disabled={!reportDraft.location || reportDraft.location.trim().length === 0}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center space-x-2"
            >
              <span>{t('btnNext')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: WHAT DID YOU SEE? */}
      {step === 3 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-2xl animate-fade-in">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{t('reportStep3Header')}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t('reportStep3Sub')}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t('descLabel')}
            </label>
            <textarea
              rows={4}
              value={reportDraft.description || ''}
              onChange={(e) => updateReportDraft({ description: e.target.value })}
              placeholder={t('descPlaceholder')}
              className="w-full p-4 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-purple shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              {t('optionalDetailsTitle')}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 mb-1 block">{t('approxAgeLabel')}</label>
                <input
                  type="text"
                  value={reportDraft.approxAge || ''}
                  onChange={(e) => updateReportDraft({ approxAge: e.target.value })}
                  placeholder="e.g. Around 12 years old"
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple shadow-sm"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 mb-1 block">{t('apparentGenderLabel')}</label>
                <input
                  type="text"
                  value={reportDraft.apparentGender || ''}
                  onChange={(e) => updateReportDraft({ apparentGender: e.target.value })}
                  placeholder="e.g. Male / Female"
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple shadow-sm"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 mb-1 block">{t('clothingLabel')}</label>
                <input
                  type="text"
                  value={reportDraft.clothing || ''}
                  onChange={(e) => updateReportDraft({ clothing: e.target.value })}
                  placeholder="e.g. Blue jacket, jeans"
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple shadow-sm"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 mb-1 block">{t('platformGateLabel')}</label>
                <input
                  type="text"
                  value={reportDraft.platformOrGate || ''}
                  onChange={(e) => updateReportDraft({ platformOrGate: e.target.value })}
                  placeholder="e.g. Platform 4 near ticket room"
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple shadow-sm"
                />
              </div>
            </div>
          </div>

          <EvidenceUploader
            photoUrl={reportDraft.photoUrl}
            isBlurred={reportDraft.isBlurred}
            isAnonymous={reportDraft.isAnonymous !== undefined ? reportDraft.isAnonymous : true}
            onChangePhoto={(url) => updateReportDraft({ photoUrl: url })}
            onChangeBlurred={(blurred) => updateReportDraft({ isBlurred: blurred })}
            onChangeAnonymous={(anonymous) => updateReportDraft({ isAnonymous: anonymous })}
          />

          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('btnBack')}</span>
            </button>

            <button
              onClick={handleReviewStep}
              disabled={!reportDraft.description || reportDraft.description.trim().length === 0}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center space-x-2"
            >
              <span>{t('btnNext')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW REPORT */}
      {step === 4 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-2xl animate-fade-in">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t('reportStep4Header')}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t('reportStep4Sub')}
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase">WHAT HAPPENED</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(reportDraft.incidentTypes || []).map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-brand-purple/10 dark:bg-brand-purple/20 text-purple-700 dark:text-purple-300 font-bold border border-brand-purple/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase">WHERE</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{reportDraft.location}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('descLabel')}</span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{reportDraft.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase">PRIVACY GUARANTEE</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
                {reportDraft.isAnonymous ? 'Anonymous Report' : 'Identified Bystander'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              {t('btnEditDetails')}
            </button>

            <button
              onClick={handleTriggerAITriage}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t('btnSubmitSecurely')}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: FULL-SCREEN IMMERSIVE AI TRIAGE */}
      {step === 5 && aiAnalysisResult && (
        <AIAnalysisModal
          analysis={aiAnalysisResult}
          onProceed={handleFinalSubmit}
        />
      )}

      {/* STEP 6: CASE SUCCESS */}
      {step === 6 && createdCase && (
        <CaseSuccessCard caseData={createdCase} />
      )}

    </div>
  );
};
