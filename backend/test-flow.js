import { server } from './app.js';
import { db, COLLECTIONS } from './src/models/db.js';

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;
const RESPONDER_AUTH = { Authorization: 'Bearer demo-responder' };
const ADMIN_AUTH = { Authorization: 'Bearer demo-admin' };

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n🧪 Starting Comprehensive RAKSHAK Backend Test Suite...\n');

  try {
    // 0. Health Check
    console.log('--- Test 0: System Health ---');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200, 'Health check returns HTTP 200');
    assert(healthJson.status === 'healthy', 'System reports healthy');

    // 1. Citizen Anonymous Reporting & Privacy Verification
    console.log('\n--- Test 1: Citizen Reporting & Privacy Constraints ---');
    const clientReportId1 = `test-client-${Date.now()}`;
    const reportPayload = {
      category: 'lost_child',
      description: 'Found a young boy crying near ticket counter 2 at Mumbai Central.',
      location: {
        lat: 18.9696,
        lng: 72.8193,
        addressText: 'Ticket Counter 2, Mumbai Central',
        zone: 'Mumbai Central'
      },
      anonymous: true,
      clientReportId: clientReportId1,
      language: 'en',
      source: 'web'
    };

    const reportRes = await fetch(`${BASE_URL}/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportPayload)
    });
    const reportJson = await reportRes.json();

    assert(reportRes.status === 201, 'POST /api/reports returns HTTP 201 Created');
    assert(Boolean(reportJson.caseId), `Returns valid Case ID: ${reportJson.caseId}`);
    const createdCaseId = reportJson.caseId;

    // Check DB document directly for privacy rule (Section 6)
    const storedCaseSnap = await db.collection(COLLECTIONS.REPORTS).doc(createdCaseId).get();
    const storedCase = storedCaseSnap.data();
    assert(storedCase.anonymous === true, 'Case stored as anonymous');
    assert(!('reporterId' in storedCase), 'PRIVACY GUARANTEE: reporterId completely omitted from anonymous doc');
    assert(storedCase.aiTriage !== null, 'AI triage ran synchronously');
    assert(storedCase.aiTriage.humanVerificationRequired === true, 'Triage has humanVerificationRequired: true');

    // 2. Offline / Low Connectivity Idempotency
    console.log('\n--- Test 2: Offline Sync & Idempotency ---');
    const dupRes = await fetch(`${BASE_URL}/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportPayload)
    });
    const dupJson = await dupRes.json();
    assert(dupRes.status === 200, 'Duplicate report returns HTTP 200');
    assert(dupJson.caseId === createdCaseId, 'Duplicate returns identical existing caseId');
    assert(dupJson.status === 'existing', 'Status indicates existing record');

    // Batch Sync
    const syncPayload = {
      reports: [
        {
          category: 'unaccompanied_child',
          description: 'Offline sync draft child waiting by bay 4.',
          location: { lat: 18.5018, lng: 73.8586, addressText: 'Bay 4', zone: 'Pune Swargate' },
          anonymous: true,
          clientReportId: `sync-offline-${Date.now()}`,
          language: 'en',
          source: 'app'
        }
      ]
    };
    const syncRes = await fetch(`${BASE_URL}/api/reports/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(syncPayload)
    });
    const syncJson = await syncRes.json();
    assert(syncRes.status === 200, 'POST /api/reports/sync returns HTTP 200');
    assert(syncJson.synced.length === 1, 'Synced 1 offline report');

    // 3. Citizen Case Tracking & Privacy Leak Prevention
    console.log('\n--- Test 3: Citizen Case Tracking (Safe View) ---');
    const trackRes = await fetch(`${BASE_URL}/api/track/${createdCaseId}`);
    const trackJson = await trackRes.json();
    assert(trackRes.status === 200, 'GET /api/track/:caseId returns HTTP 200');
    assert(trackJson.caseId === createdCaseId, 'Tracking returns correct case ID');
    assert(Boolean(trackJson.status), 'Tracking returns case status');
    assert(Boolean(trackJson.timelinePublic), 'Tracking returns public timeline');
    // Non-negotiable security assertions
    assert(trackJson.location === undefined, 'PRIVACY CHECK: location object NOT leaked');
    assert(trackJson.lat === undefined, 'PRIVACY CHECK: exact GPS lat NOT leaked');
    assert(trackJson.lng === undefined, 'PRIVACY CHECK: exact GPS lng NOT leaked');
    assert(trackJson.internalNotes === undefined, 'PRIVACY CHECK: internalNotes NOT leaked');
    assert(trackJson.aiTriage === undefined, 'PRIVACY CHECK: aiTriage details NOT leaked');
    assert(trackJson.assignedResponderId === undefined, 'PRIVACY CHECK: responder ID NOT leaked');

    // 4. WhatsApp Conversational Flow
    console.log('\n--- Test 4: WhatsApp Conversational Flow ---');
    const testPhone = 'whatsapp:+919800011122';

    // Step 1: Start
    const waStartRes = await fetch(`${BASE_URL}/api/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ From: testPhone, Body: 'start' })
    });
    assert(waStartRes.status === 200, 'WhatsApp step 1 (start) returns HTTP 200');

    // Step 2: Select Category (1 = lost_child)
    await fetch(`${BASE_URL}/api/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ From: testPhone, Body: '1' })
    });

    // Step 3: Description
    await fetch(`${BASE_URL}/api/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ From: testPhone, Body: 'Child separated from parents near Platform 2 escalator' })
    });

    // Step 4: Location
    await fetch(`${BASE_URL}/api/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ From: testPhone, Body: 'Mumbai Central Platform 2 escalator' })
    });

    // Step 5: Photo (skip)
    const waFinishRes = await fetch(`${BASE_URL}/api/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ From: testPhone, Body: 'skip' })
    });
    const waFinishXml = await waFinishRes.text();
    assert(waFinishXml.includes('Case successfully registered!'), 'WhatsApp flow registers case successfully and returns Case ID');

    // 5. Case Management (Cases API)
    console.log('\n--- Test 5: Case Management ---');
    const casesRes = await fetch(`${BASE_URL}/api/cases`, { headers: RESPONDER_AUTH });
    const casesJson = await casesRes.json();
    assert(casesRes.status === 200, 'GET /api/cases returns HTTP 200');
    assert(casesJson.cases.length > 0, `Found ${casesJson.cases.length} cases`);

    // View Single Case
    const singleRes = await fetch(`${BASE_URL}/api/cases/${createdCaseId}`, { headers: RESPONDER_AUTH });
    assert(singleRes.status === 200, 'GET /api/cases/:id returns HTTP 200');

    // Update Case (PATCH)
    const patchRes = await fetch(`${BASE_URL}/api/cases/${createdCaseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...RESPONDER_AUTH },
      body: JSON.stringify({
        status: 'under_review',
        internalNote: 'Officer conducting on-site verification at ticket counter.'
      })
    });
    const patchJson = await patchRes.json();
    assert(patchRes.status === 200, 'PATCH /api/cases/:id returns HTTP 200');
    assert(patchJson.case.status === 'under_review', 'Status updated to under_review');
    assert(patchJson.case.internalNotes.length > 0, 'Internal note appended');

    // 6. Responder Dashboard
    console.log('\n--- Test 6: Responder Dashboard ---');
    const newCasesRes = await fetch(`${BASE_URL}/api/dashboard/new`, { headers: RESPONDER_AUTH });
    assert(newCasesRes.status === 200, 'GET /api/dashboard/new returns HTTP 200');

    const highPriRes = await fetch(`${BASE_URL}/api/dashboard/high-priority`, { headers: RESPONDER_AUTH });
    assert(highPriRes.status === 200, 'GET /api/dashboard/high-priority returns HTTP 200');

    const searchRes = await fetch(`${BASE_URL}/api/dashboard/search?query=Central`, { headers: RESPONDER_AUTH });
    const searchJson = await searchRes.json();
    assert(searchRes.status === 200, 'GET /api/dashboard/search returns HTTP 200');
    assert(searchJson.cases.length > 0, `Search query matches ${searchJson.cases.length} records`);

    // 7. Smart Responder Routing
    console.log('\n--- Test 7: Smart Responder Routing ---');
    const routeRes = await fetch(`${BASE_URL}/api/cases/${createdCaseId}/auto-route`, {
      method: 'POST',
      headers: ADMIN_AUTH
    });
    const routeJson = await routeRes.json();
    assert(routeRes.status === 200, 'POST /api/cases/:id/auto-route returns HTTP 200');
    assert(Boolean(routeJson.assignedResponder), `Auto-assigned to: ${routeJson.assignedResponder?.name}`);

    // 8. Missing-Child Matching Engine
    console.log('\n--- Test 8: Missing-Child Matching Engine ---');
    const matchRunRes = await fetch(`${BASE_URL}/api/matching/run/${createdCaseId}`, {
      method: 'POST',
      headers: RESPONDER_AUTH
    });
    const matchRunJson = await matchRunRes.json();
    assert(matchRunRes.status === 200, 'POST /api/matching/run/:reportId returns HTTP 200');
    assert(matchRunJson.candidates.length > 0, `Generated ${matchRunJson.candidates.length} match candidates`);

    const topCandidate = matchRunJson.candidates[0];
    assert(topCandidate.status === 'pending_verification', 'Candidate initialized as pending_verification');

    // Confirm match
    const verifyRes = await fetch(`${BASE_URL}/api/matching/${topCandidate.id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...RESPONDER_AUTH },
      body: JSON.stringify({ status: 'confirmed', notes: 'Physical visual match confirmed with guardian photo.' })
    });
    const verifyJson = await verifyRes.json();
    assert(verifyRes.status === 200, 'POST /api/matching/:id/verify returns HTTP 200');
    assert(verifyJson.status === 'confirmed', 'Match status verified as confirmed');

    // Verify report matchedMissingChildIds was updated
    const verifiedCaseSnap = await db.collection(COLLECTIONS.REPORTS).doc(createdCaseId).get();
    assert(verifiedCaseSnap.data().matchedMissingChildIds.includes(topCandidate.missingChildRecordId), 'Parent case matchedMissingChildIds contains verified child ID');

    // 9. Map & Location Endpoints
    console.log('\n--- Test 9: Map & Location ---');
    const mapRes = await fetch(`${BASE_URL}/api/map/incidents`, { headers: RESPONDER_AUTH });
    const mapJson = await mapRes.json();
    assert(mapRes.status === 200, 'GET /api/map/incidents returns HTTP 200');
    assert(mapJson.type === 'FeatureCollection', 'Incidents returned as GeoJSON FeatureCollection');
    assert(mapJson.features.length > 0, `Found ${mapJson.features.length} GeoJSON incident points`);

    const heatmapRes = await fetch(`${BASE_URL}/api/map/heatmap`, { headers: RESPONDER_AUTH });
    const heatmapJson = await heatmapRes.json();
    assert(heatmapRes.status === 200, 'GET /api/map/heatmap returns HTTP 200');
    assert(heatmapJson.zones.length > 0, `Heatmap includes ${heatmapJson.zones.length} aggregated zones`);

    // 10. Notifications
    console.log('\n--- Test 10: Notifications ---');
    const notifsRes = await fetch(`${BASE_URL}/api/notifications/usr-resp-01`, { headers: RESPONDER_AUTH });
    const notifsJson = await notifsRes.json();
    assert(notifsRes.status === 200, 'GET /api/notifications/:userId returns HTTP 200');

    if (notifsJson.notifications.length > 0) {
      const firstNotif = notifsJson.notifications[0];
      const readRes = await fetch(`${BASE_URL}/api/notifications/${firstNotif.id}/read`, {
        method: 'PATCH',
        headers: RESPONDER_AUTH
      });
      assert(readRes.status === 200, 'PATCH /api/notifications/:id/read returns HTTP 200');
    }

    // 11. Community Reporter Network
    console.log('\n--- Test 11: Community Reporter Network ---');
    const repRegisterRes = await fetch(`${BASE_URL}/api/reporters/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Gopal Joshi',
        phone: '+91 98333 44455',
        type: 'transit_worker',
        zone: 'Mumbai Central'
      })
    });
    const repRegisterJson = await repRegisterRes.json();
    assert(repRegisterRes.status === 201 || repRegisterRes.status === 200, 'POST /api/reporters/register succeeds');
    const registeredRepId = repRegisterJson.reporter.id;

    // Quick report
    const quickRes = await fetch(`${BASE_URL}/api/reporters/${registeredRepId}/quick-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'lost_child',
        description: 'Lost toddler crying outside ticket counter gate 3.',
        location: { lat: 18.9696, lng: 72.8193, addressText: 'Gate 3', zone: 'Mumbai Central' }
      })
    });
    const quickJson = await quickRes.json();
    assert(quickRes.status === 201, 'POST /api/reporters/:id/quick-report returns HTTP 201');
    assert(Boolean(quickJson.caseId), `Quick report created Case ID: ${quickJson.caseId}`);

    // Reporter history
    const historyRes = await fetch(`${BASE_URL}/api/reporters/${registeredRepId}/history`, { headers: ADMIN_AUTH });
    const historyJson = await historyRes.json();
    assert(historyRes.status === 200, 'GET /api/reporters/:id/history returns HTTP 200');
    assert(historyJson.cases.length >= 1, 'Reporter history includes submitted quick reports');

    // 12. Admin Analytics
    console.log('\n--- Test 12: Admin Analytics ---');
    const statsOverviewRes = await fetch(`${BASE_URL}/api/admin/stats/overview`, { headers: ADMIN_AUTH });
    assert(statsOverviewRes.status === 200, 'GET /api/admin/stats/overview returns HTTP 200');

    const statsPriorityRes = await fetch(`${BASE_URL}/api/admin/stats/by-priority`, { headers: ADMIN_AUTH });
    assert(statsPriorityRes.status === 200, 'GET /api/admin/stats/by-priority returns HTTP 200');

    const statsCatRes = await fetch(`${BASE_URL}/api/admin/stats/by-category`, { headers: ADMIN_AUTH });
    assert(statsCatRes.status === 200, 'GET /api/admin/stats/by-category returns HTTP 200');

    const statsLocRes = await fetch(`${BASE_URL}/api/admin/stats/by-location`, { headers: ADMIN_AUTH });
    assert(statsLocRes.status === 200, 'GET /api/admin/stats/by-location returns HTTP 200');

    const statsResTimeRes = await fetch(`${BASE_URL}/api/admin/stats/resolution-times`, { headers: ADMIN_AUTH });
    assert(statsResTimeRes.status === 200, 'GET /api/admin/stats/resolution-times returns HTTP 200');

    // 13. Demo Mode Reset
    console.log('\n--- Test 13: Demo Mode Reset ---');
    const resetRes = await fetch(`${BASE_URL}/api/demo/reset`, {
      method: 'POST',
      headers: ADMIN_AUTH
    });
    const resetJson = await resetRes.json();
    assert(resetRes.status === 200, 'POST /api/demo/reset returns HTTP 200');
    assert(resetJson.scenarios.length === 3, 'Reseeded exactly 3 required hackathon scenarios');

    // Verify 3 scenarios in database
    const seededCase1 = await db.collection(COLLECTIONS.REPORTS).doc('RAK-LST01').get();
    const seededCase2 = await db.collection(COLLECTIONS.REPORTS).doc('RAK-UNA02').get();
    const seededCase3 = await db.collection(COLLECTIONS.REPORTS).doc('RAK-TRF03').get();

    assert(seededCase1.exists, 'Scenario 1 (Lost/Distressed Child: RAK-LST01) exists');
    assert(seededCase2.exists, 'Scenario 2 (Unaccompanied Child: RAK-UNA02) exists');
    assert(seededCase3.exists, 'Scenario 3 (Trafficking Concern: RAK-TRF03) exists');

  } catch (err) {
    console.error('Fatal Test Exception:', err);
    failed++;
  } finally {
    console.log(`\n======================================================`);
    console.log(`Test Results: ${passed} PASSED | ${failed} FAILED`);
    console.log(`======================================================\n`);
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Give server time to bind before starting requests
setTimeout(runTests, 1000);
