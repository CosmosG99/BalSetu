import { Router } from 'express';
import { db, COLLECTIONS } from '../models/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// Protect all dashboard endpoints
router.use(authenticate, requireRole('responder', 'admin', 'superadmin'));

/**
 * GET /api/dashboard/new
 * Fetches all unhandled cases with status 'new'
 */
router.get('/new', async (req, res) => {
  try {
    const snap = await db.collection(COLLECTIONS.REPORTS)
      .where('status', '==', 'new')
      .get();

    const cases = [];
    snap.forEach(docSnap => cases.push(docSnap.data()));

    return res.status(200).json({
      cases,
      total: cases.length
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'DASHBOARD_NEW_FAILED',
        message: error.message
      }
    });
  }
});

/**
 * GET /api/dashboard/high-priority
 * Fetches all cases with priority 'high' or 'critical'
 */
router.get('/high-priority', async (req, res) => {
  try {
    const snapAll = await db.collection(COLLECTIONS.REPORTS).get();
    const cases = [];

    snapAll.forEach(docSnap => {
      const c = docSnap.data();
      if (c.priority === 'high' || c.priority === 'critical') {
        cases.push(c);
      }
    });

    // Sort descending by priority weight
    const weight = { critical: 2, high: 1 };
    cases.sort((a, b) => (weight[b.priority] || 0) - (weight[a.priority] || 0));

    return res.status(200).json({
      cases,
      total: cases.length
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'DASHBOARD_PRIORITY_FAILED',
        message: error.message
      }
    });
  }
});

/**
 * GET /api/dashboard/assigned/:responderId
 * Fetches cases assigned to a specific responder
 */
router.get('/assigned/:responderId', async (req, res) => {
  try {
    const { responderId } = req.params;
    const snap = await db.collection(COLLECTIONS.REPORTS)
      .where('assignedResponderId', '==', responderId)
      .get();

    const cases = [];
    snap.forEach(docSnap => cases.push(docSnap.data()));

    return res.status(200).json({
      responderId,
      cases,
      total: cases.length
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'DASHBOARD_ASSIGNED_FAILED',
        message: error.message
      }
    });
  }
});

/**
 * GET /api/dashboard/search?query=&status=&category=&zone=
 * Advanced multi-filter search for case investigations
 */
router.get('/search', async (req, res) => {
  try {
    const { query = '', status, category, zone } = req.query;
    const snap = await db.collection(COLLECTIONS.REPORTS).get();
    let cases = [];

    snap.forEach(docSnap => cases.push(docSnap.data()));

    const cleanQuery = String(query).trim().toLowerCase();
    const cleanZone = zone ? String(zone).trim().toLowerCase() : null;

    cases = cases.filter(c => {
      if (status && c.status !== status) return false;
      if (category && c.category !== category) return false;
      if (cleanZone && !(c.location?.zone || '').toLowerCase().includes(cleanZone)) return false;

      if (cleanQuery) {
        const idMatch = (c.id || '').toLowerCase().includes(cleanQuery);
        const descMatch = (c.description || '').toLowerCase().includes(cleanQuery);
        const addrMatch = (c.location?.addressText || '').toLowerCase().includes(cleanQuery);
        const classMatch = (c.aiTriage?.classification || '').toLowerCase().includes(cleanQuery);
        return idMatch || descMatch || addrMatch || classMatch;
      }

      return true;
    });

    return res.status(200).json({
      query,
      cases,
      total: cases.length
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'DASHBOARD_SEARCH_FAILED',
        message: error.message
      }
    });
  }
});

export default router;
