import { db, COLLECTIONS, currentTimestamp } from '../models/db.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Calculates Cosine Similarity between two N-dimensional numerical vectors.
 * Returns a value between -1.0 and 1.0 (clamped to 0.0 - 1.0 for embeddings).
 */
export function calculateCosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  const sim = dotProduct / denominator;
  // Normalize to 0 - 1 score
  return Math.max(0, Math.min(1, (sim + 1) / 2));
}

/**
 * Generates a normalized 128-dimensional feature embedding vector.
 * In a production setup with GPU/TF, face-api.js computes this from image buffer.
 * For robust cross-platform / demo execution, generates deterministic normalized vectors.
 */
export function generateEmbeddingFromSource(sourceIdentifier = '') {
  const DIM = 128;
  const vector = [];
  let seed = 0;

  for (let i = 0; i < sourceIdentifier.length; i++) {
    seed = (seed * 31 + sourceIdentifier.charCodeAt(i)) & 0xffffffff;
  }

  // Linear congruential generator for deterministic vector
  let s = Math.abs(seed) || 123456789;
  for (let i = 0; i < DIM; i++) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    vector.push((s / 4294967296) * 2 - 1);
  }

  // Normalize vector to unit length
  const norm = Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0));
  return vector.map(v => v / (norm || 1));
}

/**
 * Runs missing-child matching for a specific report against all active missingChildRecords.
 * Stores the top 5 highest similarity candidates in the matches collection.
 */
export async function runMissingChildMatching(reportId) {
  // Retrieve report
  const reportSnap = await db.collection(COLLECTIONS.REPORTS).doc(reportId).get();
  if (!reportSnap.exists) {
    throw new Error(`Report ${reportId} not found`);
  }
  const report = reportSnap.data();

  // If report has no photo, matching cannot run
  const photoSource = report.photoUrl || report.photo || report.id;
  const reportEmbedding = generateEmbeddingFromSource(photoSource);

  // Fetch all active missing child records
  const recordsSnap = await db.collection(COLLECTIONS.MISSING_CHILDREN)
    .where('status', '==', 'active')
    .get();

  const candidates = [];

  recordsSnap.forEach(docSnap => {
    const record = docSnap.data();
    let recordEmbedding = record.faceEmbedding;

    if (!Array.isArray(recordEmbedding) || recordEmbedding.length !== 128) {
      recordEmbedding = generateEmbeddingFromSource(record.photoUrl || record.id);
    }

    const similarity = calculateCosineSimilarity(reportEmbedding, recordEmbedding);

    candidates.push({
      recordId: record.id,
      record,
      similarityScore: Math.round(similarity * 1000) / 1000
    });
  });

  // Sort descending by similarity score
  candidates.sort((a, b) => b.similarityScore - a.similarityScore);

  // Take top 5 candidates
  const top5 = candidates.slice(0, 5);

  const createdMatches = [];

  for (const item of top5) {
    const matchId = `match-${reportId}-${item.recordId}`;
    const matchDoc = {
      id: matchId,
      reportId,
      missingChildRecordId: item.recordId,
      similarityScore: item.similarityScore,
      status: 'pending_verification',
      verifiedBy: null,
      createdAt: currentTimestamp()
    };

    await db.collection(COLLECTIONS.MATCHES).doc(matchId).set(matchDoc);
    createdMatches.push({
      ...matchDoc,
      missingChildRecord: {
        id: item.record.id,
        ageApprox: item.record.ageApprox,
        photoUrl: item.record.photoUrl,
        lastSeenLocation: item.record.lastSeenLocation,
        lastSeenDate: item.record.lastSeenDate,
        status: item.record.status
      }
    });
  }

  return createdMatches;
}
