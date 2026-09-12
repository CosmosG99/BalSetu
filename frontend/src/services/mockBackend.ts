import { CaseModel, CaseStatus, ReportInput, AiTriageResult, AnalyticsData } from '../types';
import { analyzeReportWithAI } from './mockAiService';

const STORAGE_KEY = 'rakshak_cases_db_v1';

export const INITIAL_SYNTHETIC_CASES: CaseModel[] = [
  {
    id: 'RKS-2026-00421',
    report: {
      incidentTypes: ['LOST', 'DISTRESSED'],
      location: 'Mumbai Central Railway Station',
      locationType: 'RAILWAY_STATION',
      stationName: 'Mumbai Central',
      description: 'Child appears around 12 years old, alone near platform 4. Seemed visually distressed and searching for someone.',
      approxAge: '11-13 years',
      apparentGender: 'Male',
      clothing: 'Blue jacket, dark trousers, carrying a small red backpack',
      direction: 'Towards Foot Overbridge Platform 4',
      platformOrGate: 'Platform 4',
      approxTime: '7:42 PM',
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      isBlurred: true,
      isAnonymous: true,
      reporterRole: 'Station Vendor'
    },
    aiAnalysis: {
      riskScore: 78,
      riskLevel: 'HIGH',
      categories: ['Lost Child', 'Emotional Distress'],
      indicators: ['Unaccompanied minor', 'Visible distress', 'High footfall hazard zone'],
      recommendation: 'Human verification recommended. Alert local station child help desk.',
      explanations: [
        'Child appears to be without a known guardian.',
        'Description indicates visible distress.',
        'Location is near active railway track platform.'
      ]
    },
    status: 'ROUTED',
    createdAt: '2026-09-11T19:42:00Z',
    updatedAt: '2026-09-11T19:43:00Z',
    timeline: [
      { id: 't1', title: 'Report Received', timestamp: '7:42 PM', description: 'Anonymous report submitted via station QR kiosk.', actor: 'Citizen Reporter', completed: true },
      { id: 't2', title: 'AI Triage Completed', timestamp: '7:42 PM', description: 'Assigned Risk Score 78/100 (HIGH).', actor: 'Rakshak AI Engine', completed: true },
      { id: 't3', title: 'Response Network Routed', timestamp: '7:43 PM', description: 'Notified Railway Response Unit & Child Protection Desk.', actor: 'Smart Routing System', completed: true },
      { id: 't4', title: 'Responder Assigned', timestamp: '7:45 PM', description: 'Assigned to Inspector R. Sharma.', actor: 'Response Coordinator', completed: true },
      { id: 't5', title: 'Ground Verification', timestamp: 'In Progress', description: 'Physical welfare check active on Platform 4.', actor: 'Ground Team', completed: false },
      { id: 't6', title: 'Case Resolution', timestamp: 'Pending', description: 'Safe handover or family reunion.', actor: 'Child Welfare Desk', completed: false }
    ],
    auditLogs: [
      { id: 'a1', timestamp: '7:42:15 PM', action: 'CASE_CREATED', performer: 'System (Anonymous User)', details: 'Report created via web application.' },
      { id: 'a2', timestamp: '7:42:18 PM', action: 'AI_TRIAGE_EXECUTED', performer: 'Rakshak AI Triage', details: 'Scored 78/100 HIGH priority based on location & distress parameters.' },
      { id: 'a3', timestamp: '7:43:00 PM', action: 'ROUTING_INITIATED', performer: 'Dispatcher Engine', details: 'Dispatched notification to Mumbai Central Protection Team.' }
    ],
    routing: [
      { organization: 'Simulated Railway Response Unit', category: 'RAILWAY', priority: 'HIGH', status: 'NOTIFIED' },
      { organization: 'Simulated Child Protection Network', category: 'CHILD_PROTECTION', priority: 'HIGH', status: 'NOTIFIED' }
    ],
    coordinates: { lat: 18.9696, lng: 72.8193 }
  },
  {
    id: 'RB-2026-10482',
    report: {
      incidentTypes: ['LOST', 'DISTRESSED'],
      location: 'Mumbai Central Railway Station',
      locationType: 'RAILWAY_STATION',
      stationName: 'Mumbai Central',
      description: 'Child appears around 12 years old, alone near platform 4. Seemed visually distressed and searching for someone.',
      approxAge: '11-13 years',
      apparentGender: 'Male',
      clothing: 'Blue jacket, dark trousers, carrying a small red backpack',
      direction: 'Towards Foot Overbridge Platform 4',
      platformOrGate: 'Platform 4',
      approxTime: '7:42 PM',
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      isBlurred: true,
      isAnonymous: true,
      reporterRole: 'Station Vendor'
    },
    aiAnalysis: {
      riskScore: 78,
      riskLevel: 'HIGH',
      categories: ['Lost Child', 'Emotional Distress'],
      indicators: ['Unaccompanied minor', 'Visible distress', 'High footfall hazard zone'],
      recommendation: 'Human verification recommended. Alert local station child help desk.',
      explanations: [
        'Child appears to be without a known guardian.',
        'Description indicates visible distress.',
        'Location is near active railway track platform.'
      ]
    },
    status: 'NEW',
    createdAt: '2026-09-11T19:42:00Z',
    updatedAt: '2026-09-11T19:42:00Z',
    timeline: [
      { id: 't1', title: 'Report Received', timestamp: '7:42 PM', description: 'Anonymous report submitted via station QR kiosk.', actor: 'Citizen Reporter', completed: true },
      { id: 't2', title: 'AI Triage Completed', timestamp: '7:42 PM', description: 'Assigned Risk Score 78/100 (HIGH).', actor: 'Rakshak AI Engine', completed: true },
      { id: 't3', title: 'Response Network Routed', timestamp: '7:43 PM', description: 'Notified Railway Response Unit & Child Protection Desk.', actor: 'Smart Routing System', completed: true }
    ],
    auditLogs: [],
    routing: [],
    coordinates: { lat: 18.9696, lng: 72.8193 }
  },
  {
    id: 'RB-2026-10481',
    report: {
      incidentTypes: ['UNACCOMPANIED'],
      location: 'Pune Swargate Bus Terminal',
      locationType: 'BUS_TERMINAL',
      stationName: 'Swargate Terminal',
      description: 'Young girl travelling alone with heavy luggage, asking people about buses to Solapur.',
      approxAge: '13-14 years',
      apparentGender: 'Female',
      clothing: 'Red sweater and denim jeans',
      platformOrGate: 'Bay No. 3',
      approxTime: '7:21 PM',
      isBlurred: true,
      isAnonymous: true
    },
    aiAnalysis: {
      riskScore: 58,
      riskLevel: 'MEDIUM',
      categories: ['Unaccompanied Minor'],
      indicators: ['Solo minor travel', 'Intercity bus terminal'],
      recommendation: 'Human review & bus terminal security assistance requested.',
      explanations: ['Minor detected in transit hub without confirmed adult guardian.']
    },
    status: 'UNDER_REVIEW',
    createdAt: '2026-09-11T19:21:00Z',
    updatedAt: '2026-09-11T19:30:00Z',
    assignedResponder: 'Officer Inspector V. Patil',
    timeline: [
      { id: 't1', title: 'Report Received', timestamp: '7:21 PM', description: 'Report logged.', actor: 'Citizen', completed: true },
      { id: 't2', title: 'AI Triage Completed', timestamp: '7:21 PM', description: 'Assigned Risk Score 58/100 (MEDIUM).', actor: 'AI Engine', completed: true },
      { id: 't3', title: 'Under Review', timestamp: '7:30 PM', description: 'Assigned to Swargate Duty Officer.', actor: 'Inspector V. Patil', completed: true }
    ],
    auditLogs: [],
    routing: [],
    coordinates: { lat: 18.5204, lng: 73.8567 }
  }
];

export function generateSyntheticDataset(): CaseModel[] {
  return [...INITIAL_SYNTHETIC_CASES];
}

class StorageBackendService {
  private cases: CaseModel[] = [];

  constructor() {
    this.loadStorage();
  }

  private loadStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.cases = JSON.parse(stored);
        // Ensure RKS-2026-00421 is present in cases database
        if (!this.cases.some((c) => c.id.toUpperCase() === 'RKS-2026-00421')) {
          this.cases.unshift(INITIAL_SYNTHETIC_CASES[0]);
          this.saveStorage();
        }
      } else {
        this.cases = generateSyntheticDataset();
        this.saveStorage();
      }
    } catch (e) {
      this.cases = generateSyntheticDataset();
    }
  }

  private saveStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cases));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }

  public getCases(): CaseModel[] {
    return [...this.cases];
  }

  public getCaseById(id: string): CaseModel | undefined {
    if (!id) return undefined;
    const cleanId = id.trim().toUpperCase();
    const alphaNumericClean = cleanId.replace(/[^A-Z0-9]/g, '');

    return this.cases.find((c) => {
      const targetClean = c.id.trim().toUpperCase();
      const targetAlphaNumeric = targetClean.replace(/[^A-Z0-9]/g, '');

      if (targetClean === cleanId) return true;
      if (targetAlphaNumeric === alphaNumericClean) return true;

      // Direct fallback alias support between RKS-2026-00421 and RB-2026-10482
      if (cleanId === 'RKS-2026-00421' && targetClean === 'RB-2026-10482') return true;
      if (cleanId === 'RB-2026-10482' && targetClean === 'RKS-2026-00421') return true;

      return false;
    });
  }

  public async createReport(input: ReportInput): Promise<CaseModel> {
    const aiResult = await analyzeReportWithAI(input);
    const newId = `RKS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newCase: CaseModel = {
      id: newId,
      report: input,
      aiAnalysis: aiResult,
      status: 'NEW',
      createdAt: nowIso,
      updatedAt: nowIso,
      timeline: [
        { id: 't1', title: 'Report Received', timestamp: timeStr, description: input.isAnonymous ? 'Submitted anonymously' : 'Submitted by citizen', actor: 'Citizen Reporter', completed: true },
        { id: 't2', title: 'AI Triage Completed', timestamp: timeStr, description: `Scored ${aiResult.riskScore}/100 (${aiResult.riskLevel})`, actor: 'Rakshak AI Engine', completed: true },
        { id: 't3', title: 'Responder Routing', timestamp: timeStr, description: 'Dispatched to station network', actor: 'Smart Dispatch', completed: true },
        { id: 't4', title: 'Responder Assignment', timestamp: 'Pending', description: 'Awaiting ground claim', actor: 'Response Network', completed: false },
        { id: 't5', title: 'Ground Intervention', timestamp: 'Pending', description: 'In progress', actor: 'Ground Team', completed: false },
        { id: 't6', title: 'Case Resolution', timestamp: 'Pending', description: 'Final sign-off', actor: 'Welfare Officer', completed: false }
      ],
      auditLogs: [
        { id: `a-${Date.now()}-1`, timestamp: timeStr, action: 'REPORT_SUBMITTED', performer: input.isAnonymous ? 'Anonymous Reporter' : 'Citizen', details: `Report created for ${input.location}` },
        { id: `a-${Date.now()}-2`, timestamp: timeStr, action: 'AI_TRIAGE', performer: 'Rakshak AI', details: `Classified as ${aiResult.riskLevel} priority (${aiResult.riskScore}/100)` }
      ],
      routing: [
        { organization: 'Simulated Transit Safety Unit', category: 'RAILWAY', priority: aiResult.riskLevel as any, status: 'NOTIFIED' },
        { organization: 'Simulated Child Welfare Helpdesk', category: 'CHILD_PROTECTION', priority: aiResult.riskLevel as any, status: 'NOTIFIED' }
      ],
      coordinates: { lat: 18.9696 + (Math.random() - 0.5) * 0.05, lng: 72.8193 + (Math.random() - 0.5) * 0.05 }
    };

    this.cases.unshift(newCase);
    this.saveStorage();
    return newCase;
  }

  public updateStatus(id: string, newStatus: CaseStatus, responderName?: string): CaseModel | undefined {
    const caseIndex = this.cases.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
    if (caseIndex === -1) return undefined;

    const target = this.cases[caseIndex];
    target.status = newStatus;
    target.updatedAt = new Date().toISOString();
    if (responderName) {
      target.assignedResponder = responderName;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    target.timeline.forEach((step) => {
      if (newStatus === 'UNDER_REVIEW' && step.title.includes('Review')) step.completed = true;
      if (newStatus === 'ASSIGNED' && step.title.includes('Assignment')) step.completed = true;
      if (newStatus === 'INTERVENTION' && step.title.includes('Intervention')) step.completed = true;
      if (newStatus === 'RESOLVED') step.completed = true;
    });

    target.auditLogs.unshift({
      id: `a-${Date.now()}`,
      timestamp: timeStr,
      action: `STATUS_UPDATED_${newStatus}`,
      performer: responderName || 'Authorized Responder',
      details: `Case status changed to ${newStatus}`
    });

    this.cases[caseIndex] = target;
    this.saveStorage();
    return target;
  }

  public addInternalNote(id: string, note: string, performer: string): CaseModel | undefined {
    const caseIndex = this.cases.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
    if (caseIndex === -1) return undefined;

    const target = this.cases[caseIndex];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    target.auditLogs.unshift({
      id: `a-${Date.now()}`,
      timestamp: timeStr,
      action: 'INTERNAL_NOTE_ADDED',
      performer: performer || 'Responder',
      details: `Note: "${note}"`
    });

    this.cases[caseIndex] = target;
    this.saveStorage();
    return target;
  }

  public getAnalytics(): AnalyticsData {
    const totalReports = this.cases.length;
    const activeCases = this.cases.filter((c) => c.status !== 'RESOLVED').length;
    const highPriorityCount = this.cases.filter((c) => c.aiAnalysis.riskLevel === 'CRITICAL' || c.aiAnalysis.riskLevel === 'HIGH').length;
    const resolvedCount = this.cases.filter((c) => c.status === 'RESOLVED').length;

    const categoryMap: Record<string, number> = {};
    const locationMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {};
    const priorityMap: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };

    this.cases.forEach((c) => {
      c.report.incidentTypes.forEach((t) => {
        categoryMap[t] = (categoryMap[t] || 0) + 1;
      });
      const locKey = c.report.stationName || c.report.locationType;
      locationMap[locKey] = (locationMap[locKey] || 0) + 1;
      statusMap[c.status] = (statusMap[c.status] || 0) + 1;
      priorityMap[c.aiAnalysis.riskLevel] = (priorityMap[c.aiAnalysis.riskLevel] || 0) + 1;
    });

    return {
      totalReports,
      activeCases,
      highPriorityCount,
      resolvedCount,
      avgResponseTimeMin: 4.2,
      casesByCategory: Object.entries(categoryMap).map(([category, count]) => ({ category, count })),
      casesByLocation: Object.entries(locationMap).slice(0, 6).map(([location, count]) => ({ location, count })),
      casesByStatus: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
      priorityDistribution: [
        { priority: 'CRITICAL', count: priorityMap['CRITICAL'], color: '#EF4444' },
        { priority: 'HIGH', count: priorityMap['HIGH'], color: '#F59E0B' },
        { priority: 'MEDIUM', count: priorityMap['MEDIUM'], color: '#3B82F6' },
        { priority: 'LOW', count: priorityMap['LOW'], color: '#10B981' }
      ],
      timelineSeries: [
        { time: '08:00', reports: 4, resolved: 2 },
        { time: '10:00', reports: 7, resolved: 5 },
        { time: '12:00', reports: 12, resolved: 9 },
        { time: '14:00', reports: 18, resolved: 14 },
        { time: '16:00', reports: 24, resolved: 19 },
        { time: '18:00', reports: 20, resolved: 24 },
        { time: '20:00', reports: totalReports, resolved: resolvedCount }
      ]
    };
  }

  public resetDemoData() {
    this.cases = generateSyntheticDataset();
    this.saveStorage();
  }
}

export const mockBackend = new StorageBackendService();
