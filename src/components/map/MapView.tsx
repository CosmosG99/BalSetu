import React, { useState } from 'react';
import { CaseModel } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { MapPin, Navigation, Flame, Filter } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Link } from 'react-router-dom';

interface MapViewProps {
  cases: CaseModel[];
  onSelectCase?: (caseItem: CaseModel) => void;
  selectedCaseId?: string;
  interactive?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  cases,
  onSelectCase,
  selectedCaseId,
  interactive = true
}) => {
  const { isDark } = useTheme();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [activeCase, setActiveCase] = useState<CaseModel | null>(
    cases.find((c) => c.id === selectedCaseId) || cases[0] || null
  );

  const filteredCases = cases.filter((c) => {
    if (riskFilter === 'ALL') return true;
    return c.aiAnalysis.riskLevel === riskFilter;
  });

  const getMarkerPosition = (index: number, total: number, coords?: { lat: number; lng: number }) => {
    if (coords) {
      const x = Math.min(Math.max(((coords.lng - 72.0) / 16.0) * 100, 12), 88);
      const y = Math.min(Math.max((1.0 - (coords.lat - 12.0) / 18.0) * 100, 15), 85);
      return { left: `${x}%`, top: `${y}%` };
    }
    const cols = 5;
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      left: `${18 + col * 17}%`,
      top: `${22 + row * 20}%`
    };
  };

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col transition-colors duration-300">
      
      {/* Top Map Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        <div className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-2 shadow-lg">
          <Navigation className="w-4 h-4 text-brand-purple animate-pulse" />
          <span>Transit Hub Incident Radar</span>
          <span className="bg-brand-purple/20 text-purple-700 dark:text-purple-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-brand-purple/30">
            {filteredCases.length} Live Clusters
          </span>
        </div>

        <div className="pointer-events-auto flex items-center space-x-2">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md ${
              showHeatmap
                ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-glow-critical'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Incident Density</span>
          </button>

          <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-700 dark:text-slate-300 flex items-center space-x-1 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-white dark:bg-slate-900">All Risks</option>
              <option value="CRITICAL" className="bg-white dark:bg-slate-900">Critical Only</option>
              <option value="HIGH" className="bg-white dark:bg-slate-900">High Priority</option>
              <option value="MEDIUM" className="bg-white dark:bg-slate-900">Medium Risk</option>
              <option value="LOW" className="bg-white dark:bg-slate-900">Low Risk</option>
            </select>
          </div>
        </div>

      </div>

      {/* Map Visual Canvas */}
      <div className="relative w-full h-full bg-slate-100 dark:bg-[#0B0F19] overflow-hidden select-none transition-colors duration-300">
        
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <path d="M 50 50 Q 200 150 400 200 T 800 350" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="6 4" />
          <path d="M 100 450 Q 300 300 600 250 T 900 100" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="6 4" />
          <path d="M 200 50 Q 500 200 700 450" fill="none" stroke="#D946EF" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {showHeatmap && (
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-500">
            {filteredCases.map((c, idx) => {
              const pos = getMarkerPosition(idx, filteredCases.length, c.coordinates);
              const color =
                c.aiAnalysis.riskLevel === 'CRITICAL'
                  ? 'rgba(239, 68, 68, 0.45)'
                  : c.aiAnalysis.riskLevel === 'HIGH'
                  ? 'rgba(245, 158, 11, 0.4)'
                  : 'rgba(59, 130, 246, 0.3)';
              return (
                <div
                  key={`heat-${c.id}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl animate-pulse"
                  style={{
                    left: pos.left,
                    top: pos.top,
                    width: '160px',
                    height: '160px',
                    backgroundColor: color
                  }}
                />
              );
            })}
          </div>
        )}

        {filteredCases.map((c, idx) => {
          const pos = getMarkerPosition(idx, filteredCases.length, c.coordinates);
          const isSelected = activeCase?.id === c.id;
          const isCritical = c.aiAnalysis.riskLevel === 'CRITICAL';
          const isHigh = c.aiAnalysis.riskLevel === 'HIGH';

          const markerBg = isCritical
            ? 'bg-red-500 text-white shadow-glow-critical'
            : isHigh
            ? 'bg-amber-500 text-slate-950'
            : 'bg-brand-purple text-white';

          return (
            <div
              key={c.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
              style={{ left: pos.left, top: pos.top }}
              onClick={() => {
                setActiveCase(c);
                if (onSelectCase) onSelectCase(c);
              }}
            >
              {(isCritical || isHigh) && (
                <span className="absolute -inset-2 rounded-full animate-ping bg-red-500/40 opacity-75 pointer-events-none" />
              )}

              <div
                className={`relative p-2.5 rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-125 border-2 border-white/40 ${markerBg} ${
                  isSelected ? 'scale-125 ring-4 ring-purple-500/40' : ''
                }`}
              >
                <MapPin className="w-5 h-5" />
              </div>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-white/90 dark:bg-slate-900/90 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 pointer-events-none shadow-md">
                {c.report.stationName || c.report.location.split(' ')[0]}
              </div>
            </div>
          );
        })}

        {activeCase && (
          <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full glass-panel p-4 rounded-2xl space-y-3 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-300">{activeCase.id}</span>
                <RiskBadge level={activeCase.aiAnalysis.riskLevel} score={activeCase.aiAnalysis.riskScore} size="sm" />
              </div>
              <StatusBadge status={activeCase.status} size="sm" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{activeCase.report.location}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">{activeCase.report.description}</p>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>Reported: {activeCase.report.approxTime || 'Recently'}</span>
              <span className="text-brand-purple font-medium">{activeCase.report.reporterRole || 'Anonymous'}</span>
            </div>

            <div className="pt-1 flex items-center space-x-2">
              <Link
                to={`/responder/cases/${activeCase.id}`}
                className="w-full py-2 px-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold text-xs rounded-xl text-center shadow-sm transition-all"
              >
                Inspect Case Details & Actions
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
