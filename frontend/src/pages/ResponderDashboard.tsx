import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { CaseTable } from '../components/responder/CaseTable';
import { MetricCard } from '../components/admin/MetricCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { MapView } from '../components/map/MapView';
import {
  AlertTriangle,
  FileText,
  CheckCircle2,
  Layers,
  ArrowRight,
  Activity,
  UserCheck
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ResponderDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { cases } = useCases();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');

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

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Greeting Header matching Blueprint */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-600 dark:bg-sage-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold text-forest-900 dark:text-sage-300 uppercase">Response Command Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800 dark:text-ivory-100">
            Good evening, Response Team.
          </h1>
          <p className="text-xs text-charcoal-500">
            Here's what needs attention today.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics Row matching Blueprint */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="ACTIVE CASES"
          value={activeCasesCount}
          change="+12% active"
          icon={Layers}
          accentColor="teal"
        />
        <MetricCard
          title="HIGH PRIORITY"
          value={highPriorityCount}
          change="+2 new alerts"
          isPositive={false}
          icon={AlertTriangle}
          accentColor="coral"
        />
        <MetricCard
          title="NEW REPORTS"
          value={newReportsCount}
          change="+18% volume"
          icon={FileText}
          accentColor="amber"
        />
        <MetricCard
          title="RESOLVED"
          value={resolvedCount}
          change="+24% safe"
          icon={CheckCircle2}
          accentColor="mint"
        />
      </div>

      {/* Priority Queue Operational Table matching Blueprint */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-extrabold text-charcoal-800 dark:text-ivory-100">Priority Queue</h2>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-terracotta-600/15 text-terracotta-700 dark:text-terracotta-500 border border-terracotta-600/30">
              {filteredCases.length} Cases
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-ivory-100 dark:bg-charcoal-900 p-1 rounded-xl border border-charcoal-200 dark:border-charcoal-800 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                viewMode === 'table' ? 'bg-forest-900 text-white shadow-sm' : 'text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white'
              }`}
            >
              Compact Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                viewMode === 'cards' ? 'bg-forest-900 text-white shadow-sm' : 'text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white'
              }`}
            >
              Rich Cards
            </button>
          </div>
        </div>

        {/* Priority Table View */}
        {viewMode === 'table' ? (
          <CaseTable cases={filteredCases} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/responder/cases/${c.id}`)}
                className="natural-panel natural-card-hover p-5 space-y-3 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-forest-900 dark:text-sage-300">{c.id}</span>
                    <RiskBadge level={c.aiAnalysis.riskLevel} score={c.aiAnalysis.riskScore} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <StatusBadge status={c.status} size="sm" />
                    <span className="text-charcoal-500 font-mono text-[11px]">{c.report.approxTime || 'Recent'}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-charcoal-800 dark:text-ivory-100 line-clamp-1">{c.report.location}</h4>
                    <p className="text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-2 mt-1">{c.report.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-charcoal-200/80 dark:border-charcoal-800 flex items-center justify-between text-xs">
                  <span className="text-charcoal-500 font-mono text-[11px] truncate">
                    Assigned: <strong className="text-charcoal-800 dark:text-ivory-100">{c.assignedResponder || 'Unassigned'}</strong>
                  </span>
                  <button className="px-3 py-1.5 rounded-lg bg-forest-900/10 dark:bg-forest-800/30 text-forest-900 dark:text-sage-300 font-bold border border-forest-900/20 transition-colors flex items-center space-x-1">
                    <span>Open Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map Preview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-charcoal-800 dark:text-ivory-100 uppercase tracking-wider">Live Transit Map Preview</h3>
          <MapView cases={cases.slice(0, 8)} interactive={false} />
        </div>

        <div className="natural-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal-200/80 dark:border-charcoal-800 pb-2">
            <h3 className="text-xs font-bold text-charcoal-800 dark:text-ivory-100 uppercase tracking-wider flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-forest-900 dark:text-sage-300" />
              <span>Recent Dispatch Stream</span>
            </h3>
            <span className="text-[10px] text-charcoal-500 font-mono">Live</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
            {cases.slice(0, 6).flatMap((c) => c.auditLogs).slice(0, 8).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-ivory-50 dark:bg-charcoal-950 border border-charcoal-200/80 dark:border-charcoal-800 space-y-1 shadow-sm">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-forest-900 dark:text-sage-300">{log.action}</span>
                  <span className="text-charcoal-500">{log.timestamp}</span>
                </div>
                <p className="text-charcoal-700 dark:text-charcoal-300 text-[11px]">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
