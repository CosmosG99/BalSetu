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
import { ArrowLeft, ArrowRight, Save, PhoneCall, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';
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
    { num: '1', name: 'What happened' },
    { num: '2', name: 'Where' },
    { num: '3', name: 'Details' },
    { num: '4', name: 'Review' },
    { num: '5', name: 'Submit' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Stepper Navigation Header Matching Blueprint */}
      {step <= 4 && (
        <div className="natural-panel p-4 flex flex-wrap items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            {stepLabels.map((s, idx) => {
              const currentIdx = idx + 1;
              const isCurrent = step === currentIdx;
              const isPassed = step > currentIdx;
              return (
                <div key={s.num} className="flex items-center space-x-2">
                  <span
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'bg-forest-900 text-white shadow-subtle'
                        : isPassed
                        ? 'bg-sage-100 text-forest-900 dark:bg-forest-800/40 dark:text-sage-300'
                        : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-500'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isCurrent ? 'bg-white text-forest-900' : 'bg-charcoal-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-charcoal-300'
                    }`}>
                      {s.num}
                    </span>
                    <span>{s.name}</span>
                  </span>
                  {idx < stepLabels.length - 1 && <span className="text-charcoal-300 dark:text-charcoal-800">/</span>}
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => saveOfflineDraft()}
              className="text-xs text-charcoal-700 dark:text-charcoal-300 hover:text-forest-900 flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-ivory-100 dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 font-medium transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t('btnSaveExit')}</span>
            </button>
            <Link
              to="/resources"
              className="text-xs text-terracotta-600 dark:text-terracotta-500 hover:underline flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-terracotta-50 dark:bg-terracotta-600/10 border border-terracotta-200 dark:border-terracotta-600/30 font-bold"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t('btnHelpNow')}</span>
            </Link>
          </div>
        </div>
      )}

      {/* STEP 1: WHAT DID YOU NOTICE? (SPLIT BLUEPRINT LAYOUT) */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Selection Cards */}
          <div className="lg:col-span-8 natural-panel p-6 sm:p-8 space-y-6 shadow-modal animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-forest-900 dark:text-sage-400 uppercase">STEP 1 OF 5</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800 dark:text-ivory-100">What did you notice?</h1>
              <p className="text-xs text-charcoal-500">
                You don't need to be sure. If something feels wrong, it's okay to report it. Select all that apply:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {incidentTypesList.map((type) => (
                <IncidentCard
                  key={type}
                  type={type}
                  selected={(reportDraft.incidentTypes || []).includes(type)}
                  onToggle={handleToggleIncident}
                />
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-charcoal-200/80 dark:border-charcoal-800">
              <Link
                to="/"
                className="py-2.5 px-4 rounded-xl bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 text-xs font-semibold hover:bg-ivory-200 dark:hover:bg-charcoal-700 transition-colors"
              >
                ← Back
              </Link>

              <button
                onClick={handleNextStep1}
                disabled={(reportDraft.incidentTypes || []).length === 0}
                className="py-3 px-7 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-subtle disabled:opacity-50 transition-all flex items-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Guidance & Next Steps Panel matching Blueprint */}
          <div className="lg:col-span-4 natural-panel p-6 space-y-6 shadow-modal">
            <div className="w-10 h-10 rounded-xl bg-forest-900/10 dark:bg-forest-800/30 text-forest-900 dark:text-sage-300 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-charcoal-800 dark:text-ivory-100">Every report can make a difference.</h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
                Your report helps create a safer environment for children in public spaces like railway stations, bus terminals and transit hubs.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-charcoal-200/80 dark:border-charcoal-800">
              <span className="text-xs font-bold text-charcoal-800 dark:text-ivory-100 uppercase tracking-wider block">What happens next?</span>
              
              <div className="space-y-2.5 text-xs text-charcoal-700 dark:text-charcoal-300">
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-forest-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <span>You share basic details</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-forest-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <span>We analyze and prioritize the report</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-forest-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span>It's routed to the appropriate responders</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-forest-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                  <span>You get a case ID to track the status</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-charcoal-500 flex items-center space-x-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-900 dark:text-sage-400 flex-shrink-0" />
              <span>Your identity is protected. You can report anonymously.</span>
            </div>
          </div>

        </div>
      )}

      {/* STEP 2: WHERE DID YOU NOTICE IT? */}
      {step === 2 && (
        <div className="max-w-3xl mx-auto natural-panel p-6 sm:p-8 space-y-6 shadow-modal animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-forest-900 dark:text-sage-400 uppercase">STEP 2 OF 5</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800 dark:text-ivory-100">Where did you notice it?</h1>
            <p className="text-xs text-charcoal-500">
              Enter the station name, platform number, or select a high-footfall transit hub.
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

          <div className="pt-4 flex items-center justify-between border-t border-charcoal-200/80 dark:border-charcoal-800">
            <button
              onClick={() => setStep(1)}
              className="py-2.5 px-4 rounded-xl bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 text-xs font-semibold hover:bg-ivory-200 dark:hover:bg-charcoal-700 flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNextStep2}
              disabled={!reportDraft.location || reportDraft.location.trim().length === 0}
              className="py-3 px-7 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-subtle disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: WHAT DID YOU SEE? */}
      {step === 3 && (
        <div className="max-w-3xl mx-auto natural-panel p-6 sm:p-8 space-y-6 shadow-modal animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-forest-900 dark:text-sage-400 uppercase">STEP 3 OF 5</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800 dark:text-ivory-100">What did you see?</h1>
            <p className="text-xs text-charcoal-500">
              Describe what caught your attention. Optional photo evidence will be blurred automatically.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-charcoal-800 dark:text-ivory-100 uppercase tracking-wider">
              {t('descLabel')}
            </label>
            <textarea
              rows={4}
              value={reportDraft.description || ''}
              onChange={(e) => updateReportDraft({ description: e.target.value })}
              placeholder={t('descPlaceholder')}
              className="w-full p-4 bg-white dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 rounded-2xl text-xs text-charcoal-800 dark:text-ivory-100 placeholder-charcoal-400 focus:outline-none focus:border-forest-900 shadow-sm"
            />
          </div>

          <EvidenceUploader
            photoUrl={reportDraft.photoUrl}
            isBlurred={reportDraft.isBlurred}
            isAnonymous={reportDraft.isAnonymous !== undefined ? reportDraft.isAnonymous : true}
            onChangePhoto={(url) => updateReportDraft({ photoUrl: url })}
            onChangeBlurred={(blurred) => updateReportDraft({ isBlurred: blurred })}
            onChangeAnonymous={(anonymous) => updateReportDraft({ isAnonymous: anonymous })}
          />

          <div className="pt-4 flex items-center justify-between border-t border-charcoal-200/80 dark:border-charcoal-800">
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-4 rounded-xl bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 text-xs font-semibold hover:bg-ivory-200 dark:hover:bg-charcoal-700 flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleReviewStep}
              disabled={!reportDraft.description || reportDraft.description.trim().length === 0}
              className="py-3 px-7 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-subtle disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW REPORT */}
      {step === 4 && (
        <div className="max-w-3xl mx-auto natural-panel p-6 sm:p-8 space-y-6 shadow-modal animate-fade-in">
          <div className="border-b border-charcoal-200/80 dark:border-charcoal-800 pb-3 space-y-1">
            <span className="text-xs font-mono font-bold text-forest-900 dark:text-sage-400 uppercase">STEP 4 OF 5</span>
            <h1 className="text-2xl font-extrabold text-charcoal-800 dark:text-ivory-100">Review Summary</h1>
            <p className="text-xs text-charcoal-500">
              Check details before securely initiating AI triage and responder routing.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-ivory-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 space-y-1 shadow-sm">
              <span className="text-charcoal-500 font-semibold uppercase">WHAT HAPPENED</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(reportDraft.incidentTypes || []).map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-forest-900/10 dark:bg-forest-800/30 text-forest-900 dark:text-sage-300 font-bold border border-forest-900/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-ivory-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 space-y-1 shadow-sm">
              <span className="text-charcoal-500 font-semibold uppercase">WHERE</span>
              <div className="text-sm font-bold text-charcoal-800 dark:text-ivory-100">{reportDraft.location}</div>
            </div>

            <div className="p-4 rounded-2xl bg-ivory-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 space-y-1 shadow-sm">
              <span className="text-charcoal-500 font-semibold uppercase">DESCRIPTION</span>
              <p className="text-charcoal-800 dark:text-charcoal-200 leading-relaxed">{reportDraft.description}</p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-charcoal-200/80 dark:border-charcoal-800">
            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-4 rounded-xl bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 text-xs font-semibold hover:bg-ivory-200 dark:hover:bg-charcoal-700"
            >
              Edit Details
            </button>

            <button
              onClick={handleTriggerAITriage}
              className="py-3 px-7 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-subtle hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-sage-300" />
              <span>Submit Securely</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: IMMERSIVE AI TRIAGE */}
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
