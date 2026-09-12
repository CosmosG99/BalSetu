import { Router } from 'express';
import { db, COLLECTIONS } from '../models/db.js';
import { trackingRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

/**
 * GET /api/track/:caseId (public, rate-limited)
 * Safe citizen case tracking view
 *
 * NON-NEGOTIABLE PRIVACY CONSTRAINTS (Section 6):
 * - Returns ONLY { status, timelinePublic, category }
 * - Strictly NEVER exposes:
 *   - exact GPS coordinates / addressText
 *   - internal notes
 *   - AI triage classifications or confidence
 *   - responder identity, names, or phone numbers
 *   - reporter PII
 */
router.get('/:caseId', trackingRateLimiter, async (req, res) => {
  try {
    const { caseId } = req.params;

    if (!caseId || caseId.trim() === '') {
      return res.status(400).json({
        error: {
          code: 'INVALID_CASE_ID',
          message: 'Valid Case ID is required for tracking.'
        }
      });
    }

    const snap = await db.collection(COLLECTIONS.REPORTS).doc(caseId.toUpperCase()).get();

    if (!snap.exists) {
      return res.status(404).json({
        error: {
          code: 'CASE_NOT_FOUND',
          message: `No active case found matching identifier ${caseId}.`
        }
      });
    }

    const caseData = snap.data();

    // Sanitize timeline entries: remove actorId and any internal notes
    const timelinePublic = (caseData.timeline || []).map(entry => ({
      status: entry.status,
      note: entry.note,
      at: entry.at
    }));

    // Return strictly sanitized public response
    return res.status(200).json({
      caseId: caseData.id,
      status: caseData.status,
      category: caseData.category,
      timelinePublic,
      createdAt: caseData.createdAt,
      updatedAt: caseData.updatedAt
    });
  } catch (error) {
    console.error('Error tracking case:', error);
    return res.status(500).json({
      error: {
        code: 'TRACKING_ERROR',
        message: 'Unable to retrieve case tracking status.'
      }
    });
  }
});

export default router;
