import { request } from './client';

export interface MapIncidentPoint {
  lat: number;
  lng: number;
  intensity: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  caseId: string;
  addressText: string;
  zone: string;
  status?: string;
  category?: string;
  description?: string;
  photoUrl?: string | null;
  createdAt?: string | number | null;
}

export interface MapFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    caseId: string;
    category: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: string;
    zone: string;
    addressText: string;
    markerColor: string;
    intensity: number;
    description: string;
    photoUrl?: string | null;
    createdAt?: string | number | null;
  };
}

export interface MapIncidentsResponse {
  type: 'FeatureCollection';
  features: MapFeature[];
  heatmapPoints: MapIncidentPoint[];
  count: number;
}

export interface ZoneHeatmapItem {
  zone: string;
  totalCases: number;
  highPriorityCases: number;
  intensity: number;
  center: {
    lat: number;
    lng: number;
  };
}

export interface HeatmapResponse {
  points: MapIncidentPoint[];
  zones: ZoneHeatmapItem[];
  totalPoints: number;
  totalZones: number;
}

export async function fetchMapIncidents(): Promise<MapIncidentsResponse> {
  return request<MapIncidentsResponse>('/api/map/incidents', {}, true);
}

export async function fetchHeatmapData(): Promise<HeatmapResponse> {
  return request<HeatmapResponse>('/api/map/heatmap', {}, true);
}
