import React from 'react';
import { useCases } from '../context/CaseContext';
import { MapView } from '../components/map/MapView';
import { Navigation, MapPin, Shield, Layers, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResponderMapPage: React.FC = () => {
  const { cases } = useCases();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-brand-purple" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Transit Incident Map & Heatmap</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Real-time visual cluster view across railway stations, metro hubs, and bus terminals.
          </p>
        </div>

        <Link
          to="/responder"
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 text-xs font-semibold transition-colors shadow-sm"
        >
          Return to Queue Table
        </Link>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-900 dark:text-purple-200 text-xs flex items-center space-x-2">
        <Shield className="w-4 h-4 text-brand-purple flex-shrink-0" />
        <span>
          Responder Authorized Access Only. Individual children are never plotted publicly; locations represent general transit station nodes.
        </span>
      </div>

      {/* Interactive Map Component */}
      <MapView cases={cases} />

    </div>
  );
};
