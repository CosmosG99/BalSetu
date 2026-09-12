export type Language = 'en' | 'hi' | 'mr';

export type IncidentType = 
  | 'LOST'
  | 'DISTRESSED'
  | 'UNACCOMPANIED'
  | 'TRAFFICKING'
  | 'ABUSE'
  | 'BULLYING'
  | 'OTHER';

export type LocationType = 
  | 'RAILWAY_STATION'
  | 'BUS_TERMINAL'
  | 'METRO_STATION'
  | 'TRANSIT_HUB'
  | 'PUBLIC_PLACE'
  | 'OTHER';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type CaseStatus = 
  | 'NEW'
  | 'TRIAGED'
  | 'UNDER_REVIEW'
  | 'ROUTED'
  | 'ASSIGNED'
  | 'INTERVENTION'
  | 'RESOLVED';

export interface ReportInput {
  incidentTypes: IncidentType[];
  location: string;
  locationType: LocationType;
  stationName?: string;
  description: string;
  approxAge?: string;
  apparentGender?: string;
  clothing?: string;
  direction?: string;
  platformOrGate?: string;
  approxTime?: string;
  photoUrl?: string;
  isBlurred?: boolean;
  isAnonymous: boolean;
  reporterRole?: string;
}

export interface AiTriageResult {
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  categories: string[];
  indicators: string[];
  recommendation: string;
  explanations: string[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  actor: string;
  completed: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  performer: string;
  details: string;
}

export interface RoutingRecommendation {
  organization: string;
  category: 'RAILWAY' | 'CHILD_PROTECTION' | 'SUPPORT_PARTNER';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'NOTIFIED' | 'PENDING' | 'ACCEPTED';
}

export interface CaseModel {
  id: string; // e.g. RB-2026-10482
  report: ReportInput;
  aiAnalysis: AiTriageResult;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  assignedResponder?: string;
  timeline: TimelineEvent[];
  auditLogs: AuditLog[];
  routing: RoutingRecommendation[];
  coordinates?: { lat: number; lng: number };
}

export interface MissingChildProfile {
  id: string;
  caseRef: string;
  syntheticName: string;
  age: number;
  gender: string;
  photoUrl: string;
  lastKnownLocation: string;
  missingSince: string;
  description: string;
  similarityScore?: number;
}

export interface AnalyticsData {
  totalReports: number;
  activeCases: number;
  highPriorityCount: number;
  resolvedCount: number;
  avgResponseTimeMin: number;
  casesByCategory: { category: string; count: number }[];
  casesByLocation: { location: string; count: number }[];
  casesByStatus: { status: string; count: number }[];
  priorityDistribution: { priority: string; count: number; color: string }[];
  timelineSeries: { time: string; reports: number; resolved: number }[];
}

export interface UserRole {
  role: 'CITIZEN' | 'RESPONDER' | 'ADMIN';
  title: string;
}
