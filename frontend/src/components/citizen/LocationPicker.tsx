import React, { useState } from 'react';
import { LocationType } from '../../types';
import { MapPin, Navigation, Train, Bus, TrainTrack as Subway, Building2, Compass, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LocationPickerProps {
  location: string;
  locationType: LocationType;
  stationName?: string;
  onChangeLocation: (loc: string, type: LocationType, station?: string) => void;
}

const POPULAR_STATIONS = [
  { name: 'Mumbai Central Railway Station', type: 'RAILWAY_STATION' as LocationType },
  { name: 'Pune Swargate Bus Terminal', type: 'BUS_TERMINAL' as LocationType },
  { name: 'Nagpur Junction Station', type: 'RAILWAY_STATION' as LocationType },
  { name: 'Dadar Central Railway Station', type: 'RAILWAY_STATION' as LocationType },
  { name: 'New Delhi Railway Station (NDLS)', type: 'RAILWAY_STATION' as LocationType },
  { name: 'Kashmere Gate Metro Hub', type: 'METRO_STATION' as LocationType },
  { name: 'Howrah Junction Station', type: 'RAILWAY_STATION' as LocationType },
  { name: 'Thane Station Concourse', type: 'RAILWAY_STATION' as LocationType }
];

export const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  locationType,
  stationName,
  onChangeLocation
}) => {
  const { t } = useLanguage();
  const [locating, setLocating] = useState(false);

  const locationTypes: { type: LocationType; labelKey: string; icon: any }[] = [
    { type: 'RAILWAY_STATION', labelKey: 'locationTypeRailway', icon: Train },
    { type: 'BUS_TERMINAL', labelKey: 'locationTypeBus', icon: Bus },
    { type: 'METRO_STATION', labelKey: 'locationTypeMetro', icon: Subway },
    { type: 'TRANSIT_HUB', labelKey: 'locationTypeHub', icon: Building2 },
    { type: 'PUBLIC_PLACE', labelKey: 'locationTypePublic', icon: Compass },
    { type: 'OTHER', labelKey: 'locationTypeOther', icon: MapPin }
  ];

  const handleUseCurrentLocation = () => {
    setLocating(true);
    setTimeout(() => {
      setLocating(false);
      onChangeLocation('Mumbai Central Railway Station (Platform 4)', 'RAILWAY_STATION', 'Mumbai Central');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Select Location Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {locationTypes.map((item) => {
            const Icon = item.icon;
            const isSelected = locationType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => onChangeLocation(location, item.type, stationName)}
                className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                  isSelected
                    ? 'bg-brand-purple/20 border-brand-purple text-purple-900 dark:text-white font-semibold shadow-sm'
                    : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-purple' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="text-xs truncate">{t(item.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Station / Location Name
          </label>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="text-xs text-brand-purple hover:text-purple-700 dark:hover:text-purple-300 flex items-center space-x-1 font-semibold transition-colors"
          >
            <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Detecting Location...' : t('btnUseLocation')}</span>
          </button>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => onChangeLocation(e.target.value, locationType, e.target.value.split(' ')[0])}
            placeholder="e.g. Mumbai Central Railway Station, Platform 4"
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-purple transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">Popular High-Footfall Transit Hubs:</span>
        <div className="flex flex-wrap gap-2">
          {POPULAR_STATIONS.map((st) => (
            <button
              key={st.name}
              type="button"
              onClick={() => onChangeLocation(st.name, st.type, st.name.split(' ')[0])}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                location === st.name
                  ? 'bg-purple-500/20 text-purple-900 dark:text-purple-200 border-purple-500/50'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <span>Exact location coordinates are restricted to verified ground responders.</span>
      </div>
    </div>
  );
};
