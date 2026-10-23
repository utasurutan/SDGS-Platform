/**
 * ==============================================================================
 * AuraSync - Emergency Handler & Global Override (emergency-handler.js)
 * ==============================================================================
 * Mendengarkan secara real-time perubahan status pada node:
 * users/{userId}/emergency/active
 * 
 * Ketika bernilai TRUE (dipicu tombol fisik di gelang IoT atau tombol dev tester),
 * seluruh halaman di-override menjadi layar darurat minimalis berisi 2 tombol besar:
 * 1. "Mulai Relaksasi" (mengarahkan ke Decompression Room)
 * 2. "Hubungi Orang Terdekat" (dialer nomor kontak darurat)
 */

(function () {
  let emergencyOverlayEl = null;
  let emergencyContactPhone = "+6281234567890";
  let emergencyContactName = "Orang Terdekat";

  // Ambil profil kontak darurat
  function fetchEmergencyContact() {
    const userId = window.getAuraSyncUserId ? window.getAuraSyncUserId() : "mock-user-123";
    const db = window.AuraSyncDB;
    if (!db) return;

    db.ref(`users/${userId}/profile`).on("value", (snapshot) => {
      const data = snapshot.val();
      if (data && data.kontak_darurat) {
        emergencyContactPhone = data.kontak_darurat;
      } else if (window.AURASYNC_CONFIG && window.AURASYNC_CONFIG.emergency) {
        emergencyContactPhone = window.AURASYNC_CONFIG.emergency.defaultPhone;
      }
      if (data && data.nama_kontak) {
        emergencyContactName = data.nama_kontak;
      }
      updateEmergencyScreenContent();
    });
  }

  // Buat elemen overlay di body
  function createEmergencyOverlay() {
    if (document.getElementById("emergencyOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "emergencyOverlay";
    overlay.className = "emergency-screen-override";
    overlay.style.display = "none";

    overlay.innerHTML = `
      <div class="emergency-alert-badge">
        <span>🚨</span> SINYAL DARURAT AKTIF (BIOMARK IoT)
      </div>
      <h1 class="emergency-title">Kamu Sedang Tidak Sendirian</h1>
      <p class="emergency-desc">Gelang Biomark mendeteksi lonjakan stres ekstrem. Tenangkan dirimu perlahan, bantuan selalu tersedia.</p>
      
      <div class="emergency-actions">
        <a href="decompression.html" class="emergency-btn btn-emergency-relax" id="btnEmergencyRelax">
          <span>🌿</span> Mulai Relaksasi
        </a>
        <a href="tel:${emergencyContactPhone}" class="emergency-btn btn-emergency-call" id="btnEmergencyCall">
          <span>📞</span> Hubungi Orang Terdekat
        </a>
      </div>

      <button class="btn-emergency-dismiss" id="btnEmergencyDismiss">
        Saya sudah merasa baikan (Matikan Darurat)
      </button>
    `;

    document.body.appendChild(overlay);
    emergencyOverlayEl = overlay;

    // Listener tombol matikan status darurat
    const dismissBtn = document.getElementById("btnEmergencyDismiss");
    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        deactivateEmergency();
      });
    }

    // Listener tombol mulai relaksasi: matikan status darurat dulu sebelum berpindah
    const relaxBtn = document.getElementById("btnEmergencyRelax");
    if (relaxBtn) {
      relaxBtn.addEventListener("click", (e) => {
        deactivateEmergency();
      });
    }
  }

  function updateEmergencyScreenContent() {
    const callBtn = document.getElementById("btnEmergencyCall");
    if (callBtn) {
      callBtn.href = `tel:${emergencyContactPhone}`;
      callBtn.innerHTML = `<span>📞</span> Hubungi ${emergencyContactName} (${emergencyContactPhone})`;
    }
  }

  function activateEmergencyScreen() {
    if (!emergencyOverlayEl) createEmergencyOverlay();
    emergencyOverlayEl.style.display = "flex";
  }

  function hideEmergencyScreen() {
    if (emergencyOverlayEl) {
      emergencyOverlayEl.style.display = "none";
    }
  }

  function deactivateEmergency() {
    const userId = window.getAuraSyncUserId ? window.getAuraSyncUserId() : "mock-user-123";
    const db = window.AuraSyncDB;
    if (db) {
      db.ref(`users/${userId}/emergency`).set({
        active: false,
        timestamp: Date.now()
      });
    }
    hideEmergencyScreen();
  }

  // Listener real-time Firebase untuk status emergency
  function initEmergencyListener() {
    const userId = window.getAuraSyncUserId ? window.getAuraSyncUserId() : "mock-user-123";
    const db = window.AuraSyncDB;
    if (!db) return;

    db.ref(`users/${userId}/emergency/active`).on("value", (snapshot) => {
      const isActive = snapshot.val() === true;
      if (isActive) {
        console.warn("🚨 [AuraSync] Emergency Mode Real-time TRIGGERED!");
        activateEmergencyScreen();
      } else {
        hideEmergencyScreen();
      }
    });
  }

  // Floating Developer Panel untuk testing simulasi lonjakan & darurat
  function injectDevFloatingWidget() {
    if (document.getElementById("auraSyncDevWidget")) return;

    const widget = document.createElement("div");
    widget.id = "auraSyncDevWidget";
    widget.className = "floating-dev-widget";

    widget.innerHTML = `
      <div class="dev-widget-panel" id="devWidgetPanel">
        <div class="dev-widget-title">⚙️ Panel Penguji (IoT Tester)</div>
        <div class="dev-btn-row">
          <button class="dev-btn" id="devToggleSim">
            ⏱️ <span id="devSimStatusText">Sensor Simulasi: Aktif</span>
          </button>
          <button class="dev-btn" id="devTriggerSpike">
            ⚡ Simulasi Lonjakan Stres
          </button>
          <button class="dev-btn" id="devTriggerEmergency" style="color:#f87171;">
            🚨 Pemicu Tombol Gelang Darurat
          </button>
        </div>
      </div>
      <button class="dev-widget-pill" id="devWidgetToggleBtn" title="Buka Panel Penguji IoT">
        <span>⚡</span> Simulasi Gelang
      </button>
    `;

    document.body.appendChild(widget);

    const toggleBtn = document.getElementById("devWidgetToggleBtn");
    const panel = document.getElementById("devWidgetPanel");
    const devToggleSim = document.getElementById("devToggleSim");
    const devSimStatusText = document.getElementById("devSimStatusText");
    const devTriggerSpike = document.getElementById("devTriggerSpike");
    const devTriggerEmergency = document.getElementById("devTriggerEmergency");

    toggleBtn.addEventListener("click", () => {
      panel.classList.toggle("open");
    });

    devToggleSim.addEventListener("click", () => {
      if (window.AuraSyncSimulator) {
        window.AuraSyncSimulator.toggle();
        const active = window.AuraSyncSimulator.isAutoRunning();
        devSimStatusText.innerText = active ? "Sensor Simulasi: Aktif" : "Sensor Simulasi: Berhenti";
      }
    });

    devTriggerSpike.addEventListener("click", () => {
      if (window.AuraSyncSimulator) {
        window.AuraSyncSimulator.triggerStressSpike();
      }
    });

    devTriggerEmergency.addEventListener("click", () => {
      if (window.AuraSyncSimulator) {
        window.AuraSyncSimulator.triggerEmergency(true);
      }
    });
  }

  // Inisialisasi saat DOM dimuat
  window.addEventListener("DOMContentLoaded", () => {
    createEmergencyOverlay();
    fetchEmergencyContact();
    initEmergencyListener();
    injectDevFloatingWidget();
  });
})();
