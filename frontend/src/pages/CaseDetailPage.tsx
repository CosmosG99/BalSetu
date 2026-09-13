import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { CaseStatus } from '../types';
import { formatRelativeTime } from '../api/cases';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { CaseTimeline } from '../components/responder/CaseTimeline';
import { SmartRoutingCard } from '../components/responder/SmartRoutingCard';
import { EvidenceViewer } from '../components/responder/EvidenceViewer';
import { AuditLogView } from '../components/responder/AuditLogView';
import { MapView } from '../components/map/MapView';
import {
  ArrowLeft,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquarePlus,
  Cpu,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  AlertTriangle,
  UserX,
  FileText
} from 'lucide-react';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getCaseById, updateCaseStatus, addNoteToCase } = useCases();

  const caseData = id ? getCaseById(id) : undefined;
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'evidence' | 'analysis' | 'notes'>('details');
  const [noteText, setNoteText] = useState('');
  const [responderName, setResponderName] = useState('Priya S. (Duty Officer)');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState<CaseStatus>('UNDER_REVIEW');

  if (!caseData) {
    return (
      <div className="natural-panel max-w-4xl mx-auto p-12 text-center space-y-4 shadow-modal">
        <AlertCircle className="w-12 h-12 text-terracotta-600 mx-auto" />
        <h2 className="text-2xl font-bold text-charcoal-800 dark:text-ivory-100">Case Reference Not Found</h2>
        <p className="text-xs text-charcoal-500">The specified Case ID "{id}" was not found in the response registry.</p>
        <Link
          to="/responder"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-forest-900 text-white text-xs font-bold rounded-xl shadow-subtle"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cases</span>
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
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Action Header Bar Matching Blueprint */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-charcoal-200/80 dark:border-charcoal-800 pb-3">
        <Link
          to="/responder"
          className="inline-flex items-center space-x-1.5 text-charcoal-600 dark:text-charcoal-400 hover:text-forest-900 dark:hover:text-ivory-100 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cases</span>
        </Link>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-charcoal-500">Assigned to:</span>
            <span className="font-bold text-forest-900 dark:text-sage-300 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              {caseData.assignedResponder || 'Priya S.'}
            </span>
          </div>

          <button
            onClick={() => setStatusModalOpen(true)}
            className="py-2 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-subtle transition-all flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sage-300" />
            <span>Update Status</span>
          </button>
        </div>
      </div>

      {/* Primary Case ID & Concern Header */}
      <div className="natural-panel p-6 space-y-4 shadow-modal">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-charcoal-200/80 dark:border-charcoal-800 pb-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-extrabold text-charcoal-800 dark:text-ivory-100 font-mono tracking-wider">{caseData.id}</h1>
              <RiskBadge level={caseData.aiAnalysis.riskLevel} score={caseData.aiAnalysis.riskScore} size="lg" />
              <StatusBadge status={caseData.status} size="md" />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-charcoal-600 dark:text-charcoal-400 font-medium">
              <span className="font-bold text-charcoal-800 dark:text-ivory-100 flex items-center gap-1">
                <UserX className="w-4 h-4 text-terracotta-600" />
                {caseData.report.incidentTypes.join(', ')}
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-forest-900 dark:text-sage-400" />
                <span>{caseData.report.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1" title={caseData.createdAt ? new Date(caseData.createdAt).toLocaleString() : undefined}>
                <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                <span>{caseData.report.approxTime || formatRelativeTime(caseData.createdAt)}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAssignToMe}
              className="py-2 px-3.5 rounded-xl bg-ivory-100 dark:bg-charcoal-800 hover:bg-ivory-200 dark:hover:bg-charcoal-700 text-charcoal-800 dark:text-ivory-100 border border-charcoal-200 dark:border-charcoal-700 text-xs font-bold transition-colors"
            >
              Assign to Me
            </button>
            <button
              onClick={() => updateCaseStatus(caseData.id, 'INTERVENTION', responderName)}
              className="py-2 px-3.5 rounded-xl bg-terracotta-600/15 hover:bg-terracotta-600/25 text-terracotta-700 dark:text-terracotta-500 font-bold text-xs border border-terracotta-600/30 transition-colors"
            >
              Escalate Case
            </button>
          </div>
        </div>

        {/* Tab Navigation matching Blueprint */}
        <div className="flex items-center space-x-1 border-b border-charcoal-200/80 dark:border-charcoal-800 pt-1 text-xs">
          {[
            { id: 'details', label: 'Details' },
            { id: 'timeline', label: 'Timeline' },
            { id: 'evidence', label: 'Evidence' },
            { id: 'analysis', label: 'AI Analysis' },
            { id: 'notes', label: 'Responder Notes' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-forest-900 dark:border-sage-400 text-forest-900 dark:text-ivory-100'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800 dark:hover:text-ivory-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid matching Blueprint Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols wide) */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeTab === 'details' && (
            <>
              {/* Case Information Box matching Blueprint */}
              <div className="natural-panel p-6 space-y-5 shadow-modal">
                <h3 className="text-xs font-bold text-charcoal-800 dark:text-ivory-100 uppercase tracking-wider">Case Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-charcoal-500 font-medium block">Location</span>
                    <div className="font-bold text-charcoal-800 dark:text-ivory-100">{caseData.report.location}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-charcoal-500 font-medium block">Date & Time</span>
                    <div className="font-bold text-charcoal-800 dark:text-ivory-100">12 Sep 2026, 04:32 PM</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-charcoal-500 font-medium block">Submitted Via</span>
                    <div className="font-bold text-forest-900 dark:text-sage-300">
                      {caseData.report.isAnonymous ? 'Citizen Report (Anonymous)' : caseData.report.reporterRole}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-charcoal-500 font-medium block">Child Details</span>
                    <div className="font-bold text-charcoal-800 dark:text-ivory-100">
                      Approx. {caseData.report.approxAge || '8-12 years'}, {caseData.report.apparentGender || 'Female'}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-charcoal-200/80 dark:border-charcoal-800 text-xs">
                  <span className="text-charcoal-500 font-medium block uppercase tracking-wider text-[10px]">Description</span>
                  <p className="text-charcoal-800 dark:text-charcoal-200 leading-relaxed bg-ivory-50 dark:bg-charcoal-950 p-4 rounded-xl border border-charcoal-200/80 dark:border-charcoal-800">
                    "{caseData.report.description}"
                  </p>
                </div>

                {/* Map Preview Container inside Details */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-charcoal-800 dark:text-ivory-100 uppercase tracking-wider">Map Concourse Radar</span>
                    <Link to="/responder/map" className="text-xs text-forest-900 dark:text-sage-300 font-bold hover:underline">
                      View on Map →
                    </Link>
                  </div>
                  <MapView cases={[caseData]} interactive={false} />
                </div>
              </div>

              {/* Media Evidence Gallery */}
              <EvidenceViewer photoUrl={caseData.report.photoUrl} isBlurredDefault={caseData.report.isBlurred} />
            </>
          )}

          {activeTab === 'timeline' && (
            <div className="natural-panel p-6 shadow-modal">
              <CaseTimeline timeline={caseData.timeline} />
            </div>
          )}

          {activeTab === 'evidence' && (
            <EvidenceViewer photoUrl={caseData.report.photoUrl} isBlurredDefault={caseData.report.isBlurred} />
          )}

          {activeTab === 'analysis' && (
            <div className="natural-panel p-6 space-y-4 shadow-modal">
              <div className="flex items-center justify-between border-b border-charcoal-200/80 dark:border-charcoal-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-forest-900 dark:text-sage-300" />
                  <h3 className="text-sm font-bold text-charcoal-800 dark:text-ivory-100 uppercase tracking-wider">Full AI-Assisted Triage Analysis</h3>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-forest-900/10 dark:bg-forest-800/30 text-forest-900 dark:text-sage-300">
                  Score {caseData.aiAnalysis.riskScore}/100
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <span className="font-bold text-charcoal-800 dark:text-ivory-100 uppercase tracking-wider block">Detected Indicators</span>
                {caseData.aiAnalysis.indicators.map((ind, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-ivory-50 dark:bg-charcoal-950 border border-charcoal-200/80 dark:border-charcoal-800 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-forest-900 dark:text-sage-400 flex-shrink-0" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-charcoal-200/80 dark:border-charcoal-800">
                <span className="font-bold text-charcoal-800 dark:text-ivory-100 uppercase tracking-wider block">Explanations</span>
                <ul className="list-disc list-inside space-y-1.5 text-charcoal-600 dark:text-charcoal-300">
                  {caseData.aiAnalysis.explanations.map((exp, idx) => (
                    <li key={idx}>{exp}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="natural-panel p-6 space-y-4 shadow-modal">
              <h3 className="text-xs font-bold text-charcoal-800 dark:text-ivory-100 uppercase tracking-wider flex items-center space-x-1.5">
                <MessageSquarePlus className="w-4 h-4 text-forest-900 dark:text-sage-300" />
                <span>Responder Ground Notes</span>
              </h3>

              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter physical welfare check observations or ground updates..."
                  className="w-full p-3.5 bg-white dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 rounded-xl text-xs text-charcoal-800 dark:text-ivory-100 placeholder-charcoal-400 focus:outline-none focus:border-forest-900 shadow-sm"
                />
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={responderName}
                    onChange={(e) => setResponderName(e.target.value)}
                    className="bg-white dark:bg-charcoal-950 border border-charcoal-200 dark:border-charcoal-800 rounded-lg px-3 py-1.5 text-xs text-charcoal-800 dark:text-ivory-100 focus:outline-none shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={!noteText.trim()}
                    className="py-2 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs disabled:opacity-50 transition-all flex items-center space-x-1 shadow-subtle"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Log Note</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Right Column: Risk Assessment Panel matching Blueprint (4 Cols wide) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Circular Risk Assessment Gauge Panel matching Blueprint */}
          <div className="natural-panel p-6 space-y-6 text-center shadow-modal">
            <h3 className="text-xs font-bold text-charcoal-800 dark:text-ivory-100 uppercase tracking-wider text-left">Risk Assessment</h3>

            {/* Circular Gauge Score 78/100 */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-ivory-200 dark:text-charcoal-800"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={376}
                  strokeDashoffset={376 - (376 * caseData.aiAnalysis.riskScore) / 100}
                  strokeLinecap="round"
                  className="text-terracotta-600 dark:text-terracotta-500 transition-all duration-1000"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold font-mono text-charcoal-800 dark:text-ivory-100">{caseData.aiAnalysis.riskScore}</span>
                <span className="text-[10px] text-charcoal-500 font-mono">100</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-terracotta-700 dark:text-terracotta-500 uppercase tracking-wider block">
                {caseData.aiAnalysis.riskLevel} PRIORITY
              </span>
            </div>

            {/* Detected Risk Bullet Points */}
            <div className="space-y-2 text-left text-xs pt-2 border-t border-charcoal-200/80 dark:border-charcoal-800">
              {caseData.aiAnalysis.indicators.map((ind, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-charcoal-700 dark:text-charcoal-300">
                  <span className="w-2 h-2 rounded-full bg-terracotta-600 flex-shrink-0" />
                  <span>{ind}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-ivory-100 dark:bg-charcoal-950 border border-charcoal-200/80 dark:border-charcoal-800 text-[11px] text-charcoal-500 font-medium">
              AI assists. Humans decide.
            </div>

            {/* Recommended Action Card matching Blueprint */}
            <div className="p-4 rounded-2xl bg-forest-900/10 dark:bg-forest-800/30 border border-forest-900/20 text-left space-y-2">
              <span className="text-[10px] font-bold text-forest-900 dark:text-sage-300 uppercase tracking-wider block">Recommended Action</span>
              <p className="text-xs font-bold text-charcoal-800 dark:text-ivory-100">Human verification recommended</p>
              <button
                onClick={() => setActiveTab('analysis')}
                className="w-full py-2.5 px-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-subtle transition-all text-center"
              >
                View Full Analysis →
              </button>
            </div>

          </div>

          {/* Smart Response Routing Matrix */}
          <SmartRoutingCard routing={caseData.routing} location={caseData.report.location} />

          {/* Audit Trail */}
          <AuditLogView logs={caseData.auditLogs} />

        </div>

      </div>

      {/* Status Update Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="natural-panel p-6 max-w-md w-full space-y-4 shadow-modal animate-fade-in">
            <h3 className="text-lg font-bold text-charcoal-800 dark:text-ivory-100">Update Workflow Status</h3>
            <p className="text-xs text-charcoal-500">Select the new operational state for Case {caseData.id}:</p>

            <div className="space-y-2">
              {(['NEW', 'TRIAGED', 'UNDER_REVIEW', 'ROUTED', 'ASSIGNED', 'INTERVENTION', 'RESOLVED'] as CaseStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedNewStatus(st)}
                  className={`w-full p-3 rounded-xl border text-xs text-left flex items-center justify-between font-bold transition-all ${
                    selectedNewStatus === st
                      ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                      : 'bg-ivory-100 dark:bg-charcoal-950 border-charcoal-200 dark:border-charcoal-800 text-charcoal-800 dark:text-charcoal-300 hover:bg-ivory-200'
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
                className="px-4 py-2 rounded-xl bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyStatusChange}
                className="px-5 py-2 rounded-xl bg-forest-900 text-white text-xs font-bold shadow-sm"
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
