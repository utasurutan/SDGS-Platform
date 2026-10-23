/**
 * ==============================================================================
 * AuraSync - Profile Page Logic (profile.js)
 * ==============================================================================
 * Menangani:
 * - Load data profil dari Firebase/Mock DB
 * - Edit & simpan profil (nama, umur, kontak darurat)
 * - Kalkulasi statistik dari data tersimpan
 * - Animasi entrance staggered
 * - Preferensi pengguna (tersimpan localStorage)
 */

document.addEventListener("DOMContentLoaded", () => {
  const auth = window.AuraSyncAuth;
  const db = window.AuraSyncDB;

  // Redirect jika belum login
  if (auth && auth.onAuthStateChanged) {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = "index.html";
        return;
      }
      initProfilePage(user);
    });
  } else {
    // Fallback mock
    initProfilePage({ uid: "mock-user-123", email: "siswa@aurasync.id", displayName: "Siswa SMK" });
  }

  function initProfilePage(user) {
    loadProfileData(user);
    loadStats(user);
    loadPreferences();
    setupEditHandlers(user);
    setupLogout();
    animateEntrance();
  }

  // ============================================================================
  // LOAD PROFILE DATA
  // ============================================================================
  function loadProfileData(user) {
    const userId = user.uid || "mock-user-123";

    // Set avatar
    const avatarEl = document.getElementById("profileAvatar");
    const nameEl = document.getElementById("profileName");
    const emailEl = document.getElementById("profileEmail");
    const memberSinceEl = document.getElementById("memberSince");

    // Input fields
    const inputNama = document.getElementById("editNama");
    const inputUmur = document.getElementById("editUmur");
    const inputEmail = document.getElementById("editEmail");
    const inputKontakNama = document.getElementById("editKontakNama");
    const inputKontakPhone = document.getElementById("editKontakPhone");

    if (db) {
      db.ref(`users/${userId}/profile`).on("value", (snapshot) => {
        const profile = snapshot.val() || {};

        const nama = profile.nama || user.displayName || "Pengguna";
        const email = user.email || "siswa@aurasync.id";
        const umur = profile.umur || 17;

        // Avatar initials
        const initials = nama.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
        if (avatarEl) avatarEl.textContent = initials;
        if (nameEl) nameEl.textContent = nama;
        if (emailEl) emailEl.textContent = email;
        if (memberSinceEl) {
          const joinDate = profile.joinDate || new Date().toISOString();
          memberSinceEl.textContent = `Bergabung sejak ${formatDate(joinDate)}`;
        }

        // Fill edit fields
        if (inputNama) inputNama.value = nama;
        if (inputUmur) inputUmur.value = umur;
        if (inputEmail) inputEmail.value = email;
        if (inputKontakNama) inputKontakNama.value = profile.nama_kontak || "Orang Tua / Wali";
        if (inputKontakPhone) inputKontakPhone.value = profile.kontak_darurat || "+6281234567890";
      });
    }
  }

  // ============================================================================
  // LOAD STATISTICS
  // ============================================================================
  function loadStats(user) {
    const userId = user.uid || "mock-user-123";

    // Mock stats — calculated from stored data or defaults
    let totalDays = 7;
    let avgBpm = 0;
    let moodCount = 0;
    let decompSessions = 0;
    let calmPercent = 0;

    if (db) {
      // Load readings for avg BPM
      db.ref(`users/${userId}/readings`).on("value", (snapshot) => {
        const readings = snapshot.val();
        if (readings && typeof readings === "object") {
          const values = Object.values(readings);
          const bpmValues = values.map(r => r.bpm).filter(Boolean);
          if (bpmValues.length > 0) {
            avgBpm = Math.round(bpmValues.reduce((a, b) => a + b, 0) / bpmValues.length);
          }
          // Count calm vs waspada
          const calmCount = values.filter(r => r.bpm < 95).length;
          calmPercent = values.length > 0 ? Math.round((calmCount / values.length) * 100) : 85;

          // Calculate active days
          const uniqueDays = new Set(values.map(r => {
            if (r.timestamp) return new Date(r.timestamp).toDateString();
            return null;
          }).filter(Boolean));
          totalDays = Math.max(uniqueDays.size, 1);
        } else {
          avgBpm = 78;
          calmPercent = 85;
        }

        updateStatDisplay("statDays", totalDays, "hari");
        updateStatDisplay("statBpm", avgBpm || 78, "BPM");
        updateStatDisplay("statCalm", calmPercent || 85, "%");
      });

      // Load mood logs count
      db.ref(`users/${userId}/mood_logs`).on("value", (snapshot) => {
        const logs = snapshot.val();
        if (logs && typeof logs === "object") {
          moodCount = Object.keys(logs).length;
        } else {
          moodCount = 12;
        }
        updateStatDisplay("statMood", moodCount, "log");
      });

      // Decomp sessions from localStorage
      decompSessions = parseInt(localStorage.getItem("aurasync_decomp_count") || "5");
      updateStatDisplay("statDecomp", decompSessions, "sesi");
    } else {
      // Pure mock defaults
      updateStatDisplay("statDays", 7, "hari");
      updateStatDisplay("statBpm", 78, "BPM");
      updateStatDisplay("statCalm", 85, "%");
      updateStatDisplay("statMood", 12, "log");
      updateStatDisplay("statDecomp", 5, "sesi");
    }
  }

  function updateStatDisplay(id, value, unit) {
    const el = document.getElementById(id);
    if (el) {
      const valSpan = el.querySelector(".stat-value");
      const unitSpan = el.querySelector(".stat-unit");
      if (valSpan) animateNumber(valSpan, 0, value, 800);
      if (unitSpan) unitSpan.textContent = unit;
    }
  }

  // Animated number counter
  function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ============================================================================
  // SAVE PROFILE
  // ============================================================================
  function setupEditHandlers(user) {
    const saveBtn = document.getElementById("btnSaveProfile");
    const saveKontakBtn = document.getElementById("btnSaveKontak");
    const userId = user.uid || "mock-user-123";

    if (saveBtn) {
      saveBtn.addEventListener("click", async () => {
        const nama = document.getElementById("editNama").value.trim();
        const umur = parseInt(document.getElementById("editUmur").value) || 17;

        if (!nama) {
          showToast("Nama tidak boleh kosong!", "error");
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = "Menyimpan...";

        try {
          if (db) {
            await db.ref(`users/${userId}/profile`).update({
              nama: nama,
              umur: umur
            });
          }
          showToast("Profil berhasil disimpan! ✅", "success");
        } catch (err) {
          console.error("Gagal simpan profil:", err);
          showToast("Gagal menyimpan profil", "error");
        }

        saveBtn.disabled = false;
        saveBtn.textContent = "Simpan Perubahan";
      });
    }

    if (saveKontakBtn) {
      saveKontakBtn.addEventListener("click", async () => {
        const kontakNama = document.getElementById("editKontakNama").value.trim();
        const kontakPhone = document.getElementById("editKontakPhone").value.trim();

        saveKontakBtn.disabled = true;
        saveKontakBtn.textContent = "Menyimpan...";

        try {
          if (db) {
            await db.ref(`users/${userId}/profile`).update({
              nama_kontak: kontakNama,
              kontak_darurat: kontakPhone
            });
          }
          showToast("Kontak darurat berhasil diperbarui! 🛡️", "success");
        } catch (err) {
          console.error("Gagal simpan kontak:", err);
          showToast("Gagal menyimpan kontak darurat", "error");
        }

        saveKontakBtn.disabled = false;
        saveKontakBtn.textContent = "Simpan Kontak";
      });
    }
  }

  // ============================================================================
  // PREFERENCES (localStorage)
  // ============================================================================
  function loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem("aurasync_prefs") || '{}');

    const toggleNotif = document.getElementById("toggleNotifikasi");
    const selectSensitivity = document.getElementById("selectSensitivity");

    if (toggleNotif) {
      toggleNotif.checked = prefs.notifEnabled !== false;
      toggleNotif.addEventListener("change", () => {
        savePreference("notifEnabled", toggleNotif.checked);
        showToast(toggleNotif.checked ? "Notifikasi darurat diaktifkan 🔔" : "Notifikasi darurat dinonaktifkan 🔕", "info");
      });
    }

    if (selectSensitivity) {
      selectSensitivity.value = prefs.sensitivity || "medium";
      selectSensitivity.addEventListener("change", () => {
        savePreference("sensitivity", selectSensitivity.value);
        const labels = { low: "Rendah", medium: "Sedang", high: "Tinggi" };
        showToast(`Sensitivitas deteksi: ${labels[selectSensitivity.value]} 🎚️`, "info");
      });
    }
  }

  function savePreference(key, value) {
    const prefs = JSON.parse(localStorage.getItem("aurasync_prefs") || '{}');
    prefs[key] = value;
    localStorage.setItem("aurasync_prefs", JSON.stringify(prefs));
  }

  // ============================================================================
  // LOGOUT
  // ============================================================================
  function setupLogout() {
    const btnLogout = document.getElementById("btnLogout");
    const btnLogoutBottom = document.getElementById("btnLogoutBottom");

    function doLogout() {
      if (auth && auth.signOut) {
        auth.signOut().then(() => {
          window.location.href = "index.html";
        });
      } else {
        window.location.href = "index.html";
      }
    }

    if (btnLogout) btnLogout.addEventListener("click", doLogout);
    if (btnLogoutBottom) btnLogoutBottom.addEventListener("click", doLogout);
  }

  // ============================================================================
  // TOAST NOTIFICATION
  // ============================================================================
  function showToast(message, type = "info") {
    // Remove existing toast
    const existing = document.querySelector(".profile-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `profile-toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ============================================================================
  // ENTRANCE ANIMATION (staggered)
  // ============================================================================
  function animateEntrance() {
    const sections = document.querySelectorAll(".profile-section");
    sections.forEach((section, index) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(24px)";
      section.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          section.style.opacity = "1";
          section.style.transform = "translateY(0)";
        });
      });
    });
  }

  // Helpers
  function formatDate(isoString) {
    try {
      const d = new Date(isoString);
      const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return "September 2026";
    }
  }
});
