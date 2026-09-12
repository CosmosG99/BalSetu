import { Router } from 'express';
import { db, COLLECTIONS, currentTimestamp } from '../models/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { UpdateCaseSchema } from '../models/schemas.js';
import { recordAuditLog, auditAction } from '../middleware/auditLog.js';
import { notificationBus } from '../services/notifications.js';

const router = Router();

// Protect all case management routes with authentication
router.use(authenticate, requireRole('responder', 'admin', 'superadmin'));

/**
 * GET /api/cases (responder/admin)
 * Filterable list (status, priority, category, zone)
 */
router.get('/', async (req, res) => {
  try {
    const { status, priority, category, zone, limit = 50 } = req.query;
    let query = db.collection(COLLECTIONS.REPORTS);

    if (status) {
      query = query.where('status', '==', status);
    }
    if (priority) {
      query = query.where('priority', '==', priority);
    }
    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.limit(Number(limit)).get();
    let cases = [];

    snapshot.forEach(docSnap => {
      cases.push(docSnap.data());
    });

    // In-memory filter for zone if nested
    if (zone) {
      const targetZone = String(zone).toLowerCase();
      cases = cases.filter(c => (c.location?.zone || '').toLowerCase().includes(targetZone));
    }

    return res.status(200).json({
      cases,
      total: cases.length
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    return res.status(500).json({
      error: {
        code: 'CASES_FETCH_FAILED',
        message: error.message || 'Failed to fetch cases'
      }
    });
  }
});

/**
 * GET /api/cases/:id (responder/admin)
 * Detailed case view, logs PII access to auditLogs
 */
router.get('/:id', auditAction('VIEW_CASE_PII', 'case'), async (req, res) => {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTIONS.REPORTS).doc(id).get();

    if (!snap.exists) {
      return res.status(404).json({
        error: {
          code: 'CASE_NOT_FOUND',
          message: `Case ${id} does not exist.`
        }
      });
    }

    return res.status(200).json(snap.data());
  } catch (error) {
    console.error('Error retrieving case:', error);
    return res.status(500).json({
      error: {
        code: 'CASE_RETRIEVAL_FAILED',
        message: error.message || 'Failed to retrieve case details'
      }
    });
  }
});

/**
 * PATCH /api/cases/:id (responder/admin)
 * Updates case: status change, assign/reassign, escalate, add internal note
 * Appends to timeline and writes to auditLogs
 */
router.patch('/:id', validate(UpdateCaseSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedResponderId, escalate, internalNote, timelineNote } = req.body;
    const actorId = req.user.id;
    const now = currentTimestamp();

    const caseRef = db.collection(COLLECTIONS.REPORTS).doc(id);
    const snap = await caseRef.get();

    if (!snap.exists) {
      return res.status(404).json({
        error: {
          code: 'CASE_NOT_FOUND',
          message: `Case ${id} not found.`
        }
      });
    }

    const currentCase = snap.data();
    const updates = { updatedAt: now };
    const timelineEntries = [];
    let auditActionName = 'UPDATE_CASE';

    // Status update
    if (status && status !== currentCase.status) {
      updates.status = status;
      timelineEntries.push({
        status,
        actorId,
        note: timelineNote || `Status changed from ${currentCase.status} to ${status} by ${req.user.name}`,
        at: now
      });
      auditActionName = `STATUS_CHANGE_TO_${status.toUpperCase()}`;

      notificationBus.emit('status_update', {
        caseId: id,
        responderId: currentCase.assignedResponderId,
        status
      });
    }

    // Priority update
    if (priority && priority !== currentCase.priority) {
      updates.priority = priority;
      timelineEntries.push({
        status: currentCase.status,
        actorId,
        note: `Priority adjusted to ${priority.toUpperCase()}`,
        at: now
      });
    }

    // Assign / Reassign
    if (assignedResponderId !== undefined && assignedResponderId !== currentCase.assignedResponderId) {
      updates.assignedResponderId = assignedResponderId;
      updates.status = 'assigned';
      timelineEntries.push({
        status: 'assigned',
        actorId,
        note: `Assigned to responder ID ${assignedResponderId}`,
        at: now
      });
      auditActionName = 'CASE_ASSIGNED';

      notificationBus.emit('assignment', {
        caseId: id,
        responderId: assignedResponderId,
        priority: updates.priority || currentCase.priority || 'medium'
      });
    }

    // Escalate
    if (escalate) {
      updates.status = 'escalated';
      updates.priority = 'critical';
      timelineEntries.push({
        status: 'escalated',
        actorId,
        note: timelineNote || `URGENT: Case escalated by ${req.user.name}.`,
        at: now
      });
      auditActionName = 'CASE_ESCALATED';

      notificationBus.emit('escalation', {
        caseId: id,
        adminIds: ['usr-admin-01']
      });
    }

    // Internal Note
    if (internalNote) {
      const newInternalNote = {
        authorId: actorId,
        note: internalNote,
        at: now
      };
      updates.internalNotes = [...(currentCase.internalNotes || []), newInternalNote];
      auditActionName = 'ADDED_INTERNAL_NOTE';
    }

    // Update timeline if new entries exist
    if (timelineEntries.length > 0) {
      updates.timeline = [...(currentCase.timeline || []), ...timelineEntries];
    }

    await caseRef.update(updates);

    // Record audit log
    await recordAuditLog({
      actorId,
      action: auditActionName,
      entityType: 'case',
      entityId: id
    });

    const updatedSnap = await caseRef.get();
    return res.status(200).json({
      message: 'Case updated successfully',
      case: updatedSnap.data()
    });
  } catch (error) {
    console.error('Error updating case:', error);
    return res.status(500).json({
      error: {
        code: 'CASE_UPDATE_FAILED',
        message: error.message || 'Failed to update case'
      }
    });
  }
});

/**
 * GET /api/cases/:id/timeline (responder/admin)
 * Retrieve timeline history for a case
 */
router.get('/:id/timeline', async (req, res) => {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTIONS.REPORTS).doc(id).get();

    if (!snap.exists) {
      return res.status(404).json({
        error: {
          code: 'CASE_NOT_FOUND',
          message: `Case ${id} not found.`
        }
      });
    }

    const caseData = snap.data();
    return res.status(200).json({
      caseId: id,
      timeline: caseData.timeline || []
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'TIMELINE_FETCH_FAILED',
        message: error.message
      }
    });
  }
});

export default router;
