import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';
import { CaseTable } from '../components/responder/CaseTable';
import { MetricCard } from '../components/admin/MetricCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { MapView } from '../components/map/MapView';
import { DemoModeDropdown } from '../components/responder/DemoModeDropdown';
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle2,
  MapPin,
  Users,
  Search,
  Filter,
  Layers,
  Map as MapIcon,
  Sparkles,
  ArrowRight,
  Clock,
  Activity,
  UserCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const ResponderDashboard: React.FC = () => {
  const { cases } = useCases();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const activeCasesCount = cases.filter((c) => c.status !== 'RESOLVED').length;
  const highPriorityCount = cases.filter(
    (c) => c.aiAnalysis.riskLevel === 'CRITICAL' || c.aiAnalysis.riskLevel === 'HIGH'
  ).length;
  const newReportsCount = cases.filter((c) => c.status === 'NEW' || c.status === 'TRIAGED').length;
  const resolvedCount = cases.filter((c) => c.status === 'RESOLVED').length;

  const priorityCases = cases.filter(
    (c) => c.aiAnalysis.riskLevel === 'CRITICAL' || c.aiAnalysis.riskLevel === 'HIGH'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Greeting & Operational Status Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Response Command Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Good evening, Response Team.
          </h1>
          <p className="text-xs text-slate-400">
            "Here's what needs attention across high-footfall transit concourses."
          </p>
        </div>

        {/* Quick Action Navigation & Demo Mode Popover */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/responder/map"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs transition-colors flex items-center space-x-1.5"
          >
            <MapIcon className="w-4 h-4 text-brand-purple" />
            <span>Transit Map Radar</span>
          </Link>

          <Link
            to="/responder/matches"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs transition-colors flex items-center space-x-1.5"
          >
            <Users className="w-4 h-4 text-brand-magenta" />
            <span>Missing Child Matches</span>
          </Link>

          {/* Integrated Demo Mode Popover Dropdown */}
          <DemoModeDropdown />
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="ACTIVE CASES"
          value={activeCasesCount}
          change="+8% vs yesterday"
          icon={Layers}
          accentColor="blue"
        />
        <MetricCard
          title="HIGH PRIORITY"
          value={highPriorityCount}
          change="+2 new alerts"
          isPositive={false}
          icon={AlertTriangle}
          accentColor="amber"
        />
        <MetricCard
          title="AWAITING REVIEW"
          value={newReportsCount}
          change="Pending triage"
          icon={FileText}
          accentColor="purple"
        />
        <MetricCard
          title="RESOLVED TODAY"
          value={resolvedCount}
          change="+14 safe reunions"
          icon={CheckCircle2}
          accentColor="emerald"
        />
      </div>

      {/* Priority Queue Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">Priority Dispatch Queue</h2>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
              {priorityCases.length} Critical & High Alerts
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                viewMode === 'cards' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Rich Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Compact Table
            </button>
          </div>
        </div>

        {/* Priority Rich Cards View */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priorityCases.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/responder/cases/${c.id}`)}
                className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 space-y-3 cursor-pointer shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-brand-purple">{c.id}</span>
                    <RiskBadge level={c.aiAnalysis.riskLevel} score={c.aiAnalysis.riskScore} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <StatusBadge status={c.status} size="sm" />
                    <span className="text-slate-400 font-mono text-[11px]">{c.report.approxTime || 'Recent'}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{c.report.location}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">{c.report.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px] truncate">
                    Assigned: <strong className="text-slate-200">{c.assignedResponder || 'Unassigned'}</strong>
                  </span>
                  <button className="px-3 py-1.5 rounded-lg bg-brand-purple/20 hover:bg-brand-purple/30 text-purple-200 font-bold border border-brand-purple/40 transition-colors flex items-center space-x-1">
                    <span>Open Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CaseTable cases={cases} />
        )}
      </div>

      {/* Map Preview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Map Preview (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Transit Map Preview</h3>
            <Link to="/responder/map" className="text-xs text-brand-purple hover:text-purple-300 font-bold">
              Full Screen Radar →
            </Link>
          </div>
          <MapView cases={cases.slice(0, 8)} interactive={false} />
        </div>

        {/* Recent Activity Log (1 Col) */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1">
              <Activity className="w-4 h-4 text-brand-purple" />
              <span>Recent Dispatch Stream</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Live</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
            {cases.slice(0, 6).flatMap((c) => c.auditLogs).slice(0, 8).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-brand-purple">{log.action}</span>
                  <span className="text-slate-500">{log.timestamp}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{log.details}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
