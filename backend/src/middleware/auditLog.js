import { db, COLLECTIONS, currentTimestamp } from '../models/db.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Record an entry into the auditLogs collection
 * @param {Object} entry - { actorId, action, entityType, entityId }
 */
export async function recordAuditLog({ actorId, action, entityType, entityId }) {
  try {
    const id = `audit-${uuidv4().substring(0, 8)}`;
    const logDoc = {
      id,
      actorId: actorId || null,
      action,
      entityType,
      entityId,
      at: currentTimestamp()
    };
    await db.collection(COLLECTIONS.AUDIT_LOGS).doc(id).set(logDoc);
    return logDoc;
  } catch (error) {
    console.error('⚠️ Failed to record audit log:', error.message);
  }
}

/**
 * Express middleware to record audit log for case access or modification
 * @param {string} action - e.g. 'VIEW_CASE_PII', 'UPDATE_CASE_STATUS'
 */
export function auditAction(action, entityType = 'case') {
  return async (req, res, next) => {
    // Call next first, then log asynchronously so as not to block response
    res.on('finish', async () => {
      if (res.statusCode < 400) {
        const actorId = req.user?.uid || req.user?.id || null;
        const entityId = req.params.id || req.params.caseId || req.body?.caseId || 'unknown';
        await recordAuditLog({
          actorId,
          action,
          entityType,
          entityId
        });
      }
    });
    next();
  };
}
