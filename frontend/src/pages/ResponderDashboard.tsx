import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { CaseTable } from '../components/responder/CaseTable';
import { MetricCard } from '../components/admin/MetricCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { MapView } from '../components/map/MapView';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  FileText,
  CheckCircle2,
  Layers,
  ArrowRight,
  Shield,
  Activity,
  MapPin,
  Clock,
  Filter,
  X,
  Settings as SettingsIcon,
  UserCheck
} from 'lucide-react';

export const ResponderDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { cases } = useCases();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const tab = searchParams.get('tab');

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const activeCasesCount = cases.filter((c) => c.status !== 'RESOLVED').length;
  const highPriorityCount = cases.filter(
    (c) => c.aiAnalysis.riskLevel === 'CRITICAL' || c.aiAnalysis.riskLevel === 'HIGH'
  ).length;
  const newReportsCount = cases.filter((c) => c.status === 'NEW' || c.status === 'TRIAGED').length;
  const resolvedCount = cases.filter((c) => c.status === 'RESOLVED').length;

  let filteredCases = cases;
  if (filter === 'active') {
    filteredCases = cases.filter((c) => c.status !== 'RESOLVED');
  } else if (filter === 'priority') {
    filteredCases = cases.filter((c) => c.aiAnalysis.riskLevel === 'CRITICAL' || c.aiAnalysis.riskLevel === 'HIGH');
  } else if (filter === 'new') {
    filteredCases = cases.filter((c) => c.status === 'NEW' || c.status === 'TRIAGED');
  } else if (filter === 'assigned') {
    filteredCases = cases.filter((c) => c.assignedResponder);
  }

  const highestPriorityCase = cases.find((c) => c.aiAnalysis.riskLevel === 'HIGH' || c.aiAnalysis.riskLevel === 'CRITICAL') || cases[0];

  const filterNames: Record<string, string> = {
    active: 'Active Cases',
    priority: 'High Priority Alerts',
    new: 'New Incident Reports',
    assigned: 'Assigned to Me'
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Eye-Catching Wealth DNA-Inspired Hero/Overview Command Panel */}
      <div className="natural-panel p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-700 via-teal-800 to-charcoal-900 text-white shadow-modal relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-mint-200">
              <span className="w-2 h-2 rounded-full bg-mint-200 animate-pulse" />
              <span>LIVE INCIDENT STREAM • 24/7 STATION PROTECTION</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Coordinated Child Protection & Triage Command
            </h1>

            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-xl">
              Real-time bystander observations are processed through advisory AI triage and routed directly to platform responders and welfare desks.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/report"
                className="px-5 py-2.5 rounded-xl bg-white text-teal-900 font-extrabold text-xs shadow-card hover:bg-ivory-100 transition-all flex items-center space-x-1.5"
              >
                <span>Report New Concern</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/responder/map"
                className="px-5 py-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-800 text-white font-bold text-xs border border-teal-500/40 shadow-sm transition-all flex items-center space-x-1.5"
              >
                <span>Open Transit Map</span>
              </Link>
            </div>
          </div>

          {/* Right Highlight Box: Live Active Case Snapshot */}
          {highestPriorityCase && (
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl space-y-3 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-mint-200 uppercase tracking-wider">HIGHEST PRIORITY ALERT</span>
                <RiskBadge level={highestPriorityCase.aiAnalysis.riskLevel} score={highestPriorityCase.aiAnalysis.riskScore} size="sm" />
              </div>

              <div>
                <div className="font-mono text-sm font-extrabold text-white">{highestPriorityCase.id}</div>
                <div className="text-xs font-bold text-white line-clamp-1">{highestPriorityCase.report.incidentTypes.join(', ')}</div>
                <div className="text-[11px] text-teal-100 flex items-center space-x-1 mt-1">
                  <MapPin className="w-3 h-3 text-mint-200 flex-shrink-0" />
                  <span className="truncate">{highestPriorityCase.report.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <StatusBadge status={highestPriorityCase.status} size="sm" />
                <button
                  onClick={() => navigate(`/responder/cases/${highestPriorityCase.id}`)}
                  className="px-3 py-1 rounded-lg bg-white text-teal-900 font-bold text-[11px] hover:bg-ivory-100 transition-colors"
                >
                  Inspect Case →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Top 4 KPI Metrics Row (Highlighting the active filter metric card) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`transition-all duration-300 rounded-2xl ${filter === 'active' ? 'ring-4 ring-teal-500 shadow-xl scale-[1.03] bg-teal-50/50 dark:bg-teal-900/20' : ''}`}>
          <MetricCard
            title="ACTIVE CASES"
            value={activeCasesCount}
            change="+12% active"
            icon={Layers}
            accentColor="teal"
          />
        </div>

        <div className={`transition-all duration-300 rounded-2xl ${filter === 'priority' ? 'ring-4 ring-coral-500 shadow-xl scale-[1.03] bg-coral-50/50 dark:bg-coral-900/20' : ''}`}>
          <MetricCard
            title="HIGH PRIORITY"
            value={highPriorityCount}
            change="+2 new alerts"
            isPositive={false}
            icon={AlertTriangle}
            accentColor="coral"
          />
        </div>

        <div className={`transition-all duration-300 rounded-2xl ${filter === 'new' ? 'ring-4 ring-amberGold-500 shadow-xl scale-[1.03] bg-amber-50/50 dark:bg-amber-900/20' : ''}`}>
          <MetricCard
            title="NEW REPORTS"
            value={newReportsCount}
            change="+18% volume"
            icon={FileText}
            accentColor="amber"
          />
        </div>

        <div className={`transition-all duration-300 rounded-2xl ${filter === 'assigned' ? 'ring-4 ring-teal-500 shadow-xl scale-[1.03] bg-teal-50/50 dark:bg-teal-900/20' : ''}`}>
          <MetricCard
            title="RESOLVED"
            value={resolvedCount}
            change="+24% safe"
            icon={CheckCircle2}
            accentColor="mint"
          />
        </div>
      </div>

      {/* Active Sidebar Filter Highlight Banner */}
      {filter && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-700/10 via-teal-600/15 to-transparent border-2 border-teal-600/50 shadow-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-teal-700 text-white font-bold shadow-sm">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                <span>SIDEBAR SELECTION HIGHLIGHTED</span>
              </div>
              <div className="text-base font-extrabold text-charcoal-800 dark:text-charcoal-100 flex items-center gap-2 mt-0.5">
                <span>Filtered View: <span className="text-teal-700 dark:text-teal-300">{filterNames[filter] || filter}</span></span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-700 text-white shadow-xs">
                  {filteredCases.length} Cases
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/responder')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-charcoal-900 border border-charcoal-300 dark:border-charcoal-700 text-xs font-bold text-charcoal-700 dark:text-charcoal-200 hover:text-teal-700 hover:border-teal-500 flex items-center space-x-1.5 shadow-xs transition-all"
          >
            <X className="w-4 h-4 text-coral-600" />
            <span>Clear Filter</span>
          </button>
        </div>
      )}

      {/* Settings View Panel when Settings Sidebar item is clicked */}
      {tab === 'settings' ? (
        <div className="natural-panel p-6 sm:p-8 rounded-3xl space-y-6 border-2 border-teal-600/60 dark:border-teal-500/60 ring-4 ring-teal-500/10 shadow-xl bg-white/90 dark:bg-charcoal-900/90 animate-fade-in">
          <div className="flex items-center justify-between border-b border-charcoal-200 dark:border-charcoal-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-teal-700 text-white">
                <SettingsIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-charcoal-800 dark:text-charcoal-100">
                  Responder Console Settings
                </h2>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-400">
                  Manage your active duty preferences, triage notifications, and station dispatch alerts.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/responder')}
              className="p-2 rounded-xl text-charcoal-500 hover:text-charcoal-800 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-ivory-100/80 dark:bg-charcoal-950/80 border border-charcoal-200 dark:border-charcoal-800 space-y-3">
              <h3 className="text-sm font-bold text-charcoal-800 dark:text-charcoal-100 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>Duty & Station Status</span>
              </h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400">
                You are currently registered as <span className="font-bold text-teal-700 dark:text-teal-400">On Duty</span> at Central Railway Station Welfare Desk.
              </p>
              <div className="flex gap-2 pt-2">
                <button className="px-3 py-1.5 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-xs">On Duty</button>
                <button className="px-3 py-1.5 rounded-xl bg-charcoal-200 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 font-semibold text-xs">Standby</button>
                <button className="px-3 py-1.5 rounded-xl bg-charcoal-200 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 font-semibold text-xs">Off Duty</button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-ivory-100/80 dark:bg-charcoal-950/80 border border-charcoal-200 dark:border-charcoal-800 space-y-3">
              <h3 className="text-sm font-bold text-charcoal-800 dark:text-charcoal-100 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amberGold-600 dark:text-amberGold-400" />
                <span>AI Urgency Notifications</span>
              </h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400">
                Receive instant sound alerts and desktop pop-ups for high risk child protection flags.
              </p>
              <label className="flex items-center space-x-2 text-xs font-bold text-charcoal-800 dark:text-charcoal-200 cursor-pointer pt-2">
                <input type="checkbox" defaultChecked className="rounded text-teal-700 focus:ring-teal-500 w-4 h-4" />
                <span>Enable Critical Alert Popup Sound</span>
              </label>
            </div>
          </div>
        </div>
      ) : (
        /* Priority Queue Operational Table (Highlighted when filter is active) */
        <div className={`space-y-4 transition-all duration-300 ${filter ? 'p-4 sm:p-6 rounded-3xl border-2 border-teal-600/50 dark:border-teal-500/50 ring-4 ring-teal-500/10 bg-white/70 dark:bg-charcoal-900/70 shadow-lg' : ''}`}>
          <div className="flex items-center justify-between border-b border-charcoal-200 dark:border-charcoal-800 pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-charcoal-800 dark:text-charcoal-100 flex items-center space-x-2">
                <span>Priority Incident Triage Queue</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-teal-700/10 text-teal-700 dark:text-teal-400 font-bold">
                  {filteredCases.length} Cases
                </span>
              </h2>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400">
                Live operational list ordered by AI-assisted urgency score.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-white dark:bg-charcoal-900 text-charcoal-600 border border-charcoal-200 dark:border-charcoal-800'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-white dark:bg-charcoal-900 text-charcoal-600 border border-charcoal-200 dark:border-charcoal-800'
                }`}
              >
                Card View
              </button>
            </div>
          </div>

          {viewMode === 'table' ? (
            <CaseTable cases={filteredCases} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/responder/cases/${c.id}`)}
                  className="natural-panel natural-card-hover p-5 rounded-2xl space-y-4 cursor-pointer shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-teal-700 dark:text-teal-400">{c.id}</span>
                      <RiskBadge level={c.aiAnalysis.riskLevel} score={c.aiAnalysis.riskScore} size="sm" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-charcoal-800 dark:text-charcoal-100">{c.report.incidentTypes.join(', ')}</h3>
                      <p className="text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-2 mt-1">{c.report.description}</p>
                    </div>

                    <div className="flex items-center space-x-1 text-xs text-charcoal-600 dark:text-charcoal-400">
                      <MapPin className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 flex-shrink-0" />
                      <span className="truncate">{c.report.location}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-charcoal-200/80 dark:border-charcoal-800 flex items-center justify-between text-xs">
                    <StatusBadge status={c.status} size="sm" />
                    <span className="font-bold text-teal-700 dark:text-teal-400">Inspect →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
