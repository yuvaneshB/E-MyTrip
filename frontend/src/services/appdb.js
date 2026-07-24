// Frontend AppDB Service for Domo Custom App & Local Browser Execution

let domoToolkit = null;
try {
  const imported = await import('@domoapps/toolkit');
  domoToolkit = imported.default || imported;
} catch (err) {
  // @domoapps/toolkit is resolved at runtime in Domo App environment
}

// LocalStorage-backed fallback for browser testing when running outside Domo runtime container
const getLocalCollection = (collection) => {
  try {
    const raw = localStorage.getItem(`appdb_${collection}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalCollection = (collection, data) => {
  try {
    localStorage.setItem(`appdb_${collection}`, JSON.stringify(data));
  } catch (e) {
    // quota error handling
  }
};

const mockBrowserDocumentsApi = {
  async fetchAll(collection) {
    const list = getLocalCollection(collection);
    return JSON.parse(JSON.stringify(list));
  },
  async fetchDoc(collection, id) {
    const list = getLocalCollection(collection);
    const found = list.find(doc => (doc.id || doc._id) === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },
  async create(collection, data) {
    const list = getLocalCollection(collection);
    const id = data._id || data.id || `appdb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newDoc = {
      id,
      ...data
    };
    list.push(newDoc);
    saveLocalCollection(collection, list);
    return JSON.parse(JSON.stringify(newDoc));
  },
  async update(collection, id, data) {
    const list = getLocalCollection(collection);
    const index = list.findIndex(doc => (doc.id || doc._id) === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...data, id };
      saveLocalCollection(collection, list);
      return JSON.parse(JSON.stringify(list[index]));
    }
    const created = { id, ...data };
    list.push(created);
    saveLocalCollection(collection, list);
    return JSON.parse(JSON.stringify(created));
  },
  async remove(collection, id) {
    const list = getLocalCollection(collection);
    const filtered = list.filter(doc => (doc.id || doc._id) !== id);
    saveLocalCollection(collection, filtered);
    return { success: true };
  }
};

const rawAppDB = domoToolkit && domoToolkit.appdb ? domoToolkit.appdb : (domoToolkit && domoToolkit.documents ? domoToolkit : null);

export const AppDBClient = {
  documents: (rawAppDB && rawAppDB.documents) ? rawAppDB.documents : mockBrowserDocumentsApi
};

export const isAppDBMode = () => {
  const mode = import.meta.env.VITE_DB_MODE || (window && window.DB_MODE);
  return mode === 'appdb';
};

export function reshapeDoc(doc) {
  if (!doc) return null;
  const copy = { ...doc };
  if (copy.id && !copy._id) {
    copy._id = copy.id;
  } else if (copy._id && !copy.id) {
    copy.id = copy._id;
  }
  return copy;
}

export default AppDBClient;
