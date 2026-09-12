import React, { useEffect, useRef, useState } from 'react';
import { LocationType } from '../../types';
import { MapPin, Navigation, Train, Bus, TrainTrack as Subway, Building2, Compass, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LocationPickerProps {
  location: string;
  locationType: LocationType;
  stationName?: string;
  onChangeLocation: (loc: string, type: LocationType, station?: string, coordinates?: { lat: number; lng: number }) => void;
}

interface OSMSuggestion {
  place_id: number;
  display_name: string;
  lat?: string;
  lon?: string;
}

const POPULAR_STATIONS = [
  { name: 'Mumbai Central Railway Station', type: 'RAILWAY_STATION' as LocationType }, { name: 'Pune Swargate Bus Terminal', type: 'BUS_TERMINAL' as LocationType },
  { name: 'Nagpur Junction Station', type: 'RAILWAY_STATION' as LocationType }, { name: 'Dadar Central Railway Station', type: 'RAILWAY_STATION' as LocationType },
  { name: 'New Delhi Railway Station (NDLS)', type: 'RAILWAY_STATION' as LocationType }, { name: 'Kashmere Gate Metro Hub', type: 'METRO_STATION' as LocationType },
  { name: 'Howrah Junction Station', type: 'RAILWAY_STATION' as LocationType }, { name: 'Thane Station Concourse', type: 'RAILWAY_STATION' as LocationType }
];

function useOsmSuggestions(location: string) {
  const [suggestions, setSuggestions] = useState<OSMSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (location.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const query = encodeURIComponent(location.trim());
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=in&addressdetails=1&q=${query}`;
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept-Language': 'en'
          }
        });
        if (!response.ok) {
          throw new Error(`Nominatim request failed: ${response.status}`);
        }
        const data = await response.json();
        setSuggestions((data || []) as OSMSuggestion[]);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [location]);

  return { suggestions, isSearching };
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ location, locationType, stationName, onChangeLocation }) => {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [locating, setLocating] = useState(false);
  const { suggestions, isSearching } = useOsmSuggestions(location);
  const locationTypes: { type: LocationType; labelKey: string; icon: any }[] = [
    { type: 'RAILWAY_STATION', labelKey: 'locationTypeRailway', icon: Train }, { type: 'BUS_TERMINAL', labelKey: 'locationTypeBus', icon: Bus }, { type: 'METRO_STATION', labelKey: 'locationTypeMetro', icon: Subway },
    { type: 'TRANSIT_HUB', labelKey: 'locationTypeHub', icon: Building2 }, { type: 'PUBLIC_PLACE', labelKey: 'locationTypePublic', icon: Compass }, { type: 'OTHER', labelKey: 'locationTypeOther', icon: MapPin }
  ];

  const handleSuggestionSelect = (suggestion: OSMSuggestion) => {
    const lat = Number(suggestion.lat);
    const lng = Number(suggestion.lon);
    onChangeLocation(
      suggestion.display_name,
      locationType,
      suggestion.display_name,
      Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : undefined
    );
    setTimeout(() => {
      inputRef.current?.blur();
    }, 0);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const coordinates = { lat: position.coords.latitude, lng: position.coords.longitude };
      onChangeLocation(`Current location (${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)})`, locationType, 'Current location', coordinates); setLocating(false);
    }, () => setLocating(false), { enableHighAccuracy: true, timeout: 10000 });
  };

  return <div className="space-y-4 sm:space-y-6">
    <div className="space-y-2"><label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Select Location Type</label><div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">{locationTypes.map((item) => { const Icon = item.icon; const selected = locationType === item.type; return <button key={item.type} type="button" onClick={() => onChangeLocation(location, item.type, stationName)} className={`p-2.5 sm:p-3 rounded-xl border text-left flex items-center space-x-2.5 min-h-[44px] ${selected ? 'bg-brand-purple/20 border-brand-purple text-purple-900 dark:text-white font-semibold' : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}><Icon className="w-4 h-4" /><span className="text-xs truncate">{t(item.labelKey)}</span></button>; })}</div></div>
    <div className="space-y-2"><div className="flex items-center justify-between gap-2"><label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Station / Location Name</label><button type="button" onClick={useCurrentLocation} disabled={locating} className="text-[11px] text-brand-purple flex items-center space-x-1 font-semibold shrink-0"><Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} /><span>{locating ? 'Detecting…' : t('btnUseLocation')}</span></button></div><div className="relative"><MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input ref={inputRef} type="text" value={location} onChange={(event) => onChangeLocation(event.target.value, locationType, event.target.value)} placeholder="Search for a station, landmark, or address" className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl text-sm min-h-[46px]" /></div>{suggestions.length > 0 && <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden">{suggestions.map((suggestion) => <button key={suggestion.place_id} type="button" onClick={() => handleSuggestionSelect(suggestion)} className="w-full text-left px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/80">{suggestion.display_name}</button>)}</div>}{isSearching && <p className="text-[11px] text-slate-500">Searching locations…</p>}</div>
    <div className="space-y-2"><span className="text-xs text-slate-500">Popular High-Footfall Transit Hubs:</span><div className="flex flex-wrap gap-2">{POPULAR_STATIONS.map((st) => <button key={st.name} type="button" onClick={() => onChangeLocation(st.name, st.type, st.name)} className="px-2.5 py-1.5 rounded-lg border text-[11px] font-medium bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 min-h-[36px]">{st.name}</button>)}</div></div>
    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /><span>Exact location coordinates are restricted to verified ground responders.</span></div>
  </div>;
};
