import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { IncidentType, LocationType, ReportInput, CaseModel } from '../types';
import { IncidentCard } from '../components/citizen/IncidentCard';
import { LocationPicker } from '../components/citizen/LocationPicker';
import { EvidenceUploader } from '../components/citizen/EvidenceUploader';
import { AIAnalysisModal } from '../components/citizen/AIAnalysisModal';
import { CaseSuccessCard } from '../components/citizen/CaseSuccessCard';
import { analyzeReportWithAI } from '../services/mockAiService';
import { ArrowLeft, ArrowRight, ShieldAlert, Check, Sparkles, Save } from 'lucide-react';

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

  const handleReviewStep = async () => {
    if (!reportDraft.description || reportDraft.description.trim().length === 0) return;
    setStep(4); // Review screen
  };

  const handleTriggerAITriage = async () => {
    setStep(5); // AI Triage modal
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
    setStep(6); // Success
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Step Indicator Header (Steps 1-4) */}
      {step <= 4 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-brand-purple uppercase">STEP {step} OF 4</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{t('reportHeadline')}</h1>
              <p className="text-xs text-slate-400">{t('reportSubhead')}</p>
            </div>
            
            <button
              onClick={() => saveOfflineDraft()}
              className="text-xs text-slate-400 hover:text-amber-300 flex items-center space-x-1 p-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
              title="Save draft locally for offline sync"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Offline</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-brand-purple to-brand-magenta h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: WHAT DID YOU NOTICE? */}
      {step === 1 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl animate-fade-in">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-brand-purple" />
            <span>{t('step1Title')}</span>
          </h2>

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

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleNextStep1}
              disabled={(reportDraft.incidentTypes || []).length === 0}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center space-x-2"
            >
              <span>{t('btnNext')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: WHERE DID YOU NOTICE IT? */}
      {step === 2 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl animate-fade-in">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>{t('step2Title')}</span>
          </h2>

          <LocationPicker
            location={reportDraft.location || ''}
            locationType={reportDraft.locationType || 'RAILWAY_STATION'}
            stationName={reportDraft.stationName}
            onChangeLocation={(loc, type, station) =>
              updateReportDraft({ location: loc, locationType: type, stationName: station })
            }
          />

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="py-2.5 px-4 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('btnBack')}</span>
            </button>

            <button
              onClick={handleNextStep2}
              disabled={!reportDraft.location || reportDraft.location.trim().length === 0}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center space-x-2"
            >
              <span>{t('btnNext')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: WHAT DID YOU SEE? */}
      {step === 3 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl animate-fade-in">
          <h2 className="text-lg font-bold text-white">{t('step3Title')}</h2>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Describe what you noticed
            </label>
            <textarea
              rows={4}
              value={reportDraft.description || ''}
              onChange={(e) => updateReportDraft({ description: e.target.value })}
              placeholder={t('descPlaceholder')}
              className="w-full p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple transition-all"
            />
          </div>

          {/* Optional Fields Accordion / Grid */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Optional Details (Improves Responder Speed)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 mb-1 block">{t('optAge')}</label>
                <input
                  type="text"
                  value={reportDraft.approxAge || ''}
                  onChange={(e) => updateReportDraft({ approxAge: e.target.value })}
                  placeholder="e.g. Around 12 years old"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">{t('optGender')}</label>
                <input
                  type="text"
                  value={reportDraft.apparentGender || ''}
                  onChange={(e) => updateReportDraft({ apparentGender: e.target.value })}
                  placeholder="e.g. Male / Female"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">{t('optClothing')}</label>
                <input
                  type="text"
                  value={reportDraft.clothing || ''}
                  onChange={(e) => updateReportDraft({ clothing: e.target.value })}
                  placeholder="e.g. Blue jacket, jeans"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">{t('optPlatform')}</label>
                <input
                  type="text"
                  value={reportDraft.platformOrGate || ''}
                  onChange={(e) => updateReportDraft({ platformOrGate: e.target.value })}
                  placeholder="e.g. Platform 4 near ticket room"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-purple"
                />
              </div>
            </div>
          </div>

          {/* Evidence Uploader & Anonymous Toggle */}
          <EvidenceUploader
            photoUrl={reportDraft.photoUrl}
            isBlurred={reportDraft.isBlurred}
            isAnonymous={reportDraft.isAnonymous !== undefined ? reportDraft.isAnonymous : true}
            onChangePhoto={(url) => updateReportDraft({ photoUrl: url })}
            onChangeBlurred={(blurred) => updateReportDraft({ isBlurred: blurred })}
            onChangeAnonymous={(anonymous) => updateReportDraft({ isAnonymous: anonymous })}
          />

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-4 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('btnBack')}</span>
            </button>

            <button
              onClick={handleReviewStep}
              disabled={!reportDraft.description || reportDraft.description.trim().length === 0}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center space-x-2"
            >
              <span>Review Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REPORT REVIEW SUMMARY */}
      {step === 4 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl animate-fade-in">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white">Review Your Report</h2>
            <p className="text-xs text-slate-400">
              We only ask for information needed to help responders assess the situation safely.
            </p>
          </div>

          {/* Summary Breakdown */}
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase">Incident Categories</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(reportDraft.incidentTypes || []).map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-brand-purple/20 text-purple-300 font-bold border border-brand-purple/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase">Location</span>
              <div className="text-sm font-bold text-white">{reportDraft.location}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase">Description</span>
              <p className="text-slate-200 leading-relaxed">{reportDraft.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-semibold uppercase">Privacy Status</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {reportDraft.isAnonymous ? 'Anonymous Report' : 'Identified Bystander'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-4 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              {t('btnEdit')}
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

      {/* STEP 5: AI TRIAGE MODAL */}
      {step === 5 && aiAnalysisResult && (
        <AIAnalysisModal
          analysis={aiAnalysisResult}
          onProceed={handleFinalSubmit}
        />
      )}

      {/* STEP 6: SUCCESS & CASE ID GENERATION */}
      {step === 6 && createdCase && (
        <CaseSuccessCard caseData={createdCase} />
      )}

    </div>
  );
};
