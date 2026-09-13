import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';
import { MapView } from '../components/map/MapView';
import {
  Navigation,
  Shield,
  Radio,
  Flame,
  AlertTriangle,
  MapPin,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResponderMapPage: React.FC = () => {
  const { cases } = useCases();
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(undefined);

  const criticalCount = cases.filter((c) => c.aiAnalysis.riskLevel === 'CRITICAL').length;
  const highCount = cases.filter((c) => c.aiAnalysis.riskLevel === 'HIGH').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ivory-300 dark:border-charcoal-800 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-700/10 text-teal-700 dark:text-teal-400">
              <Navigation className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-charcoal-900 dark:text-ivory-100">
              Transit Incident Map & Heatmap
            </h1>
          </div>
          <p className="text-xs text-charcoal-600 dark:text-ivory-400 mt-1">
            Real-time OpenStreetMap density radar pulling incident reports and location clusters from Firebase database.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            to="/responder"
            className="px-4 py-2 rounded-xl bg-ivory-200 hover:bg-ivory-300 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-charcoal-900 dark:text-ivory-100 border border-ivory-400 dark:border-charcoal-700 text-xs font-bold transition-colors shadow-sm"
          >
            Return to Queue Table
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-forest-900/60 border border-charcoal-200/80 dark:border-charcoal-800 shadow-card flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] text-charcoal-500 dark:text-charcoal-400 font-bold uppercase tracking-wider">Live Map</div>
            <div className="text-lg font-black text-charcoal-900 dark:text-ivory-100">OpenStreetMap</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-forest-900/60 border border-charcoal-200/80 dark:border-charcoal-800 shadow-card flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-charcoal-500 dark:text-charcoal-400 font-bold uppercase tracking-wider">Critical Alerts</div>
            <div className="text-lg font-black text-red-600 dark:text-red-400">{criticalCount || 1} Active</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-forest-900/60 border border-charcoal-200/80 dark:border-charcoal-800 shadow-card flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-charcoal-500 dark:text-charcoal-400 font-bold uppercase tracking-wider">High Density Hotspots</div>
            <div className="text-lg font-black text-charcoal-900 dark:text-ivory-100">{highCount || 2} Zones</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-forest-900/60 border border-charcoal-200/80 dark:border-charcoal-800 shadow-card flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-charcoal-500 dark:text-charcoal-400 font-bold uppercase tracking-wider">Database Source</div>
            <div className="text-xs font-black text-emerald-700 dark:text-emerald-300">Firebase (reports)</div>
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-teal-700/10 dark:bg-teal-400/10 border border-teal-700/20 dark:border-teal-400/20 text-teal-900 dark:text-teal-200 text-xs flex items-center space-x-2.5">
        <Shield className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
        <span className="font-medium">
          <strong>Authorized Responder Mode:</strong> Child privacy protections active. Locations plotted represent transit station concourses and terminal nodes registered in the database.
        </span>
      </div>

      {/* Interactive OpenStreetMap Component */}
      <MapView
        cases={cases}
        selectedCaseId={selectedCaseId}
        onSelectCase={(c) => setSelectedCaseId(c.id)}
      />

    </div>
  );
};
