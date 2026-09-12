import EventEmitter from 'events';
import admin from 'firebase-admin';
import { db, COLLECTIONS, currentTimestamp } from '../models/db.js';
import { isLiveFirebase } from '../config/firebase.js';
import { translate } from '../middleware/i18n.js';
import { v4 as uuidv4 } from 'uuid';

export const notificationBus = new EventEmitter();

/**
 * Persist notification and dispatch FCM push if available
 */
export async function sendNotification({ userId, type, caseId, params = {}, customMessage = null }) {
  try {
    const id = `notif-${uuidv4().substring(0, 8)}`;
    const message = customMessage || translate(`notifications.${type}`, { caseId, ...params });

    const notifDoc = {
      id,
      userId,
      type,
      caseId,
      message,
      read: false,
      createdAt: currentTimestamp()
    };

    await db.collection(COLLECTIONS.NOTIFICATIONS).doc(id).set(notifDoc);

    // FCM Push dispatch
    if (isLiveFirebase && admin.messaging) {
      try {
        await admin.messaging().send({
          topic: `user-${userId}`,
          notification: {
            title: `RAKSHAK Alert: ${type.toUpperCase()}`,
            body: message
          },
          data: {
            caseId: String(caseId),
            type: String(type)
          }
        });
      } catch (fcmError) {
        // FCM could fail if user has no registered FCM token or topic; log non-fatally
        console.log(`ℹ️ FCM push notification skipped for ${userId}: ${fcmError.message}`);
      }
    } else {
      console.log(`🔔 [NOTIFICATION DISPATCHED] -> User: ${userId} | Type: ${type} | Case: ${caseId} | Message: ${message}`);
    }

    return notifDoc;
  } catch (err) {
    console.error('❌ Notification creation failed:', err.message);
  }
}

// Event bus handlers
notificationBus.on('new_case', async ({ caseId, zone, responderIds = [] }) => {
  for (const responderId of responderIds) {
    await sendNotification({
      userId: responderId,
      type: 'new_case',
      caseId,
      params: { zone }
    });
  }
});

notificationBus.on('assignment', async ({ caseId, responderId, priority }) => {
  await sendNotification({
    userId: responderId,
    type: 'assignment',
    caseId,
    params: { priority }
  });
});

notificationBus.on('status_update', async ({ caseId, responderId, status }) => {
  if (responderId) {
    await sendNotification({
      userId: responderId,
      type: 'status_update',
      caseId,
      params: { status }
    });
  }
});

notificationBus.on('escalation', async ({ caseId, adminIds = [] }) => {
  for (const adminId of adminIds) {
    await sendNotification({
      userId: adminId,
      type: 'escalation',
      caseId
    });
  }
});
