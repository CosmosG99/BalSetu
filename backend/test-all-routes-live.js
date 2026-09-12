import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;
const RESPONDER_AUTH = { Authorization: 'Bearer demo-responder' };
const ADMIN_AUTH = { Authorization: 'Bearer demo-admin' };

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function request(testNumber, name, method, path, options = {}) {
  totalTests++;
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const reqOptions = { method, headers };
  if (options.body) {
    reqOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  console.log(`\n========================================================================`);
  console.log(`[TEST #${testNumber}] ${name}`);
  console.log(`📡 REQUEST: ${method} ${path}`);
  if (options.headers?.Authorization) {
    console.log(`🔑 AUTH: ${options.headers.Authorization}`);
  }
  if (options.body) {
    console.log(`📦 BODY:\n${typeof options.body === 'string' ? options.body : JSON.stringify(options.body, null, 2)}`);
  }

  const start = Date.now();
  try {
    const res = await fetch(url, reqOptions);
    const duration = Date.now() - start;
    const contentType = res.headers.get('content-type') || '';
    let responseData;

    if (contentType.includes('application/json')) {
      responseData = await res.json();
    } else {
      responseData = await res.text();
    }

    const expectedStatus = options.expectedStatus || [200, 201];
    const isStatusOk = Array.isArray(expectedStatus)
      ? expectedStatus.includes(res.status)
      : res.status === expectedStatus;

    if (isStatusOk) {
      console.log(`\n📥 RESPONSE [HTTP ${res.status}] (${duration}ms):`);
      const bodyStr = typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : responseData;
      console.log(bodyStr.length > 800 ? bodyStr.substring(0, 800) + '\n... [truncated]' : bodyStr);
      console.log(`✅ RESULT: PASS (HTTP ${res.status})`);
      passedTests++;
      return { status: res.status, data: responseData, ok: true };
    } else {
      console.error(`\n❌ RESPONSE ERROR [HTTP ${res.status}] (${duration}ms):`, responseData);
      console.error(`❌ RESULT: FAIL (Expected ${expectedStatus}, received ${res.status})`);
      failedTests++;
      return { status: res.status, data: responseData, ok: false };
    }
  } catch (err) {
    console.error(`\n❌ NETWORK/EXECUTION ERROR:`, err.message);
    failedTests++;
    return { ok: false, error: err.message };
  }
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runLiveTests() {
  console.log(`🚀 Starting Comprehensive Live API Route Verification against ${BASE_URL}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);

  // Test 1: Health Check
  await request(1, 'System Health Check', 'GET', '/api/health');

  // Test 2: Citizen Reporting (Anonymous)
  const clientReportId1 = `live-client-${Date.now()}`;
  const reportRes = await request(2, 'Citizen Anonymous Report Submission', 'POST', '/api/reports', {
    expectedStatus: 201,
    body: {
      category: 'lost_child',
      description: 'Found a young boy (approx 7-8 yrs) crying on Platform 4 near vending stall. Searching for parents.',
      location: {
        lat: 18.9696,
        lng: 72.8193,
        addressText: 'Platform 4, Mumbai Central Station',
        zone: 'Mumbai Central'
      },
      anonymous: true,
      clientReportId: clientReportId1,
      language: 'en',
      source: 'web'
    }
  });

  const createdCaseId = reportRes.data?.caseId || 'RAK-LST01';

  // Test 3: Citizen Reporting (Non-Anonymous with Registered Reporter)
  await request(3, 'Citizen Verified Volunteer Report', 'POST', '/api/reports', {
    expectedStatus: 201,
    body: {
      category: 'unaccompanied_child',
      description: 'Pre-teen travelling with no adult guardian, confused at bus terminal gate.',
      location: {
        lat: 18.5018,
        lng: 73.8586,
        addressText: 'Gate 2, Swargate Bus Terminal, Pune',
        zone: 'Pune Swargate'
      },
      anonymous: false,
      reporterId: 'rep-vol-01',
      clientReportId: `live-client-rep-${Date.now()}`,
      language: 'en',
      source: 'volunteer'
    }
  });

  // Test 4: Idempotent Resubmission (Duplicate clientReportId)
  await request(4, 'Idempotent Duplicate Report Submission', 'POST', '/api/reports', {
    expectedStatus: 200,
    body: {
      category: 'lost_child',
      description: 'Found a young boy crying on Platform 4 (re-attempt).',
      location: {
        lat: 18.9696,
        lng: 72.8193,
        addressText: 'Platform 4, Mumbai Central Station',
        zone: 'Mumbai Central'
      },
      anonymous: true,
      clientReportId: clientReportId1,
      language: 'en',
      source: 'web'
    }
  });

  // Test 5: Batch Offline Sync
  await request(5, 'Batch Offline Drafts Sync', 'POST', '/api/reports/sync', {
    expectedStatus: 200,
    body: {
      reports: [
        {
          category: 'trafficking_concern',
          description: 'Observed two young girls being forcefully moved through unlit parking corridor.',
          location: { lat: 19.0178, lng: 72.8478, addressText: 'East Parking, Dadar Station', zone: 'Dadar Central' },
          anonymous: true,
          clientReportId: `sync-draft-1-${Date.now()}`,
          language: 'en',
          source: 'app'
        },
        {
          category: 'abuse_concern',
          description: 'Minor begging under duress from nearby adult monitor.',
          location: { lat: 19.2183, lng: 72.9781, addressText: 'Thane West Ticket Concourse', zone: 'Thane' },
          anonymous: true,
          clientReportId: `sync-draft-2-${Date.now()}`,
          language: 'en',
          source: 'app'
        }
      ]
    }
  });

  // Test 6: WhatsApp Webhook Turn 1 (Greeting / Welcome)
  const testPhone = 'whatsapp:+919988776655';
  await request(6, 'WhatsApp Turn 1: Initial Greeting / Start', 'POST', '/api/whatsapp/webhook', {
    expectedStatus: 200,
    body: { From: testPhone, Body: 'start' }
  });

  // Test 7: WhatsApp Webhook Turn 2 (Category Selection)
  await request(7, 'WhatsApp Turn 2: Category Selection (Option 1)', 'POST', '/api/whatsapp/webhook', {
    expectedStatus: 200,
    body: { From: testPhone, Body: '1' }
  });

  // Test 8: WhatsApp Webhook Turn 3 (Description)
  await request(8, 'WhatsApp Turn 3: Description Entry', 'POST', '/api/whatsapp/webhook', {
    expectedStatus: 200,
    body: { From: testPhone, Body: 'Child separated from family near railway foot overbridge' }
  });

  // Test 9: WhatsApp Webhook Turn 4 (Location)
  await request(9, 'WhatsApp Turn 4: Location Entry', 'POST', '/api/whatsapp/webhook', {
    expectedStatus: 200,
    body: { From: testPhone, Body: 'Mumbai Central Platform 3 footbridge' }
  });

  // Test 10: WhatsApp Webhook Turn 5 (Photo Skip & Registration)
  await request(10, 'WhatsApp Turn 5: Photo Skip & Case Generation', 'POST', '/api/whatsapp/webhook', {
    expectedStatus: 200,
    body: { From: testPhone, Body: 'skip' }
  });

  // Test 11: WhatsApp Webhook Case Status Query
  await request(11, 'WhatsApp Status Query by Case ID', 'POST', '/api/whatsapp/webhook', {
    expectedStatus: 200,
    body: { From: testPhone, Body: `STATUS ${createdCaseId}` }
  });

  // Test 12: Citizen Case Tracking Safe View (Privacy Stripping)
  await request(12, 'Public Citizen Case Tracking (Safe View)', 'GET', `/api/track/${createdCaseId}`);

  // Test 13: Case Management List
  await request(13, 'List All Cases (Responder/Admin)', 'GET', '/api/cases', {
    headers: RESPONDER_AUTH
  });

  // Test 14: Filter Cases by Status
  await request(14, 'Filter Cases by Status (new)', 'GET', '/api/cases?status=new', {
    headers: RESPONDER_AUTH
  });

  // Test 15: Filter Cases by Priority
  await request(15, 'Filter Cases by Priority (critical)', 'GET', '/api/cases?priority=critical', {
    headers: RESPONDER_AUTH
  });

  // Test 16: Filter Cases by Category
  await request(16, 'Filter Cases by Category (lost_child)', 'GET', '/api/cases?category=lost_child', {
    headers: RESPONDER_AUTH
  });

  // Test 17: Filter Cases by Zone
  await request(17, 'Filter Cases by Zone (Mumbai Central)', 'GET', '/api/cases?zone=Mumbai%20Central', {
    headers: RESPONDER_AUTH
  });

  // Test 18: Get Single Case Details (Audit-logged)
  await request(18, 'Get Single Case Details', 'GET', `/api/cases/${createdCaseId}`, {
    headers: RESPONDER_AUTH
  });

  // Test 19: Patch Case Status & Add Internal Note
  await request(19, 'Patch Case (Status, Priority, Internal Note)', 'PATCH', `/api/cases/${createdCaseId}`, {
    headers: RESPONDER_AUTH,
    body: {
      status: 'under_review',
      priority: 'high',
      internalNote: 'Officer conducting on-site physical welfare check.',
      timelineNote: 'Case accepted for ground verification by station response team.'
    }
  });

  // Test 20: Get Case Timeline
  await request(20, 'Get Case Timeline History', 'GET', `/api/cases/${createdCaseId}/timeline`, {
    headers: RESPONDER_AUTH
  });

  // Test 21: Dashboard - New Cases Queue
  await request(21, 'Responder Dashboard: New Queue', 'GET', '/api/dashboard/new', {
    headers: RESPONDER_AUTH
  });

  // Test 22: Dashboard - High Priority Queue
  await request(22, 'Responder Dashboard: High Priority Queue', 'GET', '/api/dashboard/high-priority', {
    headers: RESPONDER_AUTH
  });

  // Test 23: Dashboard - Assigned to Responder Queue
  await request(23, 'Responder Dashboard: Assigned Queue', 'GET', '/api/dashboard/assigned/usr-resp-01', {
    headers: RESPONDER_AUTH
  });

  // Test 24: Dashboard - Multi-field Search
  await request(24, 'Responder Dashboard: Search Query', 'GET', '/api/dashboard/search?query=Platform', {
    headers: RESPONDER_AUTH
  });

  // Test 25: Smart Responder Auto-Routing
  await request(25, 'Smart Responder Auto-Routing Trigger', 'POST', `/api/cases/${createdCaseId}/auto-route`, {
    headers: ADMIN_AUTH
  });

  // Test 26: Run Missing-Child Matching Engine
  const matchRes = await request(26, 'Run Missing-Child Vector Cosine Matching', 'POST', `/api/matching/run/${createdCaseId}`, {
    headers: RESPONDER_AUTH
  });

  const topMatch = matchRes.data?.candidates?.[0];
  const matchIdToVerify = topMatch?.id || `match-${createdCaseId}-MC-2026-081`;

  // Test 27: Get Match Candidates
  await request(27, 'Get Match Candidates for Case', 'GET', `/api/matching/${createdCaseId}/candidates`, {
    headers: RESPONDER_AUTH
  });

  // Test 28: Human Verification of Match Candidate
  await request(28, 'Verify Match Candidate (Confirm)', 'POST', `/api/matching/${matchIdToVerify}/verify`, {
    headers: RESPONDER_AUTH,
    body: {
      status: 'confirmed',
      notes: 'Parent confirmed physical facial scar and jacket matching record.'
    }
  });

  // Test 29: Map GeoJSON Incidents
  await request(29, 'Get Map Incidents (GeoJSON FeatureCollection)', 'GET', '/api/map/incidents', {
    headers: RESPONDER_AUTH
  });

  // Test 30: Map Zone Heatmap Aggregation
  await request(30, 'Get Map Zone Heatmap Density', 'GET', '/api/map/heatmap', {
    headers: RESPONDER_AUTH
  });

  // Test 31: Get User Notifications
  const notifsRes = await request(31, 'Get Notifications for User', 'GET', '/api/notifications/usr-resp-01', {
    headers: RESPONDER_AUTH
  });

  const firstNotifId = notifsRes.data?.notifications?.[0]?.id || 'notif-seed-01';

  // Test 32: Mark Notification as Read
  await request(32, 'Mark Notification as Read', 'PATCH', `/api/notifications/${firstNotifId}/read`, {
    headers: RESPONDER_AUTH
  });

  // Test 33: Register Community Reporter
  const newReporterPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;
  const regRepRes = await request(33, 'Register Community Reporter', 'POST', '/api/reporters/register', {
    expectedStatus: [200, 201],
    body: {
      name: 'Ramesh Sawant',
      phone: newReporterPhone,
      type: 'transit_worker',
      zone: 'Mumbai Central'
    }
  });

  const registeredRepId = regRepRes.data?.reporter?.id || 'rep-vol-01';

  // Test 34: Quick Report from Community Reporter
  await request(34, 'Community Reporter Quick Report Submission', 'POST', `/api/reporters/${registeredRepId}/quick-report`, {
    expectedStatus: 201,
    body: {
      category: 'lost_child',
      description: 'Lost toddler crying outside ticket counter gate 1.',
      location: {
        lat: 18.9696,
        lng: 72.8193,
        addressText: 'Ticket Counter Gate 1, Mumbai Central',
        zone: 'Mumbai Central'
      }
    }
  });

  // Test 35: Community Reporter Submission History (Admin)
  await request(35, 'Get Reporter History (Admin)', 'GET', `/api/reporters/${registeredRepId}/history`, {
    headers: ADMIN_AUTH
  });

  // Test 36: Admin Overview Analytics
  await request(36, 'Admin KPI Stats: Overview', 'GET', '/api/admin/stats/overview', {
    headers: ADMIN_AUTH
  });

  // Test 37: Admin Priority Analytics
  await request(37, 'Admin KPI Stats: By Priority', 'GET', '/api/admin/stats/by-priority', {
    headers: ADMIN_AUTH
  });

  // Test 38: Admin Category Analytics
  await request(38, 'Admin KPI Stats: By Category', 'GET', '/api/admin/stats/by-category', {
    headers: ADMIN_AUTH
  });

  // Test 39: Admin Location Analytics
  await request(39, 'Admin KPI Stats: By Location', 'GET', '/api/admin/stats/by-location', {
    headers: ADMIN_AUTH
  });

  // Test 40: Admin Resolution Times Analytics
  await request(40, 'Admin KPI Stats: Resolution Times', 'GET', '/api/admin/stats/resolution-times', {
    headers: ADMIN_AUTH
  });

  // Test 41: Demo Mode Database Reset & Reseed
  await request(41, 'Demo Mode Database Reset & Reseed', 'POST', '/api/demo/reset', {
    headers: ADMIN_AUTH
  });

  console.log(`\n========================================================================`);
  console.log(`🏁 LIVE ROUTE VERIFICATION SUMMARY`);
  console.log(`========================================================================`);
  console.log(`Total Routes Tested: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  console.log(`========================================================================\n`);

  process.exit(failedTests > 0 ? 1 : 0);
}

runLiveTests();
