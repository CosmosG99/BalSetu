import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { CaseModel, RiskLevel } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { fetchMapIncidents, MapIncidentPoint } from '../../api/map';
import {
  Navigation,
  Flame,
  MapPin,
  Layers,
  Filter,
  RefreshCw,
  Crosshair,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  Database,
  Radio
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Link } from 'react-router-dom';

interface MapViewProps {
  cases: CaseModel[];
  onSelectCase?: (caseItem: CaseModel) => void;
  selectedCaseId?: string;
  interactive?: boolean;
}

interface UnifiedIncident {
  id: string;
  lat: number;
  lng: number;
  intensity: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  addressText: string;
  zone: string;
  status: string;
  category: string;
  description: string;
  photoUrl?: string | null;
  approxTime?: string;
  rawCase?: CaseModel;
}

// Fallback demo points including PCCE (from Firebase document screenshot)
const DEFAULT_DEMO_INCIDENTS: UnifiedIncident[] = [
  {
    id: 'RAK-PCCE-01',
    lat: 18.9696,
    lng: 72.8193,
    intensity: 0.85,
    priority: 'HIGH',
    addressText: 'pcce',
    zone: 'pcce',
    status: 'NEW',
    category: 'lost_child',
    description: 'Minor reported unattended near PCCE transit concourse.',
    approxTime: 'Recently'
  },
  {
    id: 'RAK-MUM-02',
    lat: 18.9712,
    lng: 72.8220,
    intensity: 0.95,
    priority: 'CRITICAL',
    addressText: 'Platform 4, Mumbai Central Station',
    zone: 'Mumbai Central',
    status: 'ROUTED',
    category: 'distressed_child',
    description: 'Child visually distressed near active railway track platform.',
    approxTime: '15m ago'
  },
  {
    id: 'RAK-DAD-03',
    lat: 19.0178,
    lng: 72.8478,
    intensity: 0.6,
    priority: 'MEDIUM',
    addressText: 'Dadar Central Station, East Exit Parking',
    zone: 'Dadar Central',
    status: 'ASSIGNED',
    category: 'unaccompanied_child',
    description: 'Group of unaccompanied minors at auto stand exit.',
    approxTime: '45m ago'
  },
  {
    id: 'RAK-PUN-04',
    lat: 18.5018,
    lng: 73.8586,
    intensity: 0.7,
    priority: 'HIGH',
    addressText: 'Swargate Bus Terminal, Pune, Bay No. 3',
    zone: 'Pune Swargate',
    status: 'UNDER_REVIEW',
    category: 'lost_child',
    description: 'Young girl searching for guardian near departure gate.',
    approxTime: '1h ago'
  },
  {
    id: 'RAK-THA-05',
    lat: 19.2183,
    lng: 72.9781,
    intensity: 0.4,
    priority: 'LOW',
    addressText: 'Thane Railway Station Concourse',
    zone: 'Thane',
    status: 'RESOLVED',
    category: 'other',
    description: 'Reported unattended backpack and unaccompanied child.',
    approxTime: '2h ago'
  }
];

export const MapView: React.FC<MapViewProps> = ({
  cases,
  onSelectCase,
  selectedCaseId,
  interactive = true
}) => {
  const { isDark } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [layerMode, setLayerMode] = useState<'hybrid' | 'heatmap' | 'markers'>('hybrid');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [apiIncidents, setApiIncidents] = useState<UnifiedIncident[]>([]);
  const [dataSource, setDataSource] = useState<'api' | 'props' | 'demo'>('api');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeIncident, setActiveIncident] = useState<UnifiedIncident | null>(null);

  // 1. Fetch incidents from backend API (which pulls from Firebase Firestore `reports` collection)
  const loadIncidentsFromBackend = async () => {
    setIsLoading(true);
    try {
      const res = await fetchMapIncidents();
      if (res && res.features && res.features.length > 0) {
        const parsed: UnifiedIncident[] = res.features.map((f) => {
          const rawPriority = (f.properties.priority || 'medium').toUpperCase();
          const priority = (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(rawPriority)
            ? rawPriority
            : 'MEDIUM') as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

          return {
            id: f.properties.caseId,
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
            intensity: f.properties.intensity || 0.5,
            priority,
            addressText: f.properties.addressText || 'Transit Hub',
            zone: f.properties.zone || 'General Zone',
            status: f.properties.status || 'NEW',
            category: f.properties.category || 'Incident',
            description: f.properties.description || '',
            photoUrl: f.properties.photoUrl,
            approxTime: f.properties.createdAt ? new Date(f.properties.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
          };
        });

        setApiIncidents(parsed);
        setDataSource('api');
      } else {
        setDataSource(cases.length > 0 ? 'props' : 'demo');
      }
    } catch {
      // Backend not running or token unauthorized; gracefully fallback to props/demo
      setDataSource(cases.length > 0 ? 'props' : 'demo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (interactive) {
      void loadIncidentsFromBackend();
    }
  }, [interactive]);

  // 2. Unify incidents from props (CaseContext) + backend API + demo fallbacks
  const unifiedIncidents: UnifiedIncident[] = useMemo(() => {
    const list: UnifiedIncident[] = [];
    const seenIds = new Set<string>();

    // Backend incidents first (fresh from Firebase Firestore)
    for (const item of apiIncidents) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        list.push(item);
      }
    }

    // Incidents passed in props (e.g. newly submitted in current session)
    for (const c of cases) {
      if (!seenIds.has(c.id)) {
        seenIds.add(c.id);
        const lat = c.coordinates?.lat;
        const lng = c.coordinates?.lng;
        if (typeof lat === 'number' && typeof lng === 'number') {
          const priority = (c.aiAnalysis.riskLevel || 'MEDIUM').toUpperCase() as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
          const weight = priority === 'CRITICAL' ? 1.0 : priority === 'HIGH' ? 0.8 : priority === 'MEDIUM' ? 0.5 : 0.25;

          list.push({
            id: c.id,
            lat,
            lng,
            intensity: weight,
            priority,
            addressText: c.report.location || 'Transit Hub',
            zone: c.report.stationName || c.report.location,
            status: c.status,
            category: c.report.incidentTypes?.[0] || 'LOST',
            description: c.report.description,
            photoUrl: c.report.photoUrl,
            approxTime: c.report.approxTime,
            rawCase: c
          });
        }
      }
    }

    // If still empty (e.g. brand new db with 0 records), seed with PCCE & transit demo nodes
    if (list.length === 0) {
      return DEFAULT_DEMO_INCIDENTS;
    }

    return list;
  }, [apiIncidents, cases]);

  // Filtered by risk level
  const filteredIncidents = useMemo(() => {
    if (riskFilter === 'ALL') return unifiedIncidents;
    return unifiedIncidents.filter((inc) => inc.priority === riskFilter);
  }, [unifiedIncidents, riskFilter]);

  // Set active incident if selectedCaseId changes
  useEffect(() => {
    if (selectedCaseId) {
      const found = unifiedIncidents.find((i) => i.id === selectedCaseId);
      if (found) setActiveIncident(found);
    } else if (!activeIncident && unifiedIncidents.length > 0) {
      setActiveIncident(unifiedIncidents[0]);
    }
  }, [selectedCaseId, unifiedIncidents, activeIncident]);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = [18.9696, 72.8193]; // PCCE / Mumbai Central default
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // Layer group for markers
      const markerGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markerGroup;

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Handle Tile Layer based on Dark / Light theme
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // OpenStreetMap & Carto tiles
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tileSubdomains = isDark ? 'abcd' : 'abc';

    const newTileLayer = L.tileLayer(tileUrl, {
      subdomains: tileSubdomains,
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    tileLayerRef.current = newTileLayer;

    // Small delay to ensure container dimension calculation is accurate
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => clearTimeout(timeout);
  }, [isDark]);

  // 4. Update Heatmap & Markers Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // --- Heatmap Layer Update ---
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if ((layerMode === 'heatmap' || layerMode === 'hybrid') && filteredIncidents.length > 0) {
      const heatPoints: [number, number, number][] = filteredIncidents.map((inc) => [
        inc.lat,
        inc.lng,
        inc.intensity
      ]);

      const heat = L.heatLayer(heatPoints, {
        radius: 32,
        blur: 22,
        maxZoom: 17,
        max: 1.0,
        minOpacity: 0.35,
        gradient: {
          0.2: '#0d9488', // teal
          0.4: '#3b82f6', // blue
          0.6: '#eab308', // amber
          0.8: '#f97316', // orange
          1.0: '#ef4444'  // red (critical)
        }
      });

      heat.addTo(map);
      heatLayerRef.current = heat;
    }

    // --- Markers Layer Update ---
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }

    if (layerMode === 'markers' || layerMode === 'hybrid') {
      const markerGroup = markersLayerRef.current;

      filteredIncidents.forEach((inc) => {
        const isCritical = inc.priority === 'CRITICAL';
        const isHigh = inc.priority === 'HIGH';
        const isSelected = activeIncident?.id === inc.id;

        const colorBg = isCritical
          ? 'background: #ef4444;'
          : isHigh
          ? 'background: #f97316;'
          : inc.priority === 'MEDIUM'
          ? 'background: #eab308;'
          : 'background: #0f766e;';

        const pulseHtml = (isCritical || isHigh)
          ? `<div class="pulse-marker-ring" style="background-color: ${isCritical ? 'rgba(239, 68, 68, 0.4)' : 'rgba(249, 115, 22, 0.4)'}"></div>`
          : '';

        const markerHtml = `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            ${pulseHtml}
            <div style="position: relative; width: 28px; height: 28px; border-radius: 9999px; ${colorBg} color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.3); border: 2px solid white; transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'}; transition: transform 0.2s;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div style="position: absolute; top: 32px; white-space: nowrap; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; background: ${isDark ? 'rgba(15,30,26,0.92)' : 'rgba(255,255,255,0.95)'}; color: ${isDark ? '#f5f7f6' : '#1e293b'}; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 2px 6px rgba(0,0,0,0.12); pointer-events: none;">
              ${inc.addressText || inc.zone}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-leaflet-marker',
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const marker = L.marker([inc.lat, inc.lng], { icon: customIcon });

        // Popup content
        const popupContent = `
          <div style="padding: 6px; font-family: inherit; max-width: 240px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #0d9488;">${inc.id}</span>
              <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; ${colorBg} color: white;">${inc.priority}</span>
            </div>
            <h4 style="font-size: 12px; font-weight: 700; margin: 0 0 4px 0; color: ${isDark ? '#fff' : '#0f172a'};">${inc.addressText}</h4>
            <p style="font-size: 11px; margin: 0 0 8px 0; color: ${isDark ? '#cbd5e1' : '#64748b'}; line-height: 1.3;">${inc.description || 'Incident in transit zone.'}</p>
            <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">
              Zone: <b>${inc.zone}</b> | ${inc.approxTime || 'Active'}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          setActiveIncident(inc);
          if (onSelectCase && inc.rawCase) {
            onSelectCase(inc.rawCase);
          }
        });

        markerGroup?.addLayer(marker);
      });
    }

    // Auto-fit bounds if we have points and interactive mode is on
    if (interactive && filteredIncidents.length > 0) {
      const bounds = L.latLngBounds(filteredIncidents.map((i) => [i.lat, i.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [filteredIncidents, layerMode, isDark, activeIncident, interactive, onSelectCase]);

  // Fit bounds helper
  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    if (map && filteredIncidents.length > 0) {
      const bounds = L.latLngBounds(filteredIncidents.map((i) => [i.lat, i.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  };

  return (
    <div className="relative w-full h-[580px] rounded-3xl overflow-hidden bg-ivory-100 dark:bg-forest-950 border border-charcoal-200 dark:border-charcoal-800 shadow-modal flex flex-col transition-colors duration-300">
      
      {/* Top Floating Glassmorphism Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Live Radar & Firebase Status Badge */}
        <div className="pointer-events-auto bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-charcoal-200/80 dark:border-charcoal-700/80 text-xs font-semibold text-charcoal-800 dark:text-charcoal-100 flex items-center space-x-2.5 shadow-subtle">
          <div className="relative flex items-center justify-center">
            <Radio className="w-4 h-4 text-accentCyan animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          </div>
          <span className="font-bold tracking-tight">OpenStreetMap Radar</span>

          <span className="bg-teal-700/10 text-teal-700 dark:text-teal-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-teal-700/20 flex items-center space-x-1">
            <span>{filteredIncidents.length} Incidents</span>
          </span>

          {/* Firebase connection source indicator */}
          <div className="hidden sm:flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
            <Database className="w-3 h-3" />
            <span>Firebase (reports)</span>
          </div>
        </div>

        {/* Action Controls: Layer Mode, Risk Filter, Refresh, Zoom */}
        {interactive && (
          <div className="pointer-events-auto flex items-center space-x-2">
            
            {/* Heatmap vs Markers vs Hybrid Toggle */}
            <div className="bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md border border-charcoal-200/80 dark:border-charcoal-700/80 rounded-2xl p-1 flex items-center space-x-1 shadow-xs">
              <button
                onClick={() => setLayerMode('hybrid')}
                title="Hybrid: Show both Heatmap & Markers"
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                  layerMode === 'hybrid'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-charcoal-600 dark:text-charcoal-300 hover:text-teal-700 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Hybrid</span>
              </button>

              <button
                onClick={() => setLayerMode('heatmap')}
                title="Heatmap Density Only"
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                  layerMode === 'heatmap'
                    ? 'bg-accentCoral text-white shadow-sm'
                    : 'text-charcoal-600 dark:text-charcoal-300 hover:text-accentCoral'
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>Heatmap</span>
              </button>

              <button
                onClick={() => setLayerMode('markers')}
                title="Incident Markers Only"
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                  layerMode === 'markers'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-charcoal-600 dark:text-charcoal-300 hover:text-blue-500'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>Pins</span>
              </button>
            </div>

            {/* Risk Filter Select */}
            <div className="bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md border border-charcoal-200/80 dark:border-charcoal-700/80 rounded-2xl px-2.5 py-1 text-xs text-charcoal-700 dark:text-charcoal-300 flex items-center space-x-1.5 shadow-xs">
              <Filter className="w-3.5 h-3.5 text-charcoal-400" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-transparent text-charcoal-800 dark:text-charcoal-100 font-bold focus:outline-none cursor-pointer pr-1 text-xs"
              >
                <option value="ALL" className="bg-white dark:bg-charcoal-900">All Risks</option>
                <option value="CRITICAL" className="bg-white dark:bg-charcoal-900">Critical Only</option>
                <option value="HIGH" className="bg-white dark:bg-charcoal-900">High Priority</option>
                <option value="MEDIUM" className="bg-white dark:bg-charcoal-900">Medium Risk</option>
                <option value="LOW" className="bg-white dark:bg-charcoal-900">Low Risk</option>
              </select>
            </div>

            {/* Center / Fit Bounds Button */}
            <button
              onClick={handleFitBounds}
              title="Fit View to All Incidents"
              className="p-2 rounded-2xl bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md border border-charcoal-200/80 dark:border-charcoal-700/80 text-charcoal-700 dark:text-charcoal-300 hover:text-teal-700 dark:hover:text-teal-400 shadow-xs transition-colors"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>

            {/* Refresh from Firebase Button */}
            <button
              onClick={() => void loadIncidentsFromBackend()}
              disabled={isLoading}
              title="Pull latest from Firebase"
              className="p-2 rounded-2xl bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md border border-charcoal-200/80 dark:border-charcoal-700/80 text-charcoal-700 dark:text-charcoal-300 hover:text-teal-700 dark:hover:text-teal-400 shadow-xs transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
            </button>

          </div>
        )}

      </div>

      {/* Real OpenStreetMap Leaflet Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full z-10"
        style={{ minHeight: '100%' }}
      />

      {/* Heatmap Legend */}
      {interactive && (layerMode === 'heatmap' || layerMode === 'hybrid') && (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-charcoal-200/80 dark:border-charcoal-700/80 shadow-card text-[11px] space-y-1">
          <div className="font-extrabold text-charcoal-800 dark:text-ivory-100 flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-accentCoral" />
            <span>Heatmap Density</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-charcoal-500 font-semibold">Low</span>
            <div className="w-24 h-2 rounded-full bg-gradient-to-r from-[#0d9488] via-[#3b82f6] via-[#eab308] via-[#f97316] to-[#ef4444]" />
            <span className="text-[10px] text-charcoal-500 font-semibold">Critical</span>
          </div>
        </div>
      )}

      {/* Active Incident Inspection Card */}
      {interactive && activeIncident && (
        <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-lg p-4 rounded-3xl space-y-2.5 shadow-modal animate-fade-in border border-charcoal-200/80 dark:border-charcoal-700/80">
          <div className="flex items-center justify-between border-b border-charcoal-200/80 dark:border-charcoal-700/80 pb-2">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-black text-teal-700 dark:text-teal-400">{activeIncident.id}</span>
              <RiskBadge
                level={activeIncident.priority as RiskLevel}
                score={activeIncident.priority === 'CRITICAL' ? 95 : activeIncident.priority === 'HIGH' ? 82 : activeIncident.priority === 'MEDIUM' ? 55 : 25}
                size="sm"
              />
            </div>
            <StatusBadge status={activeIncident.status as any} size="sm" />
          </div>

          <div>
            <div className="flex items-center space-x-1.5 text-charcoal-800 dark:text-charcoal-100 font-bold text-sm">
              <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <h4 className="line-clamp-1">{activeIncident.addressText}</h4>
            </div>
            <p className="text-xs text-charcoal-600 dark:text-charcoal-300 line-clamp-2 mt-1">
              {activeIncident.description || 'Unaccompanied minor detected in transit terminal zone.'}
            </p>
          </div>

          <div className="text-[11px] text-charcoal-500 flex items-center justify-between pt-0.5 font-medium">
            <span>Zone: <strong className="text-charcoal-700 dark:text-charcoal-200">{activeIncident.zone}</strong></span>
            <span>Coordinates: <code className="text-[10px] bg-charcoal-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">{activeIncident.lat.toFixed(4)}, {activeIncident.lng.toFixed(4)}</code></span>
          </div>

          <div className="pt-1">
            <Link
              to={`/responder/cases/${activeIncident.id}`}
              className="w-full py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl text-center shadow-subtle transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Inspect Case Details & Actions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
