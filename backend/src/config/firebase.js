import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

/**
 * High-fidelity In-Memory Firestore mock for zero-config hackathon execution.
 * Exactly mimics Firestore CollectionReference, DocumentReference, QuerySnapshot, DocumentSnapshot, and Timestamp.
 */
class InMemoryTimestamp {
  constructor(seconds = Math.floor(Date.now() / 1000), nanoseconds = 0) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }

  toDate() {
    return new Date(this.seconds * 1000 + Math.floor(this.nanoseconds / 1000000));
  }

  toMillis() {
    return this.seconds * 1000;
  }

  toISOString() {
    return this.toDate().toISOString();
  }

  static now() {
    return new InMemoryTimestamp();
  }

  static fromDate(date) {
    return new InMemoryTimestamp(Math.floor(date.getTime() / 1000), (date.getTime() % 1000) * 1000000);
  }
}

class InMemoryDocumentSnapshot {
  constructor(id, data, ref) {
    this.id = id;
    this._data = data ? JSON.parse(JSON.stringify(data)) : null;
    this.ref = ref;
    this.exists = Boolean(data);
  }

  data() {
    return this._data ? JSON.parse(JSON.stringify(this._data)) : undefined;
  }
}

class InMemoryQuerySnapshot {
  constructor(docs) {
    this.docs = docs;
    this.size = docs.length;
    this.empty = docs.length === 0;
  }

  forEach(callback) {
    this.docs.forEach(callback);
  }
}

class InMemoryQuery {
  constructor(collectionName, store, filters = [], sorts = [], limitCount = null) {
    this.collectionName = collectionName;
    this.store = store;
    this.filters = filters;
    this.sorts = sorts;
    this.limitCount = limitCount;
  }

  doc(id) {
    const docId = id || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    return new InMemoryDocRef(this.collectionName, docId, this.store);
  }

  async add(data) {
    const ref = this.doc();
    await ref.set(data);
    return ref;
  }

  where(field, op, val) {
    return new InMemoryQuery(
      this.collectionName,
      this.store,
      [...this.filters, { field, op, val }],
      this.sorts,
      this.limitCount
    );
  }

  orderBy(field, direction = 'asc') {
    return new InMemoryQuery(
      this.collectionName,
      this.store,
      this.filters,
      [...this.sorts, { field, direction }],
      this.limitCount
    );
  }

  limit(count) {
    return new InMemoryQuery(
      this.collectionName,
      this.store,
      this.filters,
      this.sorts,
      count
    );
  }

  async get() {
    const colStore = this.store[this.collectionName] || {};
    let matched = Object.entries(colStore).map(([id, data]) => ({ id, data }));

    // Apply where filters
    for (const { field, op, val } of this.filters) {
      matched = matched.filter(({ data }) => {
        const itemVal = data[field];
        switch (op) {
          case '==':
            return itemVal === val;
          case '!=':
            return itemVal !== val;
          case '>':
            return itemVal > val;
          case '>=':
            return itemVal >= val;
          case '<':
            return itemVal < val;
          case '<=':
            return itemVal <= val;
          case 'array-contains':
            return Array.isArray(itemVal) && itemVal.includes(val);
          case 'in':
            return Array.isArray(val) && val.includes(itemVal);
          default:
            return false;
        }
      });
    }

    // Apply sorts
    for (const { field, direction } of this.sorts) {
      matched.sort((a, b) => {
        const valA = a.data[field];
        const valB = b.data[field];
        if (valA === valB) return 0;
        if (valA === undefined) return 1;
        if (valB === undefined) return -1;
        const comp = valA > valB ? 1 : -1;
        return direction === 'desc' ? -comp : comp;
      });
    }

    // Apply limit
    if (typeof this.limitCount === 'number') {
      matched = matched.slice(0, this.limitCount);
    }

    const docSnaps = matched.map(({ id, data }) => new InMemoryDocumentSnapshot(id, data, new InMemoryDocRef(this.collectionName, id, this.store)));
    return new InMemoryQuerySnapshot(docSnaps);
  }
}

class InMemoryDocRef {
  constructor(collectionName, id, store) {
    this.collectionName = collectionName;
    this.id = id;
    this.path = `${collectionName}/${id}`;
    this.store = store;
  }

  async get() {
    const colStore = this.store[this.collectionName] || {};
    const data = colStore[this.id];
    return new InMemoryDocumentSnapshot(this.id, data, this);
  }

  async set(data, options = {}) {
    if (!this.store[this.collectionName]) {
      this.store[this.collectionName] = {};
    }
    const cleanData = JSON.parse(JSON.stringify(data));
    if (options.merge && this.store[this.collectionName][this.id]) {
      this.store[this.collectionName][this.id] = {
        ...this.store[this.collectionName][this.id],
        ...cleanData
      };
    } else {
      this.store[this.collectionName][this.id] = cleanData;
    }
    return { writeTime: InMemoryTimestamp.now() };
  }

  async update(data) {
    if (!this.store[this.collectionName] || !this.store[this.collectionName][this.id]) {
      throw new Error(`Document ${this.path} not found for update`);
    }
    const cleanData = JSON.parse(JSON.stringify(data));
    this.store[this.collectionName][this.id] = {
      ...this.store[this.collectionName][this.id],
      ...cleanData
    };
    return { writeTime: InMemoryTimestamp.now() };
  }

  async delete() {
    if (this.store[this.collectionName] && this.store[this.collectionName][this.id]) {
      delete this.store[this.collectionName][this.id];
    }
    return { writeTime: InMemoryTimestamp.now() };
  }
}

class InMemoryFirestore {
  constructor() {
    this._store = {};
  }

  collection(name) {
    return new InMemoryQuery(name, this._store);
  }

  doc(path) {
    const [collectionName, id] = path.split('/');
    return new InMemoryDocRef(collectionName, id, this._store);
  }

  // Clear all data (used by DEMO reset)
  _reset() {
    this._store = {};
  }
}

// Global In-Memory Store instance
const inMemoryDb = new InMemoryFirestore();

let db;
let auth;
let isLiveFirebase = false;

// Attempt live Firebase initialization if credentials or emulator are configured
try {
  if (process.env.FIRESTORE_EMULATOR_HOST || (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY)) {
    if (!admin.apps.length) {
      if (process.env.FIRESTORE_EMULATOR_HOST) {
        admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || 'rakshak-demo' });
      } else {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
          }),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
      }
    }
    db = admin.firestore();
    auth = admin.auth();
    isLiveFirebase = true;
    console.log('✅ Firebase Admin connected (Live/Emulator mode)');
  } else {
    throw new Error('No Firebase credentials provided');
  }
} catch (err) {
  console.log(`ℹ️ Running in resilient In-Memory Firestore mode (${err.message})`);
  db = inMemoryDb;
  auth = {
    verifyIdToken: async (token) => {
      // Mock token verification for dev/demo mode
      if (token === 'responder-token' || token.startsWith('demo-responder')) {
        return { uid: 'responder-001', role: 'responder', email: 'responder@rakshak.org' };
      }
      if (token === 'admin-token' || token.startsWith('demo-admin')) {
        return { uid: 'admin-001', role: 'admin', email: 'admin@rakshak.org' };
      }
      if (token === 'superadmin-token' || token.startsWith('demo-superadmin')) {
        return { uid: 'superadmin-001', role: 'superadmin', email: 'superadmin@rakshak.org' };
      }
      throw new Error('Invalid Firebase token in demo mode');
    }
  };
}

export { db, auth, isLiveFirebase, inMemoryDb, InMemoryTimestamp };
export default db;
