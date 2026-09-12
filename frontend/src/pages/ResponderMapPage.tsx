import React from 'react';
import { useCases } from '../context/CaseContext';
import { MapView } from '../components/map/MapView';
import { Navigation, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResponderMapPage: React.FC = () => {
  const { cases } = useCases();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ivory-300 dark:border-charcoal-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-forest-700 dark:text-sage-300" />
            <h1 className="text-2xl font-extrabold text-charcoal-900 dark:text-ivory-100">Transit Incident Map & Heatmap</h1>
          </div>
          <p className="text-xs text-charcoal-600 dark:text-ivory-400">
            Real-time visual cluster view across railway stations, metro hubs, and bus terminals.
          </p>
        </div>

        <Link
          to="/responder"
          className="px-4 py-2 rounded-xl bg-ivory-200 hover:bg-ivory-300 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-charcoal-900 dark:text-ivory-100 border border-ivory-400 dark:border-charcoal-700 text-xs font-semibold transition-colors shadow-sm"
        >
          Return to Queue Table
        </Link>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-forest-900/10 dark:bg-sage-400/10 border border-forest-800/20 dark:border-sage-400/20 text-forest-900 dark:text-sage-200 text-xs flex items-center space-x-2">
        <Shield className="w-4 h-4 text-forest-700 dark:text-sage-400 flex-shrink-0" />
        <span>
          Responder Authorized Access Only. Individual children are never plotted publicly; locations represent general transit station nodes.
        </span>
      </div>

      {/* Interactive Map Component */}
      <MapView cases={cases} />

    </div>
  );
};
