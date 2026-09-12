import admin from 'firebase-admin';
import { db, isLiveFirebase, InMemoryTimestamp } from '../config/firebase.js';

export const COLLECTIONS = {
  REPORTS: 'reports',
  MISSING_CHILDREN: 'missingChildRecords',
  MATCHES: 'matches',
  USERS: 'users',
  REPORTERS: 'reporters',
  NOTIFICATIONS: 'notifications',
  AUDIT_LOGS: 'auditLogs'
};

/**
 * Returns current Firestore Timestamp (or InMemoryTimestamp in local mode)
 */
export function currentTimestamp() {
  if (isLiveFirebase && admin.firestore && admin.firestore.Timestamp) {
    return admin.firestore.Timestamp.now();
  }
  return InMemoryTimestamp.now();
}

/**
 * Converts a JS Date to Firestore Timestamp
 */
export function toTimestamp(date) {
  if (isLiveFirebase && admin.firestore && admin.firestore.Timestamp) {
    return admin.firestore.Timestamp.fromDate(date);
  }
  return InMemoryTimestamp.fromDate(date);
}

/**
 * Generates a clean human-readable Case ID, e.g. RAK-4F92A1
 */
export function generateCaseId() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RAK-${random}`;
}

export { db };
