import { CaseModel, CaseStatus, ReportInput, AiTriageResult, AnalyticsData } from '../types';
import { analyzeReportWithAI } from './mockAiService';

const STORAGE_KEY = 'rakshak_cases_db_v1';

export const INITIAL_SYNTHETIC_CASES: CaseModel[] = [
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
      { id: 't3', title: 'Response Network Routed', timestamp: '7:43 PM', description: 'Notified Railway Response Unit & Child Protection Desk.', actor: 'Smart Routing System', completed: true },
      { id: 't4', title: 'Responder Assigned', timestamp: 'Pending', description: 'Awaiting ground responder acceptance.', actor: 'Response Coordinator', completed: false },
      { id: 't5', title: 'Ground Verification', timestamp: 'Pending', description: 'Physical welfare check by station staff.', actor: 'Ground Team', completed: false },
      { id: 't6', title: 'Case Resolution', timestamp: 'Pending', description: 'Safe handover or family reunion.', actor: 'Child Welfare Desk', completed: false }
    ],
    auditLogs: [
      { id: 'a1', timestamp: '7:42:15 PM', action: 'CASE_CREATED', performer: 'System (Anonymous User)', details: 'Report created via web application.' },
      { id: 'a2', timestamp: '7:42:18 PM', action: 'AI_TRIAGE_EXECUTED', performer: 'Rakshak AI Triage', details: 'Scored 78/100 HIGH priority based on location & distress parameters.' },
      { id: 'a3', timestamp: '7:43:00 PM', action: 'ROUTING_INITIATED', performer: 'Dispatcher Engine', details: 'Dispatched notification to Mumbai Central Protection Team.' }
    ],
    routing: [
      { organization: 'Simulated Railway Response Unit', category: 'RAILWAY', priority: 'HIGH', status: 'NOTIFIED' },
      { organization: 'Simulated Child Protection Network', category: 'CHILD_PROTECTION', priority: 'HIGH', status: 'NOTIFIED' },
      { organization: 'Verified Station Support Volunteer', category: 'SUPPORT_PARTNER', priority: 'MEDIUM', status: 'PENDING' }
    ],
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
    assignedResponder: 'Officer Inspector V. Patil (Simulated)',
    timeline: [
      { id: 't1', title: 'Report Received', timestamp: '7:21 PM', description: 'Report logged.', actor: 'Citizen', completed: true },
      { id: 't2', title: 'AI Triage Completed', timestamp: '7:21 PM', description: 'Assigned Risk Score 58/100 (MEDIUM).', actor: 'AI Engine', completed: true },
      { id: 't3', title: 'Under Review', timestamp: '7:30 PM', description: 'Assigned to Swargate Duty Officer.', actor: 'Inspector V. Patil', completed: true }
    ],
    auditLogs: [
      { id: 'a1', timestamp: '7:21:00 PM', action: 'CASE_CREATED', performer: 'System', details: 'Created via mobile report.' },
      { id: 'a2', timestamp: '7:30:00 PM', action: 'RESPONDER_ASSIGNED', performer: 'Inspector V. Patil', details: 'Self-assigned case for physical verification.' }
    ],
    routing: [
      { organization: 'Simulated Bus Terminal Security', category: 'RAILWAY', priority: 'MEDIUM', status: 'ACCEPTED' },
      { organization: 'Simulated Local NGO Desk', category: 'SUPPORT_PARTNER', priority: 'MEDIUM', status: 'NOTIFIED' }
    ],
    coordinates: { lat: 18.5018, lng: 73.8636 }
  },
  {
    id: 'RB-2026-10479',
    report: {
      incidentTypes: ['TRAFFICKING', 'DISTRESSED'],
      location: 'Nagpur Junction Station',
      locationType: 'RAILWAY_STATION',
      stationName: 'Nagpur Junction',
      description: 'Anxious child being pulled forcefully by an adult avoiding station security cameras near exit gate 2.',
      approxAge: '10-12 years',
      apparentGender: 'Male',
      clothing: 'Yellow shirt, black shorts',
      platformOrGate: 'Exit Gate 2',
      approxTime: '6:55 PM',
      isBlurred: true,
      isAnonymous: true
    },
    aiAnalysis: {
      riskScore: 92,
      riskLevel: 'CRITICAL',
      categories: ['Potential Trafficking Risk', 'Physical Distress'],
      indicators: ['Coercive movement', 'Avoidance of security checkpoints', 'Severe distress'],
      recommendation: 'Immediate alert to station security personnel & rapid intervention team.',
      explanations: [
        'Potential trafficking indicators may be present.',
        'Coercive handling of minor by non-responsive adult.',
        'High urgency dispatch recommended.'
      ]
    },
    status: 'INTERVENTION',
    createdAt: '2026-09-11T18:55:00Z',
    updatedAt: '2026-09-11T19:10:00Z',
    assignedResponder: 'Rapid Response Team A (Simulated)',
    timeline: [
      { id: 't1', title: 'Report Received', timestamp: '6:55 PM', description: 'Urgent bystander report.', actor: 'Bystander', completed: true },
      { id: 't2', title: 'AI Triage Completed', timestamp: '6:55 PM', description: 'Assigned Risk Score 92/100 (CRITICAL).', actor: 'AI Engine', completed: true },
      { id: 't3', title: 'Intervention Initiated', timestamp: '7:10 PM', description: 'Ground team dispatched to Exit Gate 2.', actor: 'Team Lead S. Kulkarni', completed: true }
    ],
    auditLogs: [
      { id: 'a1', timestamp: '6:55:00 PM', action: 'CRITICAL_ALERT_RAISED', performer: 'AI Engine', details: 'Score 92 triggered high-priority alarm.' },
      { id: 'a2', timestamp: '7:10:00 PM', action: 'INTERVENTION_STATUS', performer: 'Rapid Response Team A', details: 'Team arrived at location.' }
    ],
    routing: [
      { organization: 'Simulated Station Rapid Response Team', category: 'RAILWAY', priority: 'CRITICAL', status: 'ACCEPTED' },
      { organization: 'Simulated Child Welfare Unit', category: 'CHILD_PROTECTION', priority: 'CRITICAL', status: 'ACCEPTED' }
    ],
    coordinates: { lat: 21.1524, lng: 79.0888 }
  },
  {
    id: 'RB-2026-10475',
    report: {
      incidentTypes: ['LOST'],
      location: 'New Delhi Railway Station',
      locationType: 'RAILWAY_STATION',
      stationName: 'NDLS',
      description: 'Little boy crying near ticket counter 3. Says he lost his uncle in crowd.',
      approxAge: '7-8 years',
      apparentGender: 'Male',
      clothing: 'Green t-shirt, blue denim',
      platformOrGate: 'Pahar Ganj Entrance Ticket Hall',
      approxTime: '5:40 PM',
      isBlurred: true,
      isAnonymous: false,
      reporterRole: 'Rickshaw Driver'
    },
    aiAnalysis: {
      riskScore: 70,
      riskLevel: 'HIGH',
      categories: ['Lost / Separated Child'],
      indicators: ['Young age vulnerability', 'Parental separation in crowds'],
      recommendation: 'Announce over station PA system and escort to child assistance desk.',
      explanations: ['Young child separated in high-density concourse.']
    },
    status: 'RESOLVED',
    createdAt: '2026-09-11T17:40:00Z',
    updatedAt: '2026-09-11T18:30:00Z',
    assignedResponder: 'Help Desk Coordinator Meena (Simulated)',
    timeline: [
      { id: 't1', title: 'Report Received', timestamp: '5:40 PM', description: 'Reported by trusted rickshaw driver.', actor: 'Rickshaw Driver', completed: true },
      { id: 't2', title: 'Child Located & Reunited', timestamp: '6:30 PM', description: 'Child safely reunited with uncle after PA announcement.', actor: 'Child Help Desk', completed: true }
    ],
    auditLogs: [
      { id: 'a1', timestamp: '6:30:00 PM', action: 'CASE_RESOLVED', performer: 'Help Desk Coordinator Meena', details: 'Guardian identity verified. Case closed.' }
    ],
    routing: [
      { organization: 'Simulated Station Help Desk', category: 'CHILD_PROTECTION', priority: 'HIGH', status: 'ACCEPTED' }
    ],
    coordinates: { lat: 28.6429, lng: 77.2197 }
  }
];

// Helper to generate remaining 26 realistic synthetic cases for full dashboard richness
const generateSyntheticDataset = (): CaseModel[] => {
  const dataset: CaseModel[] = [...INITIAL_SYNTHETIC_CASES];
  const stations = [
    { name: 'Dadar Central Railway Station', type: 'RAILWAY_STATION', lat: 19.0178, lng: 72.8478 },
    { name: 'Howrah Junction Station', type: 'RAILWAY_STATION', lat: 22.5837, lng: 88.3426 },
    { name: 'Swargate Bus Terminal', type: 'BUS_TERMINAL', lat: 18.5018, lng: 73.8636 },
    { name: 'Kashmere Gate Metro Hub', type: 'METRO_STATION', lat: 28.6675, lng: 77.2285 },
    { name: 'Bengaluru Majestic Bus Stand', type: 'BUS_TERMINAL', lat: 12.9781, lng: 77.5697 },
    { name: 'Chennai Central Station', type: 'RAILWAY_STATION', lat: 13.0827, lng: 80.2707 },
    { name: 'Thane Railway Station', type: 'RAILWAY_STATION', lat: 19.1860, lng: 72.9759 },
    { name: 'Hazrat Nizamuddin Station', type: 'RAILWAY_STATION', lat: 28.5892, lng: 77.2530 }
  ];

  const incidentCombos: { types: any[]; score: number; risk: any; desc: string }[] = [
    { types: ['LOST'], score: 68, risk: 'HIGH', desc: 'Child crying near water booth, looking for family.' },
    { types: ['UNACCOMPANIED'], score: 52, risk: 'MEDIUM', desc: 'Minor waiting alone at bus bay for over 3 hours.' },
    { types: ['TRAFFICKING'], score: 88, risk: 'CRITICAL', desc: 'Suspected coerced travel reported by co-passenger.' },
    { types: ['DISTRESSED'], score: 60, risk: 'MEDIUM', desc: 'Child visibly upset asking for help to find phone booth.' },
    { types: ['BULLYING'], score: 40, risk: 'LOW', desc: 'Group of youths bothering a younger minor near exit.' },
    { types: ['ABUSE'], score: 84, risk: 'CRITICAL', desc: 'Child showing signs of restraint or threat in concourse.' }
  ];

  const statuses: CaseStatus[] = ['NEW', 'TRIAGED', 'UNDER_REVIEW', 'ROUTED', 'ASSIGNED', 'INTERVENTION', 'RESOLVED'];

  for (let i = 5; i <= 30; i++) {
    const station = stations[i % stations.length];
    const combo = incidentCombos[i % incidentCombos.length];
    const status = statuses[i % statuses.length];
    const caseId = `RB-2026-${10480 - i}`;

    dataset.push({
      id: caseId,
      report: {
        incidentTypes: combo.types,
        location: station.name,
        locationType: station.type as any,
        stationName: station.name.split(' ')[0],
        description: combo.desc,
        approxAge: `${9 + (i % 6)} years`,
        apparentGender: i % 2 === 0 ? 'Female' : 'Male',
        clothing: i % 2 === 0 ? 'Red dress, white shoes' : 'Dark jacket and grey trousers',
        approxTime: `${(i % 12) + 1}:15 ${i % 2 === 0 ? 'AM' : 'PM'}`,
        isBlurred: true,
        isAnonymous: true
      },
      aiAnalysis: {
        riskScore: combo.score,
        riskLevel: combo.risk,
        categories: [combo.types[0]],
        indicators: ['Synthetic indicator flag for analytical testing'],
        recommendation: 'Standard responder evaluation and human verification required.',
        explanations: ['Simulated case generated for analytical data testing.']
      },
      status: status,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - (i - 1) * 3600000).toISOString(),
      timeline: [
        { id: 't1', title: 'Report Created', timestamp: `${i}h ago`, description: 'System log', actor: 'Citizen', completed: true },
        { id: 't2', title: 'AI Evaluated', timestamp: `${i}h ago`, description: `Score ${combo.score}`, actor: 'AI Engine', completed: true }
      ],
      auditLogs: [
        { id: 'a1', timestamp: `${i}h ago`, action: 'RECORD_ADDED', performer: 'Synthetic Generator', details: 'Initialized data point' }
      ],
      routing: [
        { organization: 'Simulated Local Transit Cell', category: 'RAILWAY', priority: combo.risk, status: 'NOTIFIED' }
      ],
      coordinates: { lat: station.lat + (Math.random() - 0.5) * 0.02, lng: station.lng + (Math.random() - 0.5) * 0.02 }
    });
  }

  return dataset;
};

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
    return this.cases.find((c) => c.id.toUpperCase() === id.toUpperCase());
  }

  public async createReport(input: ReportInput): Promise<CaseModel> {
    const aiResult = await analyzeReportWithAI(input);
    const newId = `RB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
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

    // Update timeline step completion
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
        { time: '18:00', reports: 29, resolved: 24 },
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
