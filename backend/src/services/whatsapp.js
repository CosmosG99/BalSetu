import { sendWhatsAppMessage } from '../config/twilio.js';
import { translate } from '../middleware/i18n.js';
import { db, COLLECTIONS, currentTimestamp, generateCaseId } from '../models/db.js';
import { runTriage } from './triage.js';
import { autoRouteCase } from './routing.js';
import { recordAuditLog } from '../middleware/auditLog.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * In-memory conversation state store for WhatsApp sessions keyed by phone number
 * Format: { [phone]: { step: 'CATEGORY'|'DESCRIPTION'|'LOCATION'|'PHOTO', data: {}, lang: 'en'|'hi'|'mr', lastActive: number } }
 */
const sessions = new Map();

// Map number option to category
const CATEGORY_MAP = {
  '1': 'lost_child',
  '2': 'unaccompanied_child',
  '3': 'trafficking_concern',
  '4': 'abuse_concern',
  '5': 'other'
};

/**
 * Create a case from WhatsApp session data using the unified report creation pipeline
 */
export async function createReportFromWhatsApp(sessionData, phone, lang = 'en') {
  const caseId = generateCaseId();
  const clientReportId = `wa-${uuidv4()}`;
  const now = currentTimestamp();

  // Determine if reporter is verified in reporters collection
  let isAnonymous = true;
  let reporterId = null;

  try {
    const reporterQuery = await db.collection(COLLECTIONS.REPORTERS).where('phone', '==', phone).get();
    if (!reporterQuery.empty) {
      const rep = reporterQuery.docs[0].data();
      if (rep.verified) {
        isAnonymous = false;
        reporterId = rep.id;
      }
    }
  } catch {
    // default anonymous
  }

  // Raw report object
  const reportDoc = {
    id: caseId,
    clientReportId,
    source: 'whatsapp',
    anonymous: isAnonymous,
    category: sessionData.category || 'other',
    description: sessionData.description || 'Reported via WhatsApp',
    language: lang,
    location: {
      lat: sessionData.location?.lat || 18.9696,
      lng: sessionData.location?.lng || 72.8193,
      addressText: sessionData.location?.addressText || 'Shared via WhatsApp',
      zone: sessionData.location?.zone || 'Mumbai Central'
    },
    photoUrl: sessionData.photoUrl || null,
    status: 'new',
    priority: null,
    aiTriage: null,
    assignedResponderId: null,
    matchedMissingChildIds: [],
    timeline: [
      {
        status: 'new',
        actorId: 'whatsapp-reporter',
        note: `Case reported via WhatsApp (${isAnonymous ? 'Anonymous' : 'Registered Reporter'}).`,
        at: now
      }
    ],
    internalNotes: [],
    createdAt: now,
    updatedAt: now
  };

  // Rule: If anonymous: true, omit reporterId entirely!
  if (!isAnonymous && reporterId) {
    reportDoc.reporterId = reporterId;
  }

  // 1. Save preliminary report
  await db.collection(COLLECTIONS.REPORTS).doc(caseId).set(reportDoc);

  // 2. Run AI Triage
  try {
    const triageResult = await runTriage(reportDoc);
    reportDoc.aiTriage = triageResult;
    reportDoc.priority = triageResult.priority;

    await db.collection(COLLECTIONS.REPORTS).doc(caseId).update({
      aiTriage: triageResult,
      priority: triageResult.priority,
      updatedAt: currentTimestamp()
    });
  } catch (triageErr) {
    console.error('AI Triage error during WhatsApp report creation:', triageErr.message);
  }

  // 3. Attempt smart auto-routing
  try {
    await autoRouteCase(caseId, 'system-whatsapp');
  } catch (routingErr) {
    console.log(`Auto-routing deferred for WhatsApp case ${caseId}: ${routingErr.message}`);
  }

  // 4. Record audit log
  await recordAuditLog({
    actorId: isAnonymous ? null : reporterId,
    action: 'CREATE_REPORT_WHATSAPP',
    entityType: 'case',
    entityId: caseId
  });

  return caseId;
}

/**
 * Handles incoming Twilio WhatsApp webhook requests
 */
export async function handleWhatsAppWebhook(body) {
  const from = body.From || body.from || '';
  const incomingText = (body.Body || body.body || '').trim();
  const mediaUrl = body.MediaUrl0 || body.mediaUrl0 || null;
  const latitude = body.Latitude || body.latitude;
  const longitude = body.Longitude || body.longitude;

  if (!from) {
    return { reply: 'Invalid sender' };
  }

  const cleanPhone = from.replace('whatsapp:', '').trim();

  // Support STATUS command anytime: e.g. "STATUS RAK-4F92A1"
  const statusMatch = incomingText.match(/^STATUS\s+([A-Za-z0-9-]+)/i);
  if (statusMatch) {
    const queryCaseId = statusMatch[1].toUpperCase();
    const caseSnap = await db.collection(COLLECTIONS.REPORTS).doc(queryCaseId).get();
    if (!caseSnap.exists) {
      const notFoundMsg = `Case ${queryCaseId} was not found. Please verify the Case ID.`;
      await sendWhatsAppMessage(from, notFoundMsg);
      return { reply: notFoundMsg };
    }
    const c = caseSnap.data();
    const statusMsg = `Case ${queryCaseId} Status: ${c.status.toUpperCase()}\nCategory: ${c.category}\nPriority: ${c.priority || 'Under Evaluation'}`;
    await sendWhatsAppMessage(from, statusMsg);
    return { reply: statusMsg };
  }

  // Retrieve or initialize session
  let session = sessions.get(cleanPhone);
  if (!session || incomingText.toLowerCase() === 'reset' || incomingText.toLowerCase() === 'start') {
    // Detect language if user writes in Devanagari
    let detectedLang = 'en';
    if (/[\u0900-\u097F]/.test(incomingText)) {
      detectedLang = 'hi';
    }

    session = {
      step: 'CATEGORY',
      data: {},
      lang: detectedLang,
      lastActive: Date.now()
    };
    sessions.set(cleanPhone, session);

    const welcomeMsg = translate('whatsapp.welcome', {}, session.lang);
    await sendWhatsAppMessage(from, welcomeMsg);
    return { reply: welcomeMsg };
  }

  session.lastActive = Date.now();

  switch (session.step) {
    case 'CATEGORY': {
      const selectedCategory = CATEGORY_MAP[incomingText] || (Object.values(CATEGORY_MAP).includes(incomingText.toLowerCase()) ? incomingText.toLowerCase() : null);

      if (!selectedCategory) {
        const errorPrompt = translate('whatsapp.prompt_category', {}, session.lang);
        await sendWhatsAppMessage(from, errorPrompt);
        return { reply: errorPrompt };
      }

      session.data.category = selectedCategory;
      session.step = 'DESCRIPTION';

      const descPrompt = translate('whatsapp.prompt_description', {}, session.lang);
      await sendWhatsAppMessage(from, descPrompt);
      return { reply: descPrompt };
    }

    case 'DESCRIPTION': {
      if (incomingText.length < 5) {
        const descPrompt = 'Please provide a slightly more detailed description of the child and situation:';
        await sendWhatsAppMessage(from, descPrompt);
        return { reply: descPrompt };
      }

      session.data.description = incomingText;
      session.step = 'LOCATION';

      const locPrompt = translate('whatsapp.prompt_location', {}, session.lang);
      await sendWhatsAppMessage(from, locPrompt);
      return { reply: locPrompt };
    }

    case 'LOCATION': {
      let lat = 18.9696;
      let lng = 72.8193;
      let addressText = incomingText;
      let zone = 'Mumbai Central';

      if (latitude && longitude) {
        lat = parseFloat(latitude);
        lng = parseFloat(longitude);
        addressText = `GPS Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      } else {
        // Extract basic zone from address text
        const lower = incomingText.toLowerCase();
        if (lower.includes('pune') || lower.includes('swargate')) {
          zone = 'Pune Swargate';
          lat = 18.5018;
          lng = 73.8586;
        } else if (lower.includes('thane')) {
          zone = 'Thane';
          lat = 19.2183;
          lng = 72.9781;
        } else if (lower.includes('dadar')) {
          zone = 'Dadar Central';
          lat = 19.0178;
          lng = 72.8478;
        }
      }

      session.data.location = { lat, lng, addressText, zone };
      session.step = 'PHOTO';

      const photoPrompt = translate('whatsapp.prompt_photo', {}, session.lang);
      await sendWhatsAppMessage(from, photoPrompt);
      return { reply: photoPrompt };
    }

    case 'PHOTO': {
      if (mediaUrl) {
        session.data.photoUrl = mediaUrl;
      }

      // Finish and create case
      const caseId = await createReportFromWhatsApp(session.data, cleanPhone, session.lang);
      sessions.delete(cleanPhone);

      const successMsg = translate('whatsapp.case_created', { caseId }, session.lang);
      await sendWhatsAppMessage(from, successMsg);
      return { reply: successMsg, caseId };
    }

    default: {
      sessions.delete(cleanPhone);
      const welcomeMsg = translate('whatsapp.welcome', {}, 'en');
      await sendWhatsAppMessage(from, welcomeMsg);
      return { reply: welcomeMsg };
    }
  }
}
