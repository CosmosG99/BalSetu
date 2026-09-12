import { Router } from 'express';
import { db, COLLECTIONS, currentTimestamp, generateCaseId } from '../models/db.js';
import { CreateReportSchema, SyncReportsSchema } from '../models/schemas.js';
import { validate } from '../middleware/validate.js';
import { reportsRateLimiter } from '../middleware/rateLimit.js';
import { runTriage } from '../services/triage.js';
import { autoRouteCase } from '../services/routing.js';
import { recordAuditLog } from '../middleware/auditLog.js';

const router = Router();

/**
 * Unified internal function to create a report document with idempotency and AI triage
 */
async function processReportCreation(reportInput) {
  const {
    category,
    description,
    location,
    photo,
    photoUrl,
    anonymous,
    reporterId,
    language = 'en',
    clientReportId,
    source = 'web'
  } = reportInput;

  // 1. Idempotency check via clientReportId
  if (clientReportId) {
    const existingSnap = await db.collection(COLLECTIONS.REPORTS)
      .where('clientReportId', '==', clientReportId)
      .get();

    if (!existingSnap.empty) {
      const existingDoc = existingSnap.docs[0].data();
      return {
        caseId: existingDoc.id,
        isDuplicate: true,
        report: existingDoc
      };
    }
  }

  // 2. Build report document
  const caseId = generateCaseId();
  const now = currentTimestamp();

  const reportDoc = {
    id: caseId,
    clientReportId,
    source,
    anonymous,
    category,
    description, // User description stored exactly as entered, never auto-translated
    language,
    location: {
      lat: location.lat,
      lng: location.lng,
      addressText: location.addressText,
      zone: location.zone
    },
    photoUrl: photoUrl || photo || null,
    status: 'new',
    priority: null,
    aiTriage: null,
    assignedResponderId: null,
    matchedMissingChildIds: [],
    timeline: [
      {
        status: 'new',
        actorId: anonymous ? 'anonymous-citizen' : (reporterId || 'citizen'),
        note: `Incident report filed via ${source}. Initial status is NEW.`,
        at: now
      }
    ],
    internalNotes: [],
    createdAt: now,
    updatedAt: now
  };

  // NON-NEGOTIABLE PRIVACY RULE:
  // Anonymous reports (anonymous: true) must store NO reporter-identifying field,
  // not even a null placeholder — omit reporterId entirely.
  if (!anonymous && reporterId) {
    reportDoc.reporterId = reporterId;
  }

  // 3. Save report to Firestore
  await db.collection(COLLECTIONS.REPORTS).doc(caseId).set(reportDoc);

  // 4. Synchronously execute AI-Assisted Triage
  try {
    const triageResult = await runTriage(reportDoc);
    reportDoc.aiTriage = triageResult;
    reportDoc.priority = triageResult.priority;

    await db.collection(COLLECTIONS.REPORTS).doc(caseId).update({
      aiTriage: triageResult,
      priority: triageResult.priority,
      updatedAt: currentTimestamp()
    });
  } catch (triageError) {
    console.error('Triage error on report creation:', triageError.message);
  }

  // 5. Trigger Smart Routing
  try {
    await autoRouteCase(caseId, 'system-intake');
  } catch (routingError) {
    console.log(`Auto-routing deferred for case ${caseId}: ${routingError.message}`);
  }

  // 6. Record Audit Log
  await recordAuditLog({
    actorId: anonymous ? null : (reporterId || null),
    action: 'CREATE_REPORT',
    entityType: 'case',
    entityId: caseId
  });

  return {
    caseId,
    isDuplicate: false,
    report: reportDoc
  };
}

/**
 * POST /api/reports (public, rate-limited)
 * Create an incident report
 */
router.post('/', reportsRateLimiter, validate(CreateReportSchema), async (req, res) => {
  try {
    const result = await processReportCreation(req.body);
    return res.status(result.isDuplicate ? 200 : 201).json({
      caseId: result.caseId,
      status: result.isDuplicate ? 'existing' : 'created',
      message: result.isDuplicate
        ? 'Report with this clientReportId was already registered.'
        : 'Report registered successfully and routed for triage.'
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return res.status(500).json({
      error: {
        code: 'REPORT_CREATION_FAILED',
        message: error.message || 'Failed to create report'
      }
    });
  }
});

/**
 * POST /api/reports/sync (public, rate-limited)
 * Batch-accept queued offline drafts with idempotency guarantees
 */
router.post('/sync', reportsRateLimiter, validate(SyncReportsSchema), async (req, res) => {
  try {
    const { reports } = req.body;
    const results = [];

    for (const reportItem of reports) {
      const outcome = await processReportCreation(reportItem);
      results.push({
        clientReportId: reportItem.clientReportId,
        caseId: outcome.caseId,
        isDuplicate: outcome.isDuplicate
      });
    }

    return res.status(200).json({
      synced: results,
      total: results.length,
      message: `Successfully processed ${results.length} offline report drafts.`
    });
  } catch (error) {
    console.error('Error syncing reports:', error);
    return res.status(500).json({
      error: {
        code: 'SYNC_FAILED',
        message: error.message || 'Failed to synchronize reports'
      }
    });
  }
});

export default router;
