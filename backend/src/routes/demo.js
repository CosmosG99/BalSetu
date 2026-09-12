import { Router } from 'express';
import { seedDemoData } from '../scripts/seedDemo.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { recordAuditLog } from '../middleware/auditLog.js';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

/**
 * POST /api/demo/reset (admin only, guarded by DEMO_MODE=true)
 * Wipes and reseeds Firestore with 3 realistic hackathon demo scenarios,
 * synthetic missing child records, responders, and reporters.
 */
router.post('/reset', authenticate, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const isDemoMode = process.env.DEMO_MODE === 'true' || (process.env.NODE_ENV || 'development') === 'development';

    if (!isDemoMode) {
      return res.status(403).json({
        error: {
          code: 'DEMO_MODE_DISABLED',
          message: 'Demo database reset is only permissible when DEMO_MODE=true in environment settings.'
        }
      });
    }

    const stats = await seedDemoData();

    await recordAuditLog({
      actorId: req.user.id,
      action: 'DEMO_DATABASE_RESET',
      entityType: 'system',
      entityId: 'firestore-reset'
    });

    return res.status(200).json({
      message: 'Demo database wiped and reseeded successfully with 3 official hackathon scenarios.',
      scenarios: [
        { id: 'RAK-LST01', type: 'Lost / Distressed Child', location: 'Mumbai Central Platform 4' },
        { id: 'RAK-UNA02', type: 'Unaccompanied Child', location: 'Pune Swargate Bus Terminal' },
        { id: 'RAK-TRF03', type: 'Potential Trafficking Concern', location: 'Dadar Central Station' }
      ],
      stats
    });
  } catch (error) {
    console.error('Error resetting demo database:', error);
    return res.status(500).json({
      error: {
        code: 'DEMO_RESET_FAILED',
        message: error.message || 'Demo reset encountered an unexpected error.'
      }
    });
  }
});

export default router;
