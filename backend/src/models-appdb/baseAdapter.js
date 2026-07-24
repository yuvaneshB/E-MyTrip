import AppDBClient from '../config/appdb.js';

function reshapeDoc(doc) {
  if (!doc) return null;
  const copy = { ...doc };
  if (copy.id && !copy._id) {
    copy._id = copy.id;
  } else if (copy._id && !copy.id) {
    copy.id = copy._id;
  }
  return copy;
}

function matchesQuery(doc, query = {}) {
  if (!query || Object.keys(query).length === 0) return true;

  for (const [key, val] of Object.entries(query)) {
    if (key === '$or' && Array.isArray(val)) {
      const passesOr = val.some(subQuery => matchesQuery(doc, subQuery));
      if (!passesOr) return false;
      continue;
    }

    const docVal = doc[key] !== undefined ? doc[key] : (key === '_id' ? doc.id : (key === 'id' ? doc._id : undefined));

    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof RegExp)) {
      if ('$in' in val && Array.isArray(val.$in)) {
        if (!val.$in.map(String).includes(String(docVal))) return false;
      }
      if ('$nin' in val && Array.isArray(val.$nin)) {
        if (val.$nin.map(String).includes(String(docVal))) return false;
      }
      if ('$gte' in val && !(docVal >= val.$gte)) return false;
      if ('$lte' in val && !(docVal <= val.$lte)) return false;
      if ('$gt' in val && !(docVal > val.$gt)) return false;
      if ('$lt' in val && !(docVal < val.$lt)) return false;
      if ('$ne' in val && String(docVal) === String(val.$ne)) return false;
      if ('$regex' in val) {
        const reg = new RegExp(val.$regex, val.$options || '');
        if (!reg.test(String(docVal))) return false;
      }
    } else if (val instanceof RegExp) {
      if (!val.test(String(docVal))) return false;
    } else if (val !== undefined) {
      if (String(docVal) !== String(val)) return false;
    }
  }

  return true;
}

class AppDBQuery {
  constructor(promise) {
    this.promise = promise;
  }

  // TODO: not supported in AppDB, needs manual JS join
  populate() {
    return this;
  }

  sort() {
    return this;
  }

  select() {
    return this;
  }

  limit() {
    return this;
  }

  skip() {
    return this;
  }

  exec() {
    return this.promise;
  }

  then(onfulfilled, onrejected) {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch(onrejected) {
    return this.promise.catch(onrejected);
  }

  finally(onfinally) {
    return this.promise.finally(onfinally);
  }
}

export function createAdapter(collectionName) {
  return {
    async find(query = {}) {
      const promise = (async () => {
        const rawDocs = await AppDBClient.documents.fetchAll(collectionName);
        const filtered = (rawDocs || []).filter(doc => matchesQuery(doc, query));
        return filtered.map(reshapeDoc);
      })();
      return new AppDBQuery(promise);
    },

    async findOne(query = {}) {
      const promise = (async () => {
        const rawDocs = await AppDBClient.documents.fetchAll(collectionName);
        const found = (rawDocs || []).find(doc => matchesQuery(doc, query));
        return found ? reshapeDoc(found) : null;
      })();
      return new AppDBQuery(promise);
    },

    async findById(id) {
      const promise = (async () => {
        if (!id) return null;
        const targetId = String(id);
        const doc = await AppDBClient.documents.fetchDoc(collectionName, targetId);
        if (doc) return reshapeDoc(doc);
        const rawDocs = await AppDBClient.documents.fetchAll(collectionName);
        const found = (rawDocs || []).find(d => String(d.id || d._id) === targetId);
        return found ? reshapeDoc(found) : null;
      })();
      return new AppDBQuery(promise);
    },

    async create(data) {
      const payload = { ...data };
      if (!payload.id && payload._id) {
        payload.id = String(payload._id);
      }
      const created = await AppDBClient.documents.create(collectionName, payload);
      return reshapeDoc(created);
    },

    async findByIdAndUpdate(id, data, options = {}) {
      const targetId = String(id);
      const updated = await AppDBClient.documents.update(collectionName, targetId, data);
      return reshapeDoc(updated);
    },

    async findByIdAndDelete(id) {
      const targetId = String(id);
      const doc = await this.findById(targetId);
      await AppDBClient.documents.remove(collectionName, targetId);
      return doc;
    },

    async countDocuments(query = {}) {
      const rawDocs = await AppDBClient.documents.fetchAll(collectionName);
      const filtered = (rawDocs || []).filter(doc => matchesQuery(doc, query));
      return filtered.length;
    },

    async updateMany(query = {}, data = {}) {
      const rawDocs = await AppDBClient.documents.fetchAll(collectionName);
      const matching = (rawDocs || []).filter(doc => matchesQuery(doc, query));
      const results = [];
      for (const doc of matching) {
        const docId = String(doc.id || doc._id);
        const updated = await AppDBClient.documents.update(collectionName, docId, data);
        results.push(reshapeDoc(updated));
      }
      return { modifiedCount: results.length };
    },

    // TODO: not supported in AppDB, needs manual JS join
    async aggregate(pipeline = []) {
      return [];
    }
  };
}
