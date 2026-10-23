/**
 * ==============================================================================
 * AuraSync - File Konfigurasi Terpusat (config.js)
 * ==============================================================================
 * PANDUAN SISWA/GURU:
 * Semua kunci API (Firebase & Google Gemini) disimpan HANYA di file ini,
 * agar mudah diganti saat presentasi atau saat memindahkan ke akun baru.
 */

const AURASYNC_CONFIG = {
  // ---------------------------------------------------------------------------
  // 1. KONFIGURASI FIREBASE REALTIME DATABASE & AUTHENTICATION
  // ---------------------------------------------------------------------------
  // Cara mendapatkan:
  // 1. Buka https://console.firebase.google.com/
  // 2. Buat Project baru (misal: "AuraSync-IoT")
  // 3. Tambahkan Web App (</>) dan salin konfigurasi di bawah ini
  // 4. Aktifkan "Authentication" (metode Email/Password)
  // 5. Aktifkan "Realtime Database" (pilih mode pengujian / test mode)
  firebase: {
    apiKey: "AIzaSyDHYiMIZvk7l5dHmTwZhhAPCewKe52DEmU",
    authDomain: "wristband-4bc4b.firebaseapp.com",
    databaseURL: "https://wristband-4bc4b-default-rtdb.firebaseio.com",
    projectId: "wristband-4bc4b",
    storageBucket: "wristband-4bc4b.firebasestorage.app",
    messagingSenderId: "189589637523",
    appId: "1:189589637523:web:f53a7efff7c1c226e20066"
  },

  // ---------------------------------------------------------------------------
  // 2. GOOGLE GEMINI API KEY (AI INSIGHT & CHATBOT)
  // ---------------------------------------------------------------------------
  // Cara mendapatkan API Key GRATIS:
  // 1. Buka https://aistudio.google.com/
  // 2. Klik "Get API key" -> "Create API key"
  // 3. Tempelkan (paste) string kunci di bawah ini:
  gemini: {
    apiKey: "GANTI_DENGAN_GEMINI_API_KEY",
    model: "gemini-1.5-flash" // Cepat, hemat kuota, dan gratis
  },

  // ---------------------------------------------------------------------------
  // 3. RULE & THRESHOLD STRES (BIOMARK)
  // ---------------------------------------------------------------------------
  // Ambang batas fisiologis untuk deteksi "Waspada" (High-Functioning Anxiety)
  // BPM: Denyut nadi istirahat normal remaja 60-100 bpm
  // GSR (Galvanic Skin Response): Konduktansi kulit meningkat saat berkeringat stres
  thresholds: {
    highBpm: 95,           // Jika BPM >= 95 bpm
    highGsr: 580,          // Nilai analog konduktansi GSR stres (skala 0 - 1023)
    spikeGsrDelta: 70      // Kenaikan mendadak dalam beberapa menit
  },

  // ---------------------------------------------------------------------------
  // 4. KONTAK DARURAT DEFAULT (EMERGENCY MODE)
  // ---------------------------------------------------------------------------
  emergency: {
    defaultContactName: "Ibu / Wali / Sahabat Terdekat",
    defaultPhone: "+6281234567890" // Format internasional untuk tel: link
  },

  // ---------------------------------------------------------------------------
  // 5. MODE SIMULASI OTOMATIS (DEMO / FALLBACK)
  // ---------------------------------------------------------------------------
  // Jika apiKey masih bernilai default / belum diganti pengguna,
  // sistem otomatis beralih ke Mock Mode (penyimpanan LocalStorage)
  // agar guru/penguji tetap bisa melihat fungsionalitas platform tanpa error!
  isMockModeAllowed: true
};

// Ekspor ke window agar bisa diakses di semua script vanilla JS
window.AURASYNC_CONFIG = AURASYNC_CONFIG;
