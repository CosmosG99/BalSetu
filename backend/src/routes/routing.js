import { Router } from 'express';
import { autoRouteCase } from '../services/routing.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

/**
 * POST /api/cases/:id/auto-route (admin/responder/system)
 * Executes automated smart responder assignment based on zone proximity and caseload
 */
router.post('/cases/:id/auto-route', authenticate, requireRole('admin', 'superadmin', 'responder'), async (req, res) => {
  try {
    const { id } = req.params;
    const actorId = req.user.id;

    const result = await autoRouteCase(id, actorId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Auto-routing endpoint error:', error);
    return res.status(500).json({
      error: {
        code: 'AUTO_ROUTE_FAILED',
        message: error.message || 'Auto-routing could not be completed'
      }
    });
  }
});

export default router;
