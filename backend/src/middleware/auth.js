import { auth, isLiveFirebase } from '../config/firebase.js';
import { db, COLLECTIONS } from '../models/db.js';

/**
 * Authentication middleware that verifies Firebase ID token or demo tokens.
 * Attaches decoded user profile to req.user.
 */
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or malformed Authorization header. Expected Bearer <token>'
      }
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    let decoded;

    // Check for development / demo tokens
    if (token === 'demo-responder' || token === 'responder-token') {
      decoded = { uid: 'usr-resp-01', role: 'responder', email: 'patil@rakshak.org', name: 'Inspector V. Patil' };
    } else if (token === 'demo-admin' || token === 'admin-token') {
      decoded = { uid: 'usr-admin-01', role: 'admin', email: 'admin@rakshak.org', name: 'Central Admin' };
    } else if (token === 'demo-superadmin' || token === 'superadmin-token') {
      decoded = { uid: 'usr-super-01', role: 'superadmin', email: 'superadmin@rakshak.org', name: 'Director SuperAdmin' };
    } else {
      // Verify with Firebase Auth
      decoded = await auth.verifyIdToken(token);
    }

    // Lookup user in Firestore for current active status and profile
    let role = decoded.role || 'responder';
    let userDoc = null;

    try {
      const snap = await db.collection(COLLECTIONS.USERS).doc(decoded.uid).get();
      if (snap.exists) {
        userDoc = snap.data();
        if (userDoc.role) role = userDoc.role;
      }
    } catch {
      // Proceed with token decoded role if DB lookup fails
    }

    req.user = {
      uid: decoded.uid,
      id: decoded.uid,
      email: decoded.email,
      name: decoded.name || userDoc?.name || 'Authorized User',
      role,
      zone: userDoc?.zone || 'Mumbai Central',
      specialization: userDoc?.specialization || []
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: `Token verification failed: ${error.message}`
      }
    });
  }
}
