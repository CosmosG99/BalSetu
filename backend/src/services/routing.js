import { db, COLLECTIONS, currentTimestamp } from '../models/db.js';
import { recordAuditLog } from '../middleware/auditLog.js';
import { notificationBus } from './notifications.js';

/**
 * Priority weighting for sorting
 */
const PRIORITY_SCORES = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

/**
 * Smart Responder Routing Engine
 * Matches active responders by zone, specialization tags, and lowest current caseload.
 * Assigns top matching responder and fires notifications.
 *
 * @param {string} caseId - Target Case ID
 * @param {string} actorId - ID of actor triggering routing (admin or 'system')
 */
export async function autoRouteCase(caseId, actorId = 'system') {
  // 1. Fetch case
  const caseRef = db.collection(COLLECTIONS.REPORTS).doc(caseId);
  const caseSnap = await caseRef.get();

  if (!caseSnap.exists) {
    throw new Error(`Case ${caseId} not found`);
  }

  const caseData = caseSnap.data();

  // 2. Fetch all active responders
  const usersSnap = await db.collection(COLLECTIONS.USERS)
    .where('active', '==', true)
    .where('role', '==', 'responder')
    .get();

  if (usersSnap.empty) {
    throw new Error('No active responders available in system');
  }

  const availableResponders = [];
  usersSnap.forEach(snap => availableResponders.push(snap.data()));

  const reportZone = (caseData.location?.zone || '').trim().toLowerCase();
  const reportCategory = caseData.category || 'other';

  // 3. Score responders:
  // - Zone match: +10 points
  // - Specialization match: +5 points
  // - Current caseload: -2 points per active case (favor lowest caseload)
  const scoredResponders = availableResponders.map(resp => {
    let score = 0;
    const respZone = (resp.zone || '').trim().toLowerCase();
    const isZoneMatch = respZone === reportZone || reportZone.includes(respZone) || respZone.includes(reportZone);
    if (isZoneMatch) score += 10;

    const specs = Array.isArray(resp.specialization) ? resp.specialization : [];
    if (specs.includes(reportCategory) || specs.includes('all')) {
      score += 5;
    }

    const caseload = typeof resp.currentCaseload === 'number' ? resp.currentCaseload : 0;
    score -= caseload * 2;

    return {
      responder: resp,
      score,
      caseload,
      isZoneMatch
    };
  });

  // Sort descending by score; if tied, ascending by caseload
  scoredResponders.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.caseload - b.caseload;
  });

  const bestMatch = scoredResponders[0].responder;

  // 4. Update case
  const now = currentTimestamp();
  const timelineEntry = {
    status: 'assigned',
    actorId,
    note: `Auto-routed to responder ${bestMatch.name} (Zone: ${bestMatch.zone}) based on workload & proximity.`,
    at: now
  };

  const updatedTimeline = [...(caseData.timeline || []), timelineEntry];

  await caseRef.update({
    assignedResponderId: bestMatch.id,
    status: 'assigned',
    timeline: updatedTimeline,
    updatedAt: now
  });

  // 5. Increment responder caseload
  const newCaseload = (bestMatch.currentCaseload || 0) + 1;
  await db.collection(COLLECTIONS.USERS).doc(bestMatch.id).update({
    currentCaseload: newCaseload
  });

  // 6. Record audit log
  await recordAuditLog({
    actorId,
    action: 'AUTO_ROUTE_ASSIGNED',
    entityType: 'case',
    entityId: caseId
  });

  // 7. Emit notification
  notificationBus.emit('assignment', {
    caseId,
    responderId: bestMatch.id,
    priority: caseData.priority || 'medium'
  });

  return {
    success: true,
    assignedResponder: {
      id: bestMatch.id,
      name: bestMatch.name,
      zone: bestMatch.zone,
      phone: bestMatch.phone,
      caseload: newCaseload
    },
    caseId,
    status: 'assigned'
  };
}
