/**
 * ==============================================================================
 * AuraSync - Zero-Effort Mood Logger (mood-logger.js)
 * ==============================================================================
 * Menangkap pemicu stres tanpa membuat user menulis panjang.
 * - Muncul otomatis sebagai pop-up kecil saat status berubah jadi "waspada".
 * - 4 pilihan instan: Tugas/Kerjaan, Kurang Tidur, Suasana Hati, Tidak Tahu.
 * - Begitu diklik, data langsung tersimpan ke Firebase (users/{userId}/mood_logs/{timestamp})
 *   dan pop-up otomatis tertutup tanpa tombol submit terpisah.
 */

(function () {
  let modalOverlayEl = null;
  let lastRecordedStatus = "tenang";
  let lastModalOpenTime = 0;
  const COOLDOWN_MS = 60 * 1000; // Cooldown 1 menit agar tidak berulang-ulang mengganggu

  function createMoodModal() {
    if (document.getElementById("moodModalOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "moodModalOverlay";
    overlay.className = "modal-overlay";

    overlay.innerHTML = `
      <div class="mood-modal" role="dialog" aria-modal="true">
        <h3 class="mood-modal-title">Detak Tubuhmu Meningkat</h3>
        <p class="mood-modal-subtitle">Kira-kira apa pemicunya?</p>
        <div class="mood-options-grid">
          <button class="mood-opt-btn" data-trigger="tugas" id="btnMoodTugas">
            <span class="mood-opt-emoji">📚</span>
            <span class="mood-opt-label">Tugas/Kerjaan</span>
          </button>
          <button class="mood-opt-btn" data-trigger="kurang_tidur" id="btnMoodTidur">
            <span class="mood-opt-emoji">🌙</span>
            <span class="mood-opt-label">Kurang Tidur</span>
          </button>
          <button class="mood-opt-btn" data-trigger="suasana_hati" id="btnMoodMood">
            <span class="mood-opt-emoji">🌧️</span>
            <span class="mood-opt-label">Suasana Hati</span>
          </button>
          <button class="mood-opt-btn" data-trigger="tidak_tahu" id="btnMoodUnknown">
            <span class="mood-opt-emoji">❓</span>
            <span class="mood-opt-label">Tidak Tahu</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    modalOverlayEl = overlay;

    // Pasang event listener langsung ke tiap tombol pilihan
    const buttons = overlay.querySelectorAll(".mood-opt-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const trigger = btn.getAttribute("data-trigger");
        saveMoodLog(trigger);
        closeModal();
      });
    });

    // Menutup modal jika klik di luar box (overlay)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }

  function openModal() {
    if (!modalOverlayEl) createMoodModal();
    const now = Date.now();
    if (now - lastModalOpenTime < COOLDOWN_MS) return; // Mencegah spam
    lastModalOpenTime = now;
    modalOverlayEl.classList.add("active");
  }

  function closeModal() {
    if (modalOverlayEl) {
      modalOverlayEl.classList.remove("active");
    }
  }

  // Simpan mood log langsung ke Firebase
  function saveMoodLog(trigger) {
    const userId = window.getAuraSyncUserId ? window.getAuraSyncUserId() : "mock-user-123";
    const db = window.AuraSyncDB;
    if (!db) return;

    const timestamp = Date.now();
    db.ref(`users/${userId}/mood_logs/${timestamp}`).set({
      trigger: trigger
    }).then(() => {
      console.log(`📝 [Mood Logger] Tersimpan -> Pemicu: ${trigger}`);
    }).catch(err => {
      console.error("❌ [Mood Logger] Gagal menyimpan:", err);
    });
  }

  // Pantau bacaan terbaru dari Firebase untuk memicu pop-up
  function initMoodWatcher() {
    const userId = window.getAuraSyncUserId ? window.getAuraSyncUserId() : "mock-user-123";
    const db = window.AuraSyncDB;
    if (!db) return;

    db.ref(`users/${userId}/readings`).limitToLast(1).on("value", (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      const keys = Object.keys(data);
      if (keys.length === 0) return;

      const latest = data[keys[0]];
      const currentStatus = latest.status;

      // Picu pop-up hanya saat terjadi perubahan status dari "tenang" -> "waspada"
      if (currentStatus === "waspada" && lastRecordedStatus === "tenang") {
        console.log("⚠️ [Mood Logger] Status berganti ke Waspada -> Membuka Zero-Effort Mood Logger.");
        openModal();
      }

      lastRecordedStatus = currentStatus;
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    createMoodModal();
    initMoodWatcher();
  });

  // Ekspor agar bisa dipanggil manual jika dibutuhkan
  window.AuraSyncMoodLogger = {
    open: openModal,
    close: closeModal,
    log: saveMoodLog
  };
})();
