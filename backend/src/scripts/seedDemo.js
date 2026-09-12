import { inMemoryDb, isLiveFirebase } from '../config/firebase.js';
import { db, COLLECTIONS, currentTimestamp, toTimestamp } from '../models/db.js';
import { generateEmbeddingFromSource } from '../services/matching.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Demo seed dataset specification strictly matching hackathon requirements:
 * 1. Lost/Distressed Child scenario
 * 2. Unaccompanied Child scenario
 * 3. Potential Trafficking Concern scenario
 * + Synthetic missing child records with face embeddings
 * + Active responders with zones and caseloads
 * + Community reporters
 */
export async function seedDemoData() {
  console.log('🌱 Starting RAKSHAK Demo Mode seeding...');

  // Reset in-memory store if applicable
  if (inMemoryDb && inMemoryDb._reset) {
    inMemoryDb._reset();
  }

  const now = currentTimestamp();
  const pastHour = toTimestamp(new Date(Date.now() - 3600 * 1000));
  const pastTwoHours = toTimestamp(new Date(Date.now() - 7200 * 1000));
  const pastDay = toTimestamp(new Date(Date.now() - 86400 * 1000));

  // 1. Responders (users)
  const responders = [
    {
      id: 'usr-resp-01',
      name: 'Inspector Vikram Patil',
      role: 'responder',
      phone: '+91 98201 23456',
      zone: 'Mumbai Central',
      specialization: ['lost_child', 'unaccompanied_child'],
      active: true,
      currentCaseload: 1
    },
    {
      id: 'usr-resp-02',
      name: 'Sub-Inspector Anjali Deshmukh',
      role: 'responder',
      phone: '+91 98202 34567',
      zone: 'Pune Swargate',
      specialization: ['trafficking_concern', 'abuse_concern'],
      active: true,
      currentCaseload: 0
    },
    {
      id: 'usr-resp-03',
      name: 'Officer Rajesh Shinde',
      role: 'responder',
      phone: '+91 98203 45678',
      zone: 'Dadar Central',
      specialization: ['unaccompanied_child', 'lost_child'],
      active: true,
      currentCaseload: 0
    },
    {
      id: 'usr-admin-01',
      name: 'Dr. Sunita Sharma (Central Dispatch)',
      role: 'admin',
      phone: '+91 98200 11223',
      zone: 'Mumbai Central',
      specialization: ['all'],
      active: true,
      currentCaseload: 0
    }
  ];

  for (const resp of responders) {
    await db.collection(COLLECTIONS.USERS).doc(resp.id).set(resp);
  }
  console.log(`✅ Seeded ${responders.length} responders/admins`);

  // 2. Synthetic Missing Child Records (for matching engine)
  const syntheticMissingChildren = [
    {
      id: 'MC-2026-081',
      ageApprox: 8,
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      faceEmbedding: generateEmbeddingFromSource('missing-child-aaryan-mumbai-central'),
      lastSeenLocation: {
        lat: 18.9696,
        lng: 72.8193,
        addressText: 'Platform 4, Mumbai Central Station'
      },
      lastSeenDate: pastDay,
      descriptionInternal: 'Reported missing from nearby market wearing blue jacket and red cap.',
      status: 'active'
    },
    {
      id: 'MC-2026-094',
      ageApprox: 13,
      photoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80',
      faceEmbedding: generateEmbeddingFromSource('missing-child-swargate-pune'),
      lastSeenLocation: {
        lat: 18.5018,
        lng: 73.8586,
        addressText: 'Swargate Bus Terminal, Pune'
      },
      lastSeenDate: pastTwoHours,
      descriptionInternal: 'Travelling solo without ticket, last seen near intercity departure bay 3.',
      status: 'active'
    },
    {
      id: 'MC-2026-102',
      ageApprox: 6,
      photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
      faceEmbedding: generateEmbeddingFromSource('missing-child-thane-platform'),
      lastSeenLocation: {
        lat: 19.2183,
        lng: 72.9781,
        addressText: 'Thane Railway Station Concourse'
      },
      lastSeenDate: pastDay,
      descriptionInternal: 'Separated from mother during peak evening commute crowd.',
      status: 'active'
    },
    {
      id: 'MC-2026-045',
      ageApprox: 11,
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      faceEmbedding: generateEmbeddingFromSource('missing-child-dadar-reunion'),
      lastSeenLocation: {
        lat: 19.0178,
        lng: 72.8478,
        addressText: 'Dadar Flower Market Footbridge'
      },
      lastSeenDate: pastDay,
      descriptionInternal: 'Reunited safely with family.',
      status: 'found'
    }
  ];

  for (const child of syntheticMissingChildren) {
    await db.collection(COLLECTIONS.MISSING_CHILDREN).doc(child.id).set(child);
  }
  console.log(`✅ Seeded ${syntheticMissingChildren.length} synthetic missing child records`);

  // 3. Exactly 3 Demo Scenarios (as requested by system prompt)
  const demoScenarios = [
    // Scenario 1: Lost/Distressed Child
    {
      id: 'RAK-LST01',
      clientReportId: 'seed-lost-child-001',
      source: 'web',
      anonymous: true,
      // Note: No reporterId field included (privacy requirement)
      category: 'lost_child',
      description: 'Young boy approx 8 years old sitting alone on a bench near Platform 4. Visibly crying, asking for his mother. Wearing a blue zipped jacket and red sneakers.',
      language: 'en',
      location: {
        lat: 18.9696,
        lng: 72.8193,
        addressText: 'Platform 4, Mumbai Central Railway Station',
        zone: 'Mumbai Central'
      },
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      status: 'assigned',
      priority: 'high',
      aiTriage: {
        classification: 'Distressed or lost child in high-footfall hazard zone',
        riskIndicators: [
          'Minor separated from adult guardian',
          'Visible acute emotional distress',
          'High hazard zone near active railway tracks'
        ],
        recommendedAction: 'Human verification required. Alert Railway Police / Station Child Help Desk immediately.',
        confidence: 0.89,
        humanVerificationRequired: true,
        verifiedBy: null
      },
      assignedResponderId: 'usr-resp-01',
      matchedMissingChildIds: ['MC-2026-081'],
      timeline: [
        {
          status: 'new',
          actorId: 'anonymous-citizen',
          note: 'Anonymous report submitted via station QR portal.',
          at: pastHour
        },
        {
          status: 'assigned',
          actorId: 'system-auto-route',
          note: 'Auto-routed to Inspector Vikram Patil based on zone proximity.',
          at: pastHour
        }
      ],
      internalNotes: [
        {
          authorId: 'usr-resp-01',
          note: 'Welfare team dispatched to Platform 4 south end.',
          at: now
        }
      ],
      createdAt: pastHour,
      updatedAt: now
    },

    // Scenario 2: Unaccompanied Child
    {
      id: 'RAK-UNA02',
      clientReportId: 'seed-unaccompanied-002',
      source: 'whatsapp',
      anonymous: true,
      category: 'unaccompanied_child',
      description: 'Girl approx 13-14 years old carrying oversized suitcase, asking bystanders for the Solapur night bus. Looks disoriented and hesitant to answer station attendants.',
      language: 'en',
      location: {
        lat: 18.5018,
        lng: 73.8586,
        addressText: 'Swargate Bus Terminal, Pune, Bay No. 3',
        zone: 'Pune Swargate'
      },
      photoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80',
      status: 'under_review',
      priority: 'high',
      aiTriage: {
        classification: 'Solo minor in active transit environment without confirmed adult',
        riskIndicators: [
          'Unaccompanied minor with heavy luggage',
          'Inter-city transit terminal hazard',
          'Potential flight or exploitation risk'
        ],
        recommendedAction: 'Human verification required. Alert Station Duty Officer and Terminal Security.',
        confidence: 0.86,
        humanVerificationRequired: true,
        verifiedBy: null
      },
      assignedResponderId: null,
      matchedMissingChildIds: [],
      timeline: [
        {
          status: 'new',
          actorId: 'whatsapp-reporter',
          note: 'Report received via WhatsApp helpline from transit passenger.',
          at: pastTwoHours
        },
        {
          status: 'under_review',
          actorId: 'usr-admin-01',
          note: 'Triage reviewed by central coordinator. Assigning local team.',
          at: pastHour
        }
      ],
      internalNotes: [],
      createdAt: pastTwoHours,
      updatedAt: pastHour
    },

    // Scenario 3: Potential Trafficking Concern
    {
      id: 'RAK-TRF03',
      clientReportId: 'seed-trafficking-003',
      source: 'volunteer',
      anonymous: false,
      reporterId: 'rep-vol-01',
      category: 'trafficking_concern',
      description: 'Adult male firmly pulling two young girls (approx 7 and 9 years old) away from inquiry counter towards unlit parking. Children appear frightened, silently weeping, and unable to communicate with staff.',
      language: 'en',
      location: {
        lat: 19.0178,
        lng: 72.8478,
        addressText: 'Dadar Central Station, East Exit Parking',
        zone: 'Dadar Central'
      },
      photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
      status: 'escalated',
      priority: 'critical',
      aiTriage: {
        classification: 'High-risk suspected child trafficking or abduction concern',
        riskIndicators: [
          'Signs of forceful physical restraint or coercion',
          'Multiple distressed minors with unaccompanied male',
          'Evasion of transit authorities into parking sector'
        ],
        recommendedAction: 'Human verification required. Immediate priority welfare intervention. Escalate to Child Welfare Committee / 1098.',
        confidence: 0.94,
        humanVerificationRequired: true,
        verifiedBy: null
      },
      assignedResponderId: 'usr-resp-03',
      matchedMissingChildIds: [],
      timeline: [
        {
          status: 'new',
          actorId: 'rep-vol-01',
          note: 'High-priority report filed by verified transit volunteer.',
          at: pastHour
        },
        {
          status: 'escalated',
          actorId: 'usr-admin-01',
          note: 'CRITICAL ALERT: Immediate multi-agency intercept coordinated.',
          at: now
        }
      ],
      internalNotes: [
        {
          authorId: 'usr-admin-01',
          note: 'RPF checkpoint notified to monitor East gate vehicle exits.',
          at: now
        }
      ],
      createdAt: pastHour,
      updatedAt: now
    }
  ];

  for (const scenario of demoScenarios) {
    await db.collection(COLLECTIONS.REPORTS).doc(scenario.id).set(scenario);
  }
  console.log(`✅ Seeded exactly ${demoScenarios.length} demo scenario cases`);

  // 4. Community Reporters
  const reporters = [
    {
      id: 'rep-vol-01',
      name: 'Kavita Rao',
      phone: '+91 97654 32100',
      type: 'transit_worker',
      verified: true,
      zone: 'Dadar Central',
      reportCount: 3,
      createdAt: pastDay
    },
    {
      id: 'rep-vol-02',
      name: 'Sunil Jadhav',
      phone: '+91 97654 43211',
      type: 'volunteer',
      verified: true,
      zone: 'Mumbai Central',
      reportCount: 1,
      createdAt: pastDay
    }
  ];

  for (const rep of reporters) {
    await db.collection(COLLECTIONS.REPORTERS).doc(rep.id).set(rep);
  }
  console.log(`✅ Seeded ${reporters.length} community reporters`);

  // 5. Initial Notifications
  const initialNotifications = [
    {
      id: 'notif-seed-01',
      userId: 'usr-resp-01',
      type: 'assignment',
      caseId: 'RAK-LST01',
      message: 'You have been assigned to case RAK-LST01 (high priority)',
      read: false,
      createdAt: pastHour
    },
    {
      id: 'notif-seed-02',
      userId: 'usr-admin-01',
      type: 'escalation',
      caseId: 'RAK-TRF03',
      message: 'URGENT: Case RAK-TRF03 has been escalated for immediate intervention',
      read: false,
      createdAt: now
    }
  ];

  for (const notif of initialNotifications) {
    await db.collection(COLLECTIONS.NOTIFICATIONS).doc(notif.id).set(notif);
  }
  console.log(`✅ Seeded ${initialNotifications.length} notifications`);

  console.log('🎉 RAKSHAK Demo Database successfully seeded!');
  return {
    cases: demoScenarios.length,
    missingChildren: syntheticMissingChildren.length,
    responders: responders.length,
    reporters: reporters.length
  };
}

// Allow direct execution: node src/scripts/seedDemo.js
if (process.argv[1] && process.argv[1].endsWith('seedDemo.js')) {
  seedDemoData()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
