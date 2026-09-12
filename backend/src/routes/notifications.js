import { Router } from 'express';
import { db, COLLECTIONS } from '../models/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Require authentication for notification access
router.use(authenticate);

/**
 * GET /api/notifications/:userId
 * Retrieves notification stream for a specific responder or admin
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Security check: users can only fetch their own notifications unless admin
    if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Cannot access notifications belonging to another user.'
        }
      });
    }

    const snap = await db.collection(COLLECTIONS.NOTIFICATIONS)
      .where('userId', '==', userId)
      .get();

    const notifications = [];
    snap.forEach(docSnap => notifications.push(docSnap.data()));

    return res.status(200).json({
      userId,
      notifications,
      unreadCount: notifications.filter(n => !n.read).length
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'NOTIFICATIONS_FETCH_FAILED',
        message: error.message
      }
    });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Marks a notification as read
 */
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notifRef = db.collection(COLLECTIONS.NOTIFICATIONS).doc(id);
    const snap = await notifRef.get();

    if (!snap.exists) {
      return res.status(404).json({
        error: {
          code: 'NOTIFICATION_NOT_FOUND',
          message: `Notification ${id} does not exist.`
        }
      });
    }

    await notifRef.update({
      read: true
    });

    return res.status(200).json({
      message: 'Notification marked as read',
      id,
      read: true
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'NOTIFICATION_UPDATE_FAILED',
        message: error.message
      }
    });
  }
});

export default router;
