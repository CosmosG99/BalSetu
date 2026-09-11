import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';
import { CaseTable } from '../components/responder/CaseTable';
import { MetricCard } from '../components/admin/MetricCard';
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
  TrendingUp
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const ResponderDashboard: React.FC = () => {
  const { cases } = useCases();
  const navigate = useNavigate();

  const activeCasesCount = cases.filter((c) => c.status !== 'RESOLVED').length;
  const highPriorityCount = cases.filter(
    (c) => c.aiAnalysis.riskLevel === 'CRITICAL' || c.aiAnalysis.riskLevel === 'HIGH'
  ).length;
  const newReportsCount = cases.filter((c) => c.status === 'NEW').length;
  const resolvedCount = cases.filter((c) => c.status === 'RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Command Center Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">RAKSHAK RESPONSE CENTER</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-purple/20 text-purple-300 border border-brand-purple/30">
              Live Transit Monitor
            </span>
          </div>
          <p className="text-xs text-slate-400">Coordinated first-mile triage & ground dispatch portal</p>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/responder/map"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs transition-colors flex items-center space-x-1.5"
          >
            <MapIcon className="w-3.5 h-3.5 text-brand-purple" />
            <span>Transit Map</span>
          </Link>
          <Link
            to="/responder/matches"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs transition-colors flex items-center space-x-1.5"
          >
            <Users className="w-3.5 h-3.5 text-brand-magenta" />
            <span>Missing Child Matching</span>
          </Link>
          <Link
            to="/admin"
            className="px-4 py-2 rounded-xl bg-brand-purple/20 hover:bg-brand-purple/30 text-purple-200 border border-brand-purple/40 font-semibold text-xs transition-colors"
          >
            Analytics View
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
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
          title="NEW REPORTS"
          value={newReportsCount}
          change="Pending triage"
          icon={FileText}
          accentColor="purple"
        />
        <MetricCard
          title="RESOLVED CASES"
          value={resolvedCount}
          change="+14 reunited"
          icon={CheckCircle2}
          accentColor="emerald"
        />
      </div>

      {/* Active Cases Queue Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Live Incident Queue & Dispatch Matrix</h2>
          <span className="text-xs text-slate-400 font-mono">Showing {cases.length} Synthetic Records</span>
        </div>

        <CaseTable cases={cases} />
      </div>

    </div>
  );
};
