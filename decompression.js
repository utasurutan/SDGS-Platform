/**
 * ==============================================================================
 * AuraSync - Decompression Room Logic (decompression.js)
 * ==============================================================================
 * Menyediakan 3 pilihan terapi digital instan:
 * 1. Binaural Beats (Audio Alfa 10Hz)
 * 2. White Noise (Derau lembut penenang)
 * 3. Grounding Visual (Latihan ritme napas 4-7-8 dengan lingkaran dinamis)
 * 
 * Dilengkapi saran personal dari Gemini AI berdasarkan status fisik & mood_log terakhir.
 */

document.addEventListener("DOMContentLoaded", () => {
  const auth = window.AuraSyncAuth;
  const db = window.AuraSyncDB;
  const aiService = window.AuraSyncAI;
  const audioService = window.AuraSyncAudio;

  // Elemen DOM
  const aiSuggestionText = document.getElementById("aiSuggestionText");
  const therapyCards = document.querySelectorAll(".therapy-card");
  const audioPlayerSection = document.getElementById("audioPlayerSection");
  const visualGroundingSection = document.getElementById("visualGroundingSection");
  const currentTherapyTitle = document.getElementById("currentTherapyTitle");
  const currentTherapyDesc = document.getElementById("currentTherapyDesc");
  const btnPlayPause = document.getElementById("btnPlayPause");
  const volumeSlider = document.getElementById("volumeSlider");
  const btnLogout = document.getElementById("btnLogout");

  // Elemen Grounding Visual
  const breathingCircle = document.getElementById("breathingCircle");
  const breathingInstruction = document.getElementById("breathingInstruction");
  const breathingTimer = document.getElementById("breathingTimer");
  const btnToggleBreathing = document.getElementById("btnToggleBreathing");

  let activeMode = "binaural"; // "binaural" | "whitenoise" | "visual"
  let isAudioPlaying = false;
  let isBreathingActive = false;
  let breathingInterval = null;

  // Auth Guard
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    loadPersonalizedSuggestion(user.uid);
  });

  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      audioService.stopAll();
      await auth.signOut();
      window.location.href = "index.html";
    });
  }

  // 1. MEMUAT SARAN PERSONAL DARI GEMINI AI
  async function loadPersonalizedSuggestion(userId) {
    if (!db) return;

    let currentStatus = "tenang";
    let latestTrigger = "tugas";

    // Ambil bacaan status terbaru
    db.ref(`users/${userId}/readings`).limitToLast(1).on("value", async (snap) => {
      const val = snap.val();
      if (val) {
        const keys = Object.keys(val);
        if (keys.length > 0) currentStatus = val[keys[0]].status;
      }

      // Ambil mood log terakhir
      db.ref(`users/${userId}/mood_logs`).limitToLast(1).on("value", async (moodSnap) => {
        const moodVal = moodSnap.val();
        if (moodVal) {
          const mKeys = Object.keys(moodVal);
          if (mKeys.length > 0) latestTrigger = moodVal[mKeys[0]].trigger;
        }

        const suggestion = await aiService.getDecompressionSuggestion(currentStatus, latestTrigger);
        if (aiSuggestionText) {
          aiSuggestionText.innerText = suggestion;
        }
      });
    });
  }

  // 2. PEMILIHAN KARTU TERAPI
  therapyCards.forEach((card) => {
    card.addEventListener("click", () => {
      therapyCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const selected = card.getAttribute("data-mode");
      selectTherapy(selected);
    });
  });

  function selectTherapy(mode) {
    // Hentikan audio dan pernapasan sebelumnya
    stopAudio();
    stopBreathingExercise();

    activeMode = mode;

    if (mode === "visual") {
      audioPlayerSection.style.display = "none";
      visualGroundingSection.style.display = "block";
      startBreathingExercise();
    } else {
      visualGroundingSection.style.display = "none";
      audioPlayerSection.style.display = "block";

      if (mode === "binaural") {
        currentTherapyTitle.innerText = "Binaural Beats (Gelombang Alfa 10 Hz)";
        currentTherapyDesc.innerText = "Gunakan earphone/headphone untuk efek optimal menyelaraskan kedua belahan otak.";
      } else if (mode === "whitenoise") {
        currentTherapyTitle.innerText = "White Noise (Desau Angin & Hujan Halus)";
        currentTherapyDesc.innerText = "Menyelimuti kebisingan sekitar dan membantu meredakan overthinking seketika.";
      }
    }
  }

  // 3. KONTROL AUDIO (PLAY/PAUSE & VOLUME)
  if (btnPlayPause) {
    btnPlayPause.addEventListener("click", () => {
      if (isAudioPlaying) {
        stopAudio();
      } else {
        startAudio();
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      const vol = parseFloat(e.target.value);
      audioService.setVolume(vol);
    });
  }

  function startAudio() {
    if (activeMode === "binaural") {
      audioService.startBinauralBeats();
    } else if (activeMode === "whitenoise") {
      audioService.startWhiteNoise();
    }
    isAudioPlaying = true;
    btnPlayPause.innerHTML = "⏸️";
    btnPlayPause.setAttribute("title", "Jeda Audio");
  }

  function stopAudio() {
    audioService.stopAll();
    isAudioPlaying = false;
    if (btnPlayPause) {
      btnPlayPause.innerHTML = "▶️";
      btnPlayPause.setAttribute("title", "Putar Audio");
    }
  }

  // 4. KONTROL GROUNDING VISUAL (RITME NAPAS 4-7-8)
  if (btnToggleBreathing) {
    btnToggleBreathing.addEventListener("click", () => {
      if (isBreathingActive) {
        stopBreathingExercise();
      } else {
        startBreathingExercise();
      }
    });
  }

  function startBreathingExercise() {
    isBreathingActive = true;
    if (btnToggleBreathing) {
      btnToggleBreathing.innerText = "Hentikan Latihan";
    }
    runBreathingCycle();
  }

  function stopBreathingExercise() {
    isBreathingActive = false;
    clearTimeout(breathingInterval);
    if (breathingCircle) {
      breathingCircle.className = "breathing-circle";
    }
    if (breathingInstruction) {
      breathingInstruction.innerText = "Siap Mulai";
    }
    if (breathingTimer) {
      breathingTimer.innerText = "Tekan tombol untuk mulai bernapas";
    }
    if (btnToggleBreathing) {
      btnToggleBreathing.innerText = "Mulai Latihan Napas";
    }
  }

  function runBreathingCycle() {
    if (!isBreathingActive) return;

    // FASE 1: TARIK NAPAS (4 Detik)
    breathingInstruction.innerText = "Tarik Napas Perlahan (Hidung)";
    breathingTimer.innerText = "4 detik...";
    breathingCircle.className = "breathing-circle inhale";

    breathingInterval = setTimeout(() => {
      if (!isBreathingActive) return;

      // FASE 2: TAHAN NAPAS (7 Detik)
      breathingInstruction.innerText = "Tahan Napas...";
      breathingTimer.innerText = "7 detik...";
      breathingCircle.className = "breathing-circle hold";

      breathingInterval = setTimeout(() => {
        if (!isBreathingActive) return;

        // FASE 3: HEMBUSKAN NAPAS (8 Detik)
        breathingInstruction.innerText = "Hembuskan Perlahan (Mulut)";
        breathingTimer.innerText = "8 detik...";
        breathingCircle.className = "breathing-circle exhale";

        breathingInterval = setTimeout(() => {
          if (!isBreathingActive) return;
          // Ulangi siklus
          runBreathingCycle();
        }, 8000);

      }, 7000);

    }, 4000);
  }

  // Set default opsi pertama saat dibuka
  selectTherapy("binaural");
});
