// Dynamic loading for @domoapps/toolkit to support both Domo container runtime and local test environments
let domoToolkit = null;
try {
  const imported = await import('@domoapps/toolkit');
  domoToolkit = imported.default || imported;
} catch (err) {
  // @domoapps/toolkit is resolved at runtime in Domo AppDB environment
}

// In-memory document storage fallback for local test execution when running outside Domo runtime environment
const memoryStore = new Map();

const mockDocumentsApi = {
  async fetchAll(collection) {
    const list = memoryStore.get(collection) || [];
    return JSON.parse(JSON.stringify(list));
  },
  async fetchDoc(collection, id) {
    const list = memoryStore.get(collection) || [];
    const found = list.find(doc => (doc.id || doc._id) === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },
  async create(collection, data) {
    if (!memoryStore.has(collection)) {
      memoryStore.set(collection, []);
    }
    const list = memoryStore.get(collection);
    const id = data._id || data.id || `appdb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newDoc = {
      id,
      ...data
    };
    list.push(newDoc);
    return JSON.parse(JSON.stringify(newDoc));
  },
  async update(collection, id, data) {
    const list = memoryStore.get(collection) || [];
    const index = list.findIndex(doc => (doc.id || doc._id) === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...data, id };
      return JSON.parse(JSON.stringify(list[index]));
    }
    const created = { id, ...data };
    list.push(created);
    memoryStore.set(collection, list);
    return JSON.parse(JSON.stringify(created));
  },
  async remove(collection, id) {
    const list = memoryStore.get(collection) || [];
    const filtered = list.filter(doc => (doc.id || doc._id) !== id);
    memoryStore.set(collection, filtered);
    return { success: true };
  }
};

const rawAppDB = domoToolkit && domoToolkit.appdb ? domoToolkit.appdb : (domoToolkit && domoToolkit.documents ? domoToolkit : null);

export const AppDBClient = {
  documents: (rawAppDB && rawAppDB.documents) ? rawAppDB.documents : mockDocumentsApi
};

export const isAppDBMode = () => process.env.DB_MODE === 'appdb';

export default AppDBClient;
