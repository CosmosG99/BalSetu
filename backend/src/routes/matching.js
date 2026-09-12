import { Router } from 'express';
import { db, COLLECTIONS, currentTimestamp } from '../models/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { VerifyMatchSchema } from '../models/schemas.js';
import { runMissingChildMatching } from '../services/matching.js';
import { recordAuditLog } from '../middleware/auditLog.js';

const router = Router();

// Missing-child matching is restricted to authorized responders and admins
router.use(authenticate, requireRole('responder', 'admin', 'superadmin'));

/**
 * POST /api/matching/run/:reportId (responder/admin)
 * Runs face embedding cosine matching against synthetic missingChildRecords
 */
router.post('/run/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    const matches = await runMissingChildMatching(reportId);

    await recordAuditLog({
      actorId: req.user.id,
      action: 'RUN_MISSING_CHILD_MATCHING',
      entityType: 'case',
      entityId: reportId
    });

    return res.status(200).json({
      reportId,
      matchCount: matches.length,
      candidates: matches,
      message: `Generated ${matches.length} potential matching candidates. Human verification required.`
    });
  } catch (error) {
    console.error('Error running matching:', error);
    return res.status(500).json({
      error: {
        code: 'MATCHING_FAILED',
        message: error.message || 'Failed to run matching analysis'
      }
    });
  }
});

/**
 * GET /api/matching/:reportId/candidates (responder/admin)
 * Retrieves all match candidates generated for a given report
 */
router.get('/:reportId/candidates', async (req, res) => {
  try {
    const { reportId } = req.params;

    const matchesSnap = await db.collection(COLLECTIONS.MATCHES)
      .where('reportId', '==', reportId)
      .get();

    const candidates = [];

    for (const matchDoc of matchesSnap.docs) {
      const match = matchDoc.data();
      let recordDetails = null;

      try {
        const recSnap = await db.collection(COLLECTIONS.MISSING_CHILDREN)
          .doc(match.missingChildRecordId)
          .get();

        if (recSnap.exists) {
          const rec = recSnap.data();
          recordDetails = {
            id: rec.id,
            ageApprox: rec.ageApprox,
            photoUrl: rec.photoUrl,
            lastSeenLocation: rec.lastSeenLocation,
            lastSeenDate: rec.lastSeenDate,
            descriptionInternal: rec.descriptionInternal, // Responders/admins authorized to view
            status: rec.status
          };
        }
      } catch {
        // Continue if record lookup fails
      }

      candidates.push({
        ...match,
        missingChildRecord: recordDetails
      });
    }

    // Sort descending by similarity score
    candidates.sort((a, b) => b.similarityScore - a.similarityScore);

    return res.status(200).json({
      reportId,
      candidates,
      total: candidates.length
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'CANDIDATES_FETCH_FAILED',
        message: error.message
      }
    });
  }
});

/**
 * POST /api/matching/:matchId/verify (responder/admin)
 * Human verification decision on a match candidate (confirmed or rejected)
 * Non-negotiable rule: only a 'confirmed' match updates report.matchedMissingChildIds
 */
router.post('/:matchId/verify', validate(VerifyMatchSchema), async (req, res) => {
  try {
    const { matchId } = req.params;
    const { status, notes } = req.body;
    const actorId = req.user.id;
    const now = currentTimestamp();

    const matchRef = db.collection(COLLECTIONS.MATCHES).doc(matchId);
    const matchSnap = await matchRef.get();

    if (!matchSnap.exists) {
      return res.status(404).json({
        error: {
          code: 'MATCH_NOT_FOUND',
          message: `Match record ${matchId} not found.`
        }
      });
    }

    const matchData = matchSnap.data();

    // 1. Update match document
    await matchRef.update({
      status,
      verifiedBy: actorId,
      verificationNotes: notes || null,
      verifiedAt: now
    });

    // 2. If status is 'confirmed', update the parent report's matchedMissingChildIds
    if (status === 'confirmed') {
      const caseRef = db.collection(COLLECTIONS.REPORTS).doc(matchData.reportId);
      const caseSnap = await caseRef.get();

      if (caseSnap.exists) {
        const caseData = caseSnap.data();
        const existingMatchedIds = caseData.matchedMissingChildIds || [];

        if (!existingMatchedIds.includes(matchData.missingChildRecordId)) {
          const updatedMatchedIds = [...existingMatchedIds, matchData.missingChildRecordId];
          const timelineEntry = {
            status: caseData.status,
            actorId,
            note: `Verified missing child match: Record #${matchData.missingChildRecordId} confirmed with similarity ${(matchData.similarityScore * 100).toFixed(1)}% by ${req.user.name}.`,
            at: now
          };

          await caseRef.update({
            matchedMissingChildIds: updatedMatchedIds,
            timeline: [...(caseData.timeline || []), timelineEntry],
            updatedAt: now
          });
        }
      }
    }

    // 3. Record audit log
    await recordAuditLog({
      actorId,
      action: `MATCH_VERIFICATION_${status.toUpperCase()}`,
      entityType: 'match',
      entityId: matchId
    });

    return res.status(200).json({
      message: `Match candidate successfully marked as ${status}.`,
      matchId,
      status,
      verifiedBy: actorId
    });
  } catch (error) {
    console.error('Error verifying match:', error);
    return res.status(500).json({
      error: {
        code: 'VERIFICATION_FAILED',
        message: error.message || 'Failed to record match verification'
      }
    });
  }
});

export default router;
