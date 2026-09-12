import { Router } from 'express';
import { db, COLLECTIONS, currentTimestamp, generateCaseId } from '../models/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { RegisterReporterSchema, QuickReportSchema } from '../models/schemas.js';
import { runTriage } from '../services/triage.js';
import { autoRouteCase } from '../services/routing.js';
import { recordAuditLog } from '../middleware/auditLog.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

/**
 * POST /api/reporters/register
 * Registers a community volunteer or transit hub worker into the trusted network
 */
router.post('/register', validate(RegisterReporterSchema), async (req, res) => {
  try {
    const { name, phone, type, zone } = req.body;

    // Check if phone already registered
    const existingSnap = await db.collection(COLLECTIONS.REPORTERS).where('phone', '==', phone).get();
    if (!existingSnap.empty) {
      return res.status(200).json({
        message: 'Reporter already registered',
        reporter: existingSnap.docs[0].data()
      });
    }

    const reporterId = `rep-${uuidv4().substring(0, 8)}`;
    const reporterDoc = {
      id: reporterId,
      name,
      phone,
      type,
      verified: true, // Trusted transit/community network default
      zone,
      reportCount: 0,
      createdAt: currentTimestamp()
    };

    await db.collection(COLLECTIONS.REPORTERS).doc(reporterId).set(reporterDoc);

    await recordAuditLog({
      actorId: null,
      action: 'REGISTER_REPORTER',
      entityType: 'reporter',
      entityId: reporterId
    });

    return res.status(201).json({
      message: 'Reporter registered successfully',
      reporter: reporterDoc
    });
  } catch (error) {
    console.error('Error registering reporter:', error);
    return res.status(500).json({
      error: {
        code: 'REPORTER_REGISTRATION_FAILED',
        message: error.message
      }
    });
  }
});

/**
 * POST /api/reporters/:id/quick-report
 * Fast reporting pipeline for on-duty station workers/volunteers with reporter pre-filled
 */
router.post('/:id/quick-report', validate(QuickReportSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { category, description, location, photoUrl, clientReportId } = req.body;

    const repSnap = await db.collection(COLLECTIONS.REPORTERS).doc(id).get();
    if (!repSnap.exists) {
      return res.status(404).json({
        error: {
          code: 'REPORTER_NOT_FOUND',
          message: `Reporter ${id} not found.`
        }
      });
    }

    const reporter = repSnap.data();
    const caseId = generateCaseId();
    const now = currentTimestamp();

    const reportDoc = {
      id: caseId,
      clientReportId: clientReportId || `quick-${uuidv4()}`,
      source: 'volunteer',
      anonymous: false,
      reporterId: id, // Retained because reporter is a verified volunteer
      category,
      description,
      language: 'en',
      location: {
        lat: location.lat,
        lng: location.lng,
        addressText: location.addressText,
        zone: location.zone || reporter.zone
      },
      photoUrl: photoUrl || null,
      status: 'new',
      priority: null,
      aiTriage: null,
      assignedResponderId: null,
      matchedMissingChildIds: [],
      timeline: [
        {
          status: 'new',
          actorId: id,
          note: `Quick report submitted by ${reporter.type} ${reporter.name} (${reporter.zone}).`,
          at: now
        }
      ],
      internalNotes: [],
      createdAt: now,
      updatedAt: now
    };

    // Save report
    await db.collection(COLLECTIONS.REPORTS).doc(caseId).set(reportDoc);

    // Increment reporter count
    const updatedCount = (reporter.reportCount || 0) + 1;
    await db.collection(COLLECTIONS.REPORTERS).doc(id).update({
      reportCount: updatedCount
    });

    // Run AI Triage
    try {
      const triage = await runTriage(reportDoc);
      reportDoc.aiTriage = triage;
      reportDoc.priority = triage.priority;

      await db.collection(COLLECTIONS.REPORTS).doc(caseId).update({
        aiTriage: triage,
        priority: triage.priority,
        updatedAt: currentTimestamp()
      });
    } catch (triageErr) {
      console.error('Triage error during quick report:', triageErr.message);
    }

    // Attempt Auto-routing
    try {
      await autoRouteCase(caseId, `reporter-${id}`);
    } catch (routeErr) {
      console.log(`Auto-routing deferred for quick report ${caseId}: ${routeErr.message}`);
    }

    await recordAuditLog({
      actorId: id,
      action: 'SUBMIT_QUICK_REPORT',
      entityType: 'case',
      entityId: caseId
    });

    return res.status(201).json({
      caseId,
      status: 'created',
      message: 'Quick incident report submitted successfully.',
      reporterName: reporter.name,
      totalReportsByReporter: updatedCount
    });
  } catch (error) {
    console.error('Error in quick report:', error);
    return res.status(500).json({
      error: {
        code: 'QUICK_REPORT_FAILED',
        message: error.message
      }
    });
  }
});

/**
 * GET /api/reporters/:id/history (admin only)
 * Fetches submission history and verified details of a community reporter
 */
router.get('/:id/history', authenticate, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const { id } = req.params;

    const repSnap = await db.collection(COLLECTIONS.REPORTERS).doc(id).get();
    if (!repSnap.exists) {
      return res.status(404).json({
        error: {
          code: 'REPORTER_NOT_FOUND',
          message: `Reporter ${id} not found.`
        }
      });
    }

    const reporter = repSnap.data();

    // Query reports submitted by this reporter
    const casesSnap = await db.collection(COLLECTIONS.REPORTS)
      .where('reporterId', '==', id)
      .get();

    const history = [];
    casesSnap.forEach(docSnap => history.push(docSnap.data()));

    return res.status(200).json({
      reporter,
      cases: history,
      totalCases: history.length
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'HISTORY_FETCH_FAILED',
        message: error.message
      }
    });
  }
});

export default router;
