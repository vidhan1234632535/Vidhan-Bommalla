// Highly robust, self-healing, quota-aware image storage utility
// Works seamlessly in sandboxed iframes and handles storage quota limits gracefully

const DB_NAME = "resolve-studio-image-db";
const STORE_NAME = "images-store";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment."));
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error || new Error("Failed to open IndexedDB"));
      };
    } catch (e) {
      reject(e);
    }
  });

  return dbPromise;
}

/**
 * Save an item to IndexedDB (asynchronous, optional fallback)
 */
export async function setIndexedDBItem(key: string, value: any): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn(`IndexedDB is disabled or unavailable for key "${key}":`, error);
  }
}

/**
 * Retrieve an item from IndexedDB
 */
export async function getIndexedDBItem<T = any>(key: string): Promise<T | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result !== undefined ? request.result : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn(`IndexedDB read failed or is blocked for key "${key}":`, error);
    return null;
  }
}

/**
 * Remove an item from IndexedDB
 */
export async function removeIndexedDBItem(key: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn(`IndexedDB delete failed for key "${key}":`, error);
  }
}

/**
 * Compresses a base64 image down to optimized dimensions and quality.
 * If the image is extremely large, this prevents crashing browser memory or storage.
 */
export function compressImage(
  base64Str: string,
  maxWidth = 800,
  maxHeight = 450,
  quality = 0.6
): Promise<string> {
  return new Promise((resolve) => {
    // If it's not a standard base64 image, resolve as-is
    if (!base64Str || !base64Str.startsWith("data:image")) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(base64Str);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // We use JPEG for supreme compression ratio
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      } catch (e) {
        console.error("Canvas compression failed, falling back to original base64:", e);
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}

/**
 * Unified helper to save any image-related string key-value safely.
 * Under the hood, it compresses the image and saves to BOTH localStorage and IndexedDB.
 * If localStorage quota is full, it dynamically downscales and re-compresses the image
 * until it safely fits within the storage quota!
 */
export async function saveImageSafely(
  key: string,
  base64Url: string,
  maxWidth = 800,
  maxHeight = 450,
  initialQuality = 0.6
): Promise<string> {
  if (!base64Url || !base64Url.startsWith("data:image")) {
    // Non-image or standard URL, save as-is
    try {
      localStorage.setItem(key, base64Url);
    } catch (_) {}
    await setIndexedDBItem(key, base64Url);
    return base64Url;
  }

  // Compress first
  let compressed = await compressImage(base64Url, maxWidth, maxHeight, initialQuality);

  // Attempt to save to IndexedDB first (can handle larger files)
  await setIndexedDBItem(key, compressed);

  // Attempt to save to localStorage with progressive compression fallback if quota is exceeded
  let success = false;
  let currentWidth = maxWidth;
  let currentHeight = maxHeight;
  let currentQuality = initialQuality;

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      localStorage.setItem(key, compressed);
      success = true;
      break;
    } catch (e) {
      // If quota exceeded, compress further (decrease resolution and quality)
      console.warn(`Quota exceeded for localStorage key "${key}". Compressing further (attempt ${attempt + 1})...`);
      currentWidth = Math.round(currentWidth * 0.7);
      currentHeight = Math.round(currentHeight * 0.7);
      currentQuality = Math.max(0.3, currentQuality - 0.15);
      
      compressed = await compressImage(base64Url, currentWidth, currentHeight, currentQuality);
      // Re-save the even more compressed version in IndexedDB too
      await setIndexedDBItem(key, compressed);
    }
  }

  if (!success) {
    console.error(`Critically failed to save image to localStorage for key "${key}" even after intensive compression.`);
  }

  return compressed;
}

/**
 * Unified helper to load an image-related string key-value.
 * Sync-first from localStorage, falling back to IndexedDB asynchronously,
 * and self-healing localStorage if it was missing or cleared.
 */
export async function loadImageSafely(key: string, fallbackDefaultValue = ""): Promise<string> {
  // 1. Try localStorage first (instant, works in sandboxed iframe)
  try {
    const localVal = localStorage.getItem(key);
    if (localVal) return localVal;
  } catch (_) {}

  // 2. Try IndexedDB as fallback (if localStorage was cleared or quota was tight initially)
  try {
    const indexedVal = await getIndexedDBItem<string>(key);
    if (indexedVal) {
      // Heal localStorage for the next synchronous load
      try {
        localStorage.setItem(key, indexedVal);
      } catch (_) {}
      return indexedVal;
    }
  } catch (_) {}

  return fallbackDefaultValue;
}

/**
 * Unified helper to delete an image
 */
export async function removeImageSafely(key: string): Promise<void> {
  try {
    localStorage.removeItem(key);
  } catch (_) {}
  await removeIndexedDBItem(key);
}
