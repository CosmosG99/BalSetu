import { CaseModel, CaseStatus, IncidentType, ReportInput, RiskLevel, TimelineEvent } from '../types';
import { request } from './client';

type ApiTimestamp = { seconds?: number; _seconds?: number; toDate?: () => Date } | string | number | null | undefined;
type ApiCase = any;

const stationCoordinates: Record<string, { lat: number; lng: number; zone: string }> = {
  'mumbai central': { lat: 18.9696, lng: 72.8193, zone: 'Mumbai Central' },
  'pune swargate': { lat: 18.5018, lng: 73.8586, zone: 'Pune Swargate' },
  'swargate terminal': { lat: 18.5018, lng: 73.8586, zone: 'Pune Swargate' },
  'dadar central': { lat: 19.0178, lng: 72.8478, zone: 'Dadar Central' },
  'nagpur junction': { lat: 21.1458, lng: 79.0882, zone: 'Nagpur Junction' }
};

const categoryToType: Record<string, IncidentType> = {
  lost_child: 'LOST',
  unaccompanied_child: 'UNACCOMPANIED',
  trafficking_concern: 'TRAFFICKING',
  abuse_concern: 'ABUSE',
  other: 'OTHER'
};

const typeToCategory: Record<IncidentType, string> = {
  LOST: 'lost_child', DISTRESSED: 'lost_child', UNACCOMPANIED: 'unaccompanied_child',
  TRAFFICKING: 'trafficking_concern', ABUSE: 'abuse_concern', BULLYING: 'other', OTHER: 'other'
};

const statusToUi: Record<string, CaseStatus> = {
  new: 'NEW', under_review: 'UNDER_REVIEW', assigned: 'ASSIGNED', escalated: 'INTERVENTION', resolved: 'RESOLVED', closed: 'RESOLVED'
};
const statusToApi: Partial<Record<CaseStatus, string>> = {
  NEW: 'new', UNDER_REVIEW: 'under_review', ASSIGNED: 'assigned', INTERVENTION: 'escalated', RESOLVED: 'resolved', TRIAGED: 'under_review', ROUTED: 'assigned'
};

function iso(value: ApiTimestamp): string {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return new Date(value).toISOString();
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  const seconds = value.seconds ?? value._seconds;
  return typeof seconds === 'number' ? new Date(seconds * 1000).toISOString() : new Date().toISOString();
}

function displayTime(value: ApiTimestamp) {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(iso(value)));
}

export function formatRelativeTime(value: ApiTimestamp): string {
  if (!value) return 'Recently';
  const isoStr = iso(value);
  const dateMs = new Date(isoStr).getTime();
  if (isNaN(dateMs)) return 'Recently';

  const diffMs = Date.now() - dateMs;
  if (diffMs < 0 || diffMs < 60000) return 'Just now';
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateMs));
}

function priorityToRisk(priority?: string): RiskLevel {
  return ({ critical: 'CRITICAL', high: 'HIGH', medium: 'MEDIUM', low: 'LOW' } as Record<string, RiskLevel>)[priority || ''] || 'MEDIUM';
}

function riskScore(priority?: string) {
  return ({ critical: 95, high: 78, medium: 55, low: 25 } as Record<string, number>)[priority || ''] || 50;
}

function timelineFromApi(timeline: any[] = []): TimelineEvent[] {
  return timeline.map((entry, index) => ({
    id: `${index}-${iso(entry.at)}`,
    title: String(entry.status || 'update').replace(/_/g, ' '),
    timestamp: displayTime(entry.at),
    description: entry.note || 'Case updated.',
    actor: entry.actorId ? 'Authorized responder' : 'System',
    completed: true
  }));
}

export function caseFromApi(data: ApiCase): CaseModel {
  const triage = data.aiTriage || {};
  const riskLevel = priorityToRisk(data.priority || triage.priority);
  const location = data.location || {};
  const approxTime = data.approxTime || formatRelativeTime(data.createdAt);

  return {
    id: data.id,
    report: {
      incidentTypes: [categoryToType[data.category] || 'OTHER'],
      location: location.addressText || location.zone || 'Location withheld',
      locationType: 'TRANSIT_HUB',
      stationName: location.zone,
      description: data.description || '',
      photoUrl: data.photoUrl || undefined,
      isBlurred: true,
      isAnonymous: data.anonymous !== false,
      approxTime
    },
    aiAnalysis: {
      riskScore: riskScore(data.priority || triage.priority),
      riskLevel,
      categories: [triage.classification || data.category || 'Incident report'],
      indicators: triage.riskIndicators || [],
      recommendation: triage.recommendedAction || 'Human verification is required.',
      explanations: triage.riskIndicators || []
    },
    status: statusToUi[data.status] || 'NEW',
    createdAt: iso(data.createdAt),
    updatedAt: iso(data.updatedAt),
    assignedResponder: data.assignedResponderId || undefined,
    timeline: timelineFromApi(data.timeline),
    auditLogs: timelineFromApi(data.timeline).map((event) => ({ id: `audit-${event.id}`, timestamp: event.timestamp, action: event.title.toUpperCase(), performer: event.actor, details: event.description })),
    routing: data.assignedResponderId ? [{ organization: 'Assigned response network', category: 'RAILWAY', priority: riskLevel === 'CRITICAL' ? 'CRITICAL' : riskLevel === 'HIGH' ? 'HIGH' : 'MEDIUM', status: 'ACCEPTED' }] : [],
    coordinates: typeof location.lat === 'number' && typeof location.lng === 'number' ? { lat: location.lat, lng: location.lng } : undefined
  };
}

function locationFromReport(report: ReportInput) {
  const normalized = `${report.stationName || ''} ${report.location}`.toLowerCase();
  const found = Object.entries(stationCoordinates).find(([name]) => normalized.includes(name))?.[1];
  return {
    lat: report.coordinates?.lat ?? found?.lat ?? 18.9696,
    lng: report.coordinates?.lng ?? found?.lng ?? 72.8193,
    addressText: report.location,
    zone: found?.zone ?? report.stationName ?? report.location
  };
}

export async function listCases() {
  const response = await request<{ cases: ApiCase[] }>('/api/cases', {}, true);
  return response.cases.map(caseFromApi);
}

export async function getCase(id: string) {
  return caseFromApi(await request<ApiCase>(`/api/cases/${encodeURIComponent(id)}`, {}, true));
}

export async function createReport(report: ReportInput) {
  const category = report.incidentTypes.map(type => typeToCategory[type]).find(Boolean) || 'other';
  const clientReportId = crypto.randomUUID?.() || `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const response = await request<{ caseId: string; report: ApiCase }>('/api/reports', {
    method: 'POST',
    body: JSON.stringify({ category, description: report.description, location: locationFromReport(report), anonymous: report.isAnonymous, clientReportId, language: 'en', source: 'web' })
  });
  return caseFromApi(response.report);
}

export async function previewTriage(report: ReportInput) {
  const category = report.incidentTypes.map(type => typeToCategory[type]).find(Boolean) || 'other';
  const clientReportId = crypto.randomUUID?.() || `preview-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const response = await request<{ triage: any }>('/api/reports/triage-preview', {
    method: 'POST', body: JSON.stringify({ category, description: report.description, location: locationFromReport(report), anonymous: report.isAnonymous, clientReportId, language: 'en', source: 'web' })
  });
  const triage = response.triage;
  const riskLevel = priorityToRisk(triage.priority);
  return { riskScore: riskScore(triage.priority), riskLevel, categories: [triage.classification || category], indicators: triage.riskIndicators || [], recommendation: triage.recommendedAction || 'Human verification is required.', explanations: triage.riskIndicators || [] };
}

export async function updateCase(id: string, status?: CaseStatus, internalNote?: string) {
  const apiStatus = status ? statusToApi[status] : undefined;
  const response = await request<{ case: ApiCase }>(`/api/cases/${encodeURIComponent(id)}`, {
    method: 'PATCH', body: JSON.stringify({ ...(apiStatus ? { status: apiStatus } : {}), ...(internalNote ? { internalNote } : {}) })
  }, true);
  return caseFromApi(response.case);
}

export async function trackCase(id: string) {
  return request<{ caseId: string; status: string; category: string; timelinePublic: any[]; createdAt: ApiTimestamp; updatedAt: ApiTimestamp }>(`/api/track/${encodeURIComponent(id)}`);
}

export { iso, statusToApi };
