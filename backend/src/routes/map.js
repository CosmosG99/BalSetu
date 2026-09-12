import { Router } from 'express';
import { db, COLLECTIONS } from '../models/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// Protected map data routes
router.use(authenticate, requireRole('responder', 'admin', 'superadmin'));

const PRIORITY_COLORS = {
  critical: '#DC2626', // Red
  high: '#EA580C',     // Orange
  medium: '#D97706',   // Amber
  low: '#2563EB'       // Blue
};

/**
 * GET /api/map/incidents (responder/admin)
 * Returns GeoJSON FeatureCollection with priority marker colors
 */
router.get('/incidents', async (req, res) => {
  try {
    const snap = await db.collection(COLLECTIONS.REPORTS).get();
    const features = [];

    snap.forEach(docSnap => {
      const c = docSnap.data();
      const lat = c.location?.lat;
      const lng = c.location?.lng;

      if (typeof lat === 'number' && typeof lng === 'number') {
        const priority = c.priority || 'medium';
        const markerColor = PRIORITY_COLORS[priority] || '#2563EB';

        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat] // GeoJSON standard: [longitude, latitude]
          },
          properties: {
            caseId: c.id,
            category: c.category,
            priority,
            status: c.status,
            zone: c.location?.zone || 'Unassigned',
            addressText: c.location?.addressText || '',
            markerColor,
            createdAt: c.createdAt
          }
        });
      }
    });

    return res.status(200).json({
      type: 'FeatureCollection',
      features,
      count: features.length
    });
  } catch (error) {
    console.error('Error generating incidents map GeoJSON:', error);
    return res.status(500).json({
      error: {
        code: 'MAP_INCIDENTS_FAILED',
        message: error.message || 'Failed to generate map GeoJSON'
      }
    });
  }
});

/**
 * GET /api/map/heatmap (responder/admin)
 * Aggregates incident counts and high-priority densities grouped by zone
 */
router.get('/heatmap', async (req, res) => {
  try {
    const snap = await db.collection(COLLECTIONS.REPORTS).get();
    const zoneMap = new Map();

    snap.forEach(docSnap => {
      const c = docSnap.data();
      const zone = c.location?.zone || 'General Zone';
      const lat = c.location?.lat || 18.9696;
      const lng = c.location?.lng || 72.8193;
      const isHighPriority = c.priority === 'high' || c.priority === 'critical';

      if (!zoneMap.has(zone)) {
        zoneMap.set(zone, {
          zone,
          totalCases: 0,
          highPriorityCases: 0,
          latSum: 0,
          lngSum: 0,
          count: 0
        });
      }

      const item = zoneMap.get(zone);
      item.totalCases += 1;
      if (isHighPriority) item.highPriorityCases += 1;
      item.latSum += lat;
      item.lngSum += lng;
      item.count += 1;
    });

    const heatmap = [];
    for (const [zone, data] of zoneMap.entries()) {
      heatmap.push({
        zone,
        totalCases: data.totalCases,
        highPriorityCases: data.highPriorityCases,
        intensity: Math.min(1.0, (data.totalCases * 0.15) + (data.highPriorityCases * 0.25)),
        center: {
          lat: data.latSum / data.count,
          lng: data.lngSum / data.count
        }
      });
    }

    // Sort descending by total cases
    heatmap.sort((a, b) => b.totalCases - a.totalCases);

    return res.status(200).json({
      zones: heatmap,
      totalZones: heatmap.length
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'HEATMAP_FAILED',
        message: error.message
      }
    });
  }
});

export default router;
