/**
 * ==============================================================================
 * AuraSync - Dummy Data Generator & ESP32 Simulator (dummy-data-generator.js)
 * ==============================================================================
 * Mensimulasikan gelang pintar Biomark-Stress Tracker (ESP32).
 * Menulis data secara periodik ke Firebase Realtime Database pada path:
 * users/{userId}/readings/{timestamp}: { bpm: number, gsr: number, status: "tenang" | "waspada" }
 *
 * Bila kelak hardware fisik ESP32 sudah siap, firmware Arduino/ESP32 tinggal
 * mengirim HTTP POST / Firebase push ke path yang sama persis!
 */

(function () {
  let timerId = null;
  let isRunning = false;
  let simulatedBpm = 76;
  let simulatedGsr = 380;
  let isSpikeActive = false;
  let spikeCountdown = 0;

  // Nilai acak dalam rentang min dan max
  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Tentukan status fisiologis berdasarkan BPM & GSR
  function evaluateStatus(bpm, gsr) {
    const cfg = (window.AURASYNC_CONFIG && window.AURASYNC_CONFIG.thresholds) || {
      highBpm: 95,
      highGsr: 580
    };
    if (bpm >= cfg.highBpm || gsr >= cfg.highGsr) {
      return "waspada";
    }
    return "tenang";
  }

  // Menghasilkan satu data pembacaan dan menyimpannya ke Firebase
  function generateReading(forcedSpike = false) {
    const userId = window.getAuraSyncUserId ? window.getAuraSyncUserId() : "mock-user-123";
    const db = window.AuraSyncDB;
    if (!db) return;

    if (forcedSpike) {
      isSpikeActive = true;
      spikeCountdown = 4; // Berlangsung selama 4 tick
    }

    if (isSpikeActive && spikeCountdown > 0) {
      // Kondisi Lonjakan Stres (High-Functioning Anxiety Spike)
      simulatedBpm = getRandom(102, 125);
      simulatedGsr = getRandom(620, 850);
      spikeCountdown--;
      if (spikeCountdown <= 0) {
        isSpikeActive = false;
      }
    } else {
      // Kondisi Normal / Fluktuasi Wajar
      // BPM bergerak perlahan naik/turun 1-3 poin
      const deltaBpm = getRandom(-2, 2);
      simulatedBpm = Math.max(65, Math.min(88, simulatedBpm + deltaBpm));

      // GSR fluktuasi wajar
      const deltaGsr = getRandom(-15, 15);
      simulatedGsr = Math.max(300, Math.min(480, simulatedGsr + deltaGsr));

      // Kemungkinan 5% terjadi stres alami sesekali
      if (Math.random() < 0.05) {
        simulatedBpm = getRandom(96, 110);
        simulatedGsr = getRandom(590, 710);
      }
    }

    const status = evaluateStatus(simulatedBpm, simulatedGsr);
    const timestamp = Date.now();

    const readingData = {
      bpm: simulatedBpm,
      gsr: simulatedGsr,
      status: status
    };

    // Tulis ke Firebase Realtime Database
    // Path persis sama dengan yang akan digunakan ESP32
    db.ref(`users/${userId}/readings/${timestamp}`).set(readingData)
      .then(() => {
        console.log(`📡 [ESP32 Sim] Terkirim -> BPM: ${simulatedBpm}, GSR: ${simulatedGsr}, Status: ${status}`);
      })
      .catch((err) => {
        console.error("❌ [ESP32 Sim] Gagal menulis data:", err);
      });

    return readingData;
  }

  // Memuat data histori awal (12 pembacaan) jika database masih kosong
  function seedInitialHistoryIfEmpty() {
    const userId = window.getAuraSyncUserId ? window.getAuraSyncUserId() : "mock-user-123";
    const db = window.AuraSyncDB;
    if (!db) return;

    db.ref(`users/${userId}/readings`).limitToLast(5).on("value", (snapshot) => {
      if (!snapshot.exists() || !snapshot.val()) {
        console.log("🌱 [ESP32 Sim] Database kosong, membuat riwayat awal...");
        const now = Date.now();
        const promises = [];
        // Buat 10 titik data ke belakang (interval 3 menit)
        for (let i = 10; i >= 1; i--) {
          const pastTime = now - (i * 180 * 1000);
          const isStressedSample = (i === 4 || i === 5);
          const bpm = isStressedSample ? getRandom(98, 115) : getRandom(68, 84);
          const gsr = isStressedSample ? getRandom(600, 720) : getRandom(340, 460);
          const status = evaluateStatus(bpm, gsr);
          promises.push(
            db.ref(`users/${userId}/readings/${pastTime}`).set({ bpm, gsr, status })
          );
        }
        // Tambahkan satu mood log contoh
        db.ref(`users/${userId}/mood_logs/${now - 3600000}`).set({
          trigger: "tugas"
        });
      }
    });
  }

  // Public API Simulator
  const AuraSyncSimulator = {
    start: function (intervalMs = 4000) {
      if (isRunning) return;
      isRunning = true;
      generateReading();
      timerId = setInterval(() => generateReading(), intervalMs);
      console.log(`⏱️ [ESP32 Sim] Dimulai (interval ${intervalMs / 1000} detik).`);
      this.notifyListeners();
    },

    stop: function () {
      if (!isRunning) return;
      isRunning = false;
      clearInterval(timerId);
      timerId = null;
      console.log("🛑 [ESP32 Sim] Dihentikan.");
      this.notifyListeners();
    },

    toggle: function () {
      if (isRunning) this.stop();
      else this.start();
    },

    triggerStressSpike: function () {
      console.log("⚡ [ESP32 Sim] Simulasi Lonjakan Stres Dipicu!");
      generateReading(true);
    },

    triggerEmergency: function (active = true) {
      const userId = window.getAuraSyncUserId ? window.getAuraSyncUserId() : "mock-user-123";
      const db = window.AuraSyncDB;
      if (!db) return;
      db.ref(`users/${userId}/emergency`).set({
        active: active,
        timestamp: Date.now()
      });
      console.log(`🚨 [ESP32 Sim] Status Emergency diubah menjadi: ${active}`);
    },

    isAutoRunning: function () {
      return isRunning;
    },

    listeners: [],
    subscribe: function (fn) {
      this.listeners.push(fn);
    },
    notifyListeners: function () {
      this.listeners.forEach(fn => fn(isRunning));
    },

    seedInitialHistory: seedInitialHistoryIfEmpty
  };

  // Jalankan seeding data awal otomatis setelah DOM siap
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(seedInitialHistoryIfEmpty, 800);
    // Otomatis jalankan simulasi default agar saat halaman dibuka langsung aktif
    AuraSyncSimulator.start(5000);
  });

  window.AuraSyncSimulator = AuraSyncSimulator;
})();
