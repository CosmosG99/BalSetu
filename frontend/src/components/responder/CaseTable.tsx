import React, { useState } from 'react';
import { CaseModel, CaseStatus, RiskLevel } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Search, Filter, ChevronRight, MapPin, Clock, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CaseTableProps {
  cases: CaseModel[];
}

export const CaseTable: React.FC<CaseTableProps> = ({ cases }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.report.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'ALL') return true;
    if (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(activeFilter)) {
      return c.aiAnalysis.riskLevel === activeFilter;
    }
    return c.status === activeFilter;
  });

  const filterTabs = [
    { key: 'ALL', label: 'All Cases' },
    { key: 'CRITICAL', label: 'Critical Risk' },
    { key: 'HIGH', label: 'High Priority' },
    { key: 'NEW', label: 'New' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'RESOLVED', label: 'Resolved' }
  ];

  return (
    <div className="space-y-4">
      
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Case ID or Location..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-purple transition-all shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === tab.key
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Case ID</th>
                <th className="py-3.5 px-4">Transit Location</th>
                <th className="py-3.5 px-4">Incident Type</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4">Reported</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No matching cases found in response queue.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/responder/cases/${c.id}`)}
                    className="hover:bg-slate-100/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-purple group-hover:text-purple-700 dark:group-hover:text-purple-300">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white max-w-[200px] truncate">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{c.report.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <div className="flex flex-wrap gap-1">
                        {c.report.incidentTypes.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={c.aiAnalysis.riskLevel} score={c.aiAnalysis.riskScore} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span>{c.report.approxTime || 'Recent'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
