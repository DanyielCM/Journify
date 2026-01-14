// Simple in-memory cache with TTL
// Usage: cache.set(key, value, ttlSeconds)
//        cache.get(key)
//        cache.del(key)
//        cache.clear()

const map = new Map();

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

export const cache = {
  get(key) {
    const entry = map.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt <= nowSeconds()) {
      map.delete(key);
      return null;
    }
    return entry.value;
  },

  set(key, value, ttlSeconds = 60) {
    const expiresAt = ttlSeconds > 0 ? nowSeconds() + ttlSeconds : null;
    map.set(key, { value, expiresAt });
  },

  del(key) {
    map.delete(key);
  },

  clear() {
    map.clear();
  },
};
