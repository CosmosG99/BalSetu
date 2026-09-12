import React, { useState } from 'react';
import { CaseModel } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Search, ChevronRight, MapPin, Clock } from 'lucide-react';
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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Case ID or Location..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 rounded-xl text-xs text-charcoal-800 dark:text-ivory-100 placeholder-charcoal-400 focus:outline-none focus:border-forest-900 shadow-sm transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === tab.key
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-ivory-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Container matching Reference Blueprint */}
      <div className="natural-panel overflow-hidden shadow-modal">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700 dark:text-charcoal-300">
            <thead className="bg-ivory-100/90 dark:bg-charcoal-950 border-b border-charcoal-200/80 dark:border-charcoal-800 text-charcoal-600 dark:text-charcoal-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Case ID</th>
                <th className="py-3.5 px-4">Concern / Incident</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Assigned Responder</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-200/80 dark:divide-charcoal-800/80">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-charcoal-500">
                    No matching cases found in response queue.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/responder/cases/${c.id}`)}
                    className="hover:bg-ivory-100/80 dark:hover:bg-charcoal-850 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <RiskBadge level={c.aiAnalysis.riskLevel} score={c.aiAnalysis.riskScore} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-forest-900 dark:text-sage-300">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-charcoal-800 dark:text-ivory-100">
                      {c.report.incidentTypes.join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-charcoal-700 dark:text-charcoal-300 max-w-[180px] truncate">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-forest-900 dark:text-sage-400 flex-shrink-0" />
                        <span className="truncate">{c.report.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-500 font-mono">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-charcoal-400" />
                        <span>{c.report.approxTime || '12 min ago'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-charcoal-800 dark:text-ivory-100">
                      {c.assignedResponder || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-3 py-1 rounded-lg bg-forest-900/10 dark:bg-forest-800/30 text-forest-900 dark:text-sage-300 font-bold hover:bg-forest-900 hover:text-white transition-all inline-flex items-center space-x-1 text-[11px]">
                        <span>Open</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
