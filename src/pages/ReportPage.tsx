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
import { ArrowLeft, ArrowRight, ShieldAlert, Check, Sparkles, Save, HelpCircle, PhoneCall } from 'lucide-react';
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
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
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
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
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
                className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
              >
                <Save className="w-3 h-3" />
                <span>Save & Exit</span>
              </button>
              <Link
                to="/resources"
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 font-bold"
              >
                <PhoneCall className="w-3 h-3" />
                <span>I need help now</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: WHAT DID YOU NOTICE? */}
      {step === 1 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl animate-fade-in">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Tell us what you noticed.</h1>
            <p className="text-xs text-slate-400">
              You don't need to know exactly what's happening to raise a concern. Select all that apply:
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

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <Link
              to="/"
              className="py-2.5 px-4 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:bg-slate-800"
            >
              Cancel & Exit
            </Link>

            <button
              onClick={handleNextStep1}
              disabled={(reportDraft.incidentTypes || []).length === 0}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: WHERE DID YOU NOTICE IT? */}
      {step === 2 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl animate-fade-in">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Where did you notice it?</h1>
            <p className="text-xs text-slate-400">
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

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="py-2.5 px-4 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNextStep2}
              disabled={!reportDraft.location || reportDraft.location.trim().length === 0}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: WHAT DID YOU SEE? */}
      {step === 3 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl animate-fade-in">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">What did you see?</h1>
            <p className="text-xs text-slate-400">
              Describe what caught your attention. Optional photo evidence will be blurred automatically.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Incident Description
            </label>
            <textarea
              rows={4}
              value={reportDraft.description || ''}
              onChange={(e) => updateReportDraft({ description: e.target.value })}
              placeholder={t('descPlaceholder')}
              className="w-full p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
            />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Optional Details (Assists Responders)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 mb-1 block">Approximate Age</label>
                <input
                  type="text"
                  value={reportDraft.approxAge || ''}
                  onChange={(e) => updateReportDraft({ approxAge: e.target.value })}
                  placeholder="e.g. Around 12 years old"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">Apparent Gender</label>
                <input
                  type="text"
                  value={reportDraft.apparentGender || ''}
                  onChange={(e) => updateReportDraft({ apparentGender: e.target.value })}
                  placeholder="e.g. Male / Female"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">Clothing Description</label>
                <input
                  type="text"
                  value={reportDraft.clothing || ''}
                  onChange={(e) => updateReportDraft({ clothing: e.target.value })}
                  placeholder="e.g. Blue jacket, jeans"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">Platform / Gate</label>
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
              className="py-2.5 px-4 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleReviewStep}
              disabled={!reportDraft.description || reportDraft.description.trim().length === 0}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center space-x-2"
            >
              <span>Review Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW REPORT */}
      {step === 4 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl animate-fade-in">
          <div className="border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-extrabold text-white">Review Summary</h1>
            <p className="text-xs text-slate-400">
              Check details before securely initiating AI triage and responder routing.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase">WHAT HAPPENED</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(reportDraft.incidentTypes || []).map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-brand-purple/20 text-purple-300 font-bold border border-brand-purple/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase">WHERE</span>
              <div className="text-sm font-bold text-white">{reportDraft.location}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase">DESCRIPTION</span>
              <p className="text-slate-200 leading-relaxed">{reportDraft.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-semibold uppercase">PRIVACY GUARANTEE</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {reportDraft.isAnonymous ? 'Anonymous Report' : 'Identified Bystander'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-4 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800"
            >
              Edit Details
            </button>

            <button
              onClick={handleTriggerAITriage}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Submit Securely</span>
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
