import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCases } from '../context/CaseContext';
import { CaseStatus } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { CaseTimeline } from '../components/responder/CaseTimeline';
import { SmartRoutingCard } from '../components/responder/SmartRoutingCard';
import { EvidenceViewer } from '../components/responder/EvidenceViewer';
import { AuditLogView } from '../components/responder/AuditLogView';
import {
  ArrowLeft,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  MessageSquarePlus,
  Cpu,
  MapPin,
  Clock,
  Send,
  Sparkles
} from 'lucide-react';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCaseById, updateCaseStatus, addNoteToCase } = useCases();

  const caseData = id ? getCaseById(id) : undefined;
  const [noteText, setNoteText] = useState('');
  const [responderName, setResponderName] = useState('Officer R. Sharma (Duty Lead)');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState<CaseStatus>('UNDER_REVIEW');

  if (!caseData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Case Reference Not Found</h2>
        <p className="text-xs text-slate-400">The specified Case ID "{id}" was not found in the response registry.</p>
        <Link
          to="/responder"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-purple text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const handleAssignToMe = () => {
    updateCaseStatus(caseData.id, 'ASSIGNED', responderName);
  };

  const handleApplyStatusChange = () => {
    updateCaseStatus(caseData.id, selectedNewStatus, responderName);
    setStatusModalOpen(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNoteToCase(caseData.id, noteText.trim(), responderName);
    setNoteText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/responder"
          className="inline-flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Responder Dashboard</span>
        </Link>

        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Case Registry ID: <span className="font-bold text-brand-purple">{caseData.id}</span>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{caseData.id}</h1>
              <RiskBadge level={caseData.aiAnalysis.riskLevel} score={caseData.aiAnalysis.riskScore} size="lg" />
              <StatusBadge status={caseData.status} size="md" />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-2">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-brand-purple" />
                <span className="font-bold text-slate-900 dark:text-white">{caseData.report.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Reported: {caseData.report.approxTime || 'Recent'}</span>
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Reporter: <span className="text-purple-700 dark:text-purple-300 font-semibold">{caseData.report.isAnonymous ? 'Anonymous Citizen' : caseData.report.reporterRole}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAssignToMe}
              className="py-2.5 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs shadow-glow-purple flex items-center space-x-1.5 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Assign to Me</span>
            </button>

            <button
              onClick={() => setStatusModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
            >
              Update Status
            </button>

            <button
              onClick={() => updateCaseStatus(caseData.id, 'INTERVENTION', responderName)}
              className="py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-300 font-bold text-xs border border-red-500/30 transition-colors"
            >
              Escalate Case
            </button>
          </div>
        </div>

        {/* Assigned Responder Bar */}
        {caseData.assignedResponder && (
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-900 dark:text-purple-200 flex items-center space-x-2 font-medium">
            <UserCheck className="w-4 h-4 text-brand-purple" />
            <span>Assigned Ground Responder: <strong className="text-slate-900 dark:text-white">{caseData.assignedResponder}</strong></span>
          </div>
        )}
      </div>

      {/* Grid Layout: Left Column (Triage + Details + Evidence), Right Column (Routing + Timeline + Audit) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Triage Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-brand-purple" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">AI-Assisted Triage Assessment</h3>
              </div>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-brand-purple/10 dark:bg-brand-purple/20 px-2.5 py-0.5 rounded-full border border-brand-purple/30">
                Score {caseData.aiAnalysis.riskScore}/100
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1 shadow-sm">
              <span className="font-semibold text-amber-600 dark:text-amber-400 block">Advisory Disclaimer</span>
              <p>"AI output is advisory. Mandatory human verification is required."</p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Detected Indicators</span>
              <div className="space-y-1.5">
                {caseData.aiAnalysis.indicators.map((ind, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-xs pt-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Why Flagged?</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                {caseData.aiAnalysis.explanations.map((exp, idx) => (
                  <li key={idx}>{exp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Citizen Description Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Submitted Incident Description</h3>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white/90 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              "{caseData.report.description}"
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 font-mono">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px]">Age</span>
                <span className="text-slate-900 dark:text-white font-bold">{caseData.report.approxAge || 'Unspecified'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px]">Gender</span>
                <span className="text-slate-900 dark:text-white font-bold">{caseData.report.apparentGender || 'Unspecified'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px]">Clothing</span>
                <span className="text-slate-900 dark:text-white font-bold truncate block">{caseData.report.clothing || 'Unspecified'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px]">Platform / Gate</span>
                <span className="text-slate-900 dark:text-white font-bold">{caseData.report.platformOrGate || 'Unspecified'}</span>
              </div>
            </div>
          </div>

          {/* Evidence Media Viewer */}
          <EvidenceViewer photoUrl={caseData.report.photoUrl} isBlurredDefault={caseData.report.isBlurred} />

          {/* Add Internal Notes */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
              <MessageSquarePlus className="w-4 h-4 text-brand-purple" />
              <span>Add Internal Ground Note</span>
            </h3>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter physical welfare check observations or ground updates..."
                className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-purple shadow-sm"
              />
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={responderName}
                  onChange={(e) => setResponderName(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-300 focus:outline-none shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!noteText.trim()}
                  className="py-2 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs disabled:opacity-50 transition-all flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Log Note</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column (1 Col wide on desktop) */}
        <div className="space-y-6">
          
          {/* Smart Response Network Routing */}
          <SmartRoutingCard routing={caseData.routing} location={caseData.report.location} />

          {/* Case Timeline */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">
            <CaseTimeline timeline={caseData.timeline} />
          </div>

          {/* Immutable Audit Log */}
          <AuditLogView logs={caseData.auditLogs} />

        </div>

      </div>

      {/* Status Update Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Update Workflow Status</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Select the new operational state for Case {caseData.id}:</p>

            <div className="space-y-2">
              {(['NEW', 'TRIAGED', 'UNDER_REVIEW', 'ROUTED', 'ASSIGNED', 'INTERVENTION', 'RESOLVED'] as CaseStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedNewStatus(st)}
                  className={`w-full p-3 rounded-xl border text-xs text-left flex items-center justify-between font-bold transition-all ${
                    selectedNewStatus === st
                      ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{st}</span>
                  {selectedNewStatus === st && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyStatusChange}
                className="px-5 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-sm"
              >
                Apply Status Change
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
