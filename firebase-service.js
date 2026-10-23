/**
 * ==============================================================================
 * AuraSync - Firebase Service Module (firebase-service.js)
 * ==============================================================================
 * Menginisialisasi Firebase Authentication & Realtime Database.
 * Menyediakan transparansi: Jika Firebase API Key asli diisi di config.js,
 * maka akan langsung terhubung ke cloud Firebase.
 * Jika belum diisi, otomatis beralih ke Mock Mode (LocalStorage)
 * sehingga platform bisa langsung dites offline oleh pemula.
 */

(function () {
  const config = window.AURASYNC_CONFIG || {};
  const isKeyPlaceholder = !config.firebase || 
    config.firebase.apiKey === "GANTI_DENGAN_FIREBASE_API_KEY" ||
    config.firebase.apiKey.trim() === "";

  let authInstance = null;
  let dbInstance = null;
  let isUsingMock = false;

  // Cek apakah SDK Firebase CDN tersedia di window
  const hasFirebaseCDN = typeof firebase !== "undefined";

  if (!isKeyPlaceholder && hasFirebaseCDN) {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(config.firebase);
      }
      authInstance = firebase.auth();
      dbInstance = firebase.database();
      console.log("🟢 [AuraSync] Terhubung ke Firebase Cloud asli!");
    } catch (err) {
      console.warn("⚠️ [AuraSync] Gagal inisialisasi Firebase Cloud, beralih ke Mock Mode:", err);
      isUsingMock = true;
    }
  } else {
    isUsingMock = true;
    console.info("💡 [AuraSync] Mode Simulasi Lokal (Mock Mode) Aktif. Siap pakai tanpa konfigurasi cloud.");
  }

  // ============================================================================
  // IMPLEMENTASI MOCK DATABASE & AUTH UNTUK TESTING LOKAL
  // ============================================================================
  if (isUsingMock) {
    const STORAGE_KEY = "aurasync_mock_db";

    function getMockDb() {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {
        users: {
          "mock-user-123": {
            profile: { nama: "Siswa SMK", umur: 17, kontak_darurat: config.emergency?.defaultPhone || "+6281234567890" },
            emergency: { active: false, timestamp: Date.now() },
            readings: {},
            mood_logs: {},
            ai_insight: {},
            chat_history: {}
          }
        }
      };
    }

    function saveMockDb(data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Observer listeners sederhana untuk event real-time mock
    const mockListeners = [];

    function triggerMockListeners(path) {
      const data = getMockDb();
      mockListeners.forEach(listener => {
        if (listener.path.startsWith(path) || path.startsWith(listener.path)) {
          const val = resolvePath(data, listener.path);
          listener.callback({
            val: () => val,
            exists: () => val !== undefined && val !== null,
            forEach: (fn) => {
              if (val && typeof val === "object") {
                Object.keys(val).forEach(k => fn({ key: k, val: () => val[k] }));
              }
            }
          });
        }
      });
    }

    function resolvePath(obj, path) {
      const parts = path.split("/").filter(Boolean);
      let curr = obj;
      for (const p of parts) {
        if (!curr || typeof curr !== "object") return null;
        curr = curr[p];
      }
      return curr;
    }

    function setPath(obj, path, value) {
      const parts = path.split("/").filter(Boolean);
      let curr = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (!curr[p] || typeof curr[p] !== "object") curr[p] = {};
        curr = curr[p];
      }
      curr[parts[parts.length - 1]] = value;
    }

    // Mock Database API
    dbInstance = {
      isMock: true,
      ref: function (path) {
        const cleanPath = path.startsWith("/") ? path.substring(1) : path;
        return {
          on: function (eventType, callback) {
            mockListeners.push({ path: cleanPath, callback });
            // Panggil sekali untuk data awal
            const data = getMockDb();
            const val = resolvePath(data, cleanPath);
            setTimeout(() => {
              callback({
                val: () => val,
                exists: () => val !== undefined && val !== null,
                forEach: (fn) => {
                  if (val && typeof val === "object") {
                    Object.keys(val).forEach(k => fn({ key: k, val: () => val[k] }));
                  }
                }
              });
            }, 50);
          },
          set: function (value) {
            return new Promise((resolve) => {
              const data = getMockDb();
              setPath(data, cleanPath, value);
              saveMockDb(data);
              triggerMockListeners(cleanPath);
              resolve();
            });
          },
          update: function (value) {
            return new Promise((resolve) => {
              const data = getMockDb();
              const curr = resolvePath(data, cleanPath) || {};
              setPath(data, cleanPath, { ...curr, ...value });
              saveMockDb(data);
              triggerMockListeners(cleanPath);
              resolve();
            });
          },
          push: function (value) {
            return new Promise((resolve) => {
              const data = getMockDb();
              const autoId = "id_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
              const itemPath = cleanPath + "/" + autoId;
              setPath(data, itemPath, value);
              saveMockDb(data);
              triggerMockListeners(cleanPath);
              resolve({ key: autoId });
            });
          },
          limitToLast: function (n) {
            return {
              on: function (eventType, callback) {
                dbInstance.ref(cleanPath).on(eventType, (snapshot) => {
                  const val = snapshot.val();
                  if (!val || typeof val !== "object") {
                    callback(snapshot);
                    return;
                  }
                  const keys = Object.keys(val).sort();
                  const slicedKeys = keys.slice(-n);
                  const limitedVal = {};
                  slicedKeys.forEach(k => { limitedVal[k] = val[k]; });
                  callback({
                    val: () => limitedVal,
                    exists: () => Object.keys(limitedVal).length > 0,
                    forEach: (fn) => {
                      slicedKeys.forEach(k => fn({ key: k, val: () => limitedVal[k] }));
                    }
                  });
                });
              }
            };
          }
        };
      }
    };

    // Mock Auth API
    let currentMockUser = JSON.parse(localStorage.getItem("aurasync_mock_user") || '{"uid":"mock-user-123","email":"siswa@aurasync.id","displayName":"Siswa SMK"}');
    const authStateListeners = [];

    authInstance = {
      isMock: true,
      get currentUser() {
        return currentMockUser;
      },
      onAuthStateChanged: function (callback) {
        authStateListeners.push(callback);
        setTimeout(() => callback(currentMockUser), 50);
        return () => {
          const idx = authStateListeners.indexOf(callback);
          if (idx > -1) authStateListeners.splice(idx, 1);
        };
      },
      signInWithEmailAndPassword: function (email, password) {
        return new Promise((resolve) => {
          currentMockUser = {
            uid: "mock-user-123",
            email: email,
            displayName: email.split("@")[0]
          };
          localStorage.setItem("aurasync_mock_user", JSON.stringify(currentMockUser));
          authStateListeners.forEach(fn => fn(currentMockUser));
          resolve({ user: currentMockUser });
        });
      },
      createUserWithEmailAndPassword: function (email, password) {
        return new Promise((resolve) => {
          currentMockUser = {
            uid: "mock-user-123",
            email: email,
            displayName: email.split("@")[0]
          };
          localStorage.setItem("aurasync_mock_user", JSON.stringify(currentMockUser));
          authStateListeners.forEach(fn => fn(currentMockUser));
          resolve({ user: currentMockUser });
        });
      },
      signOut: function () {
        return new Promise((resolve) => {
          currentMockUser = null;
          localStorage.removeItem("aurasync_mock_user");
          authStateListeners.forEach(fn => fn(null));
          resolve();
        });
      }
    };
  }

  // Ekspor API yang seragam ke global window
  window.AuraSyncAuth = authInstance;
  window.AuraSyncDB = dbInstance;
  window.AuraSyncIsMock = isUsingMock;

  // Helper praktis mendapatkan User ID saat ini
  window.getAuraSyncUserId = function () {
    if (authInstance && authInstance.currentUser) {
      return authInstance.currentUser.uid;
    }
    return "mock-user-123";
  };
})();
