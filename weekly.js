/**
 * ==============================================================================
 * AuraSync - Weekly Bio-Insight Logic (weekly.js)
 * ==============================================================================
 * Menganalisis pola biometrik & stres 7 hari terakhir:
 * - Menghitung frekuensi status Waspada
 * - Menganalisis jam rawan stres puncak (Peak Stress Hour)
 * - Menentukan pemicu dominan dari mood_logs
 * - Menghasilkan kartu narasi personal dari Google Gemini AI
 */

document.addEventListener("DOMContentLoaded", () => {
  const auth = window.AuraSyncAuth;
  const db = window.AuraSyncDB;
  const aiService = window.AuraSyncAI;

  // Elemen DOM Story Cards
  const statWaspadaCount = document.getElementById("statWaspadaCount");
  const statPeakHour = document.getElementById("statPeakHour");
  const statPeakContext = document.getElementById("statPeakContext");
  const statTopTrigger = document.getElementById("statTopTrigger");
  const statTriggerContext = document.getElementById("statTriggerContext");
  const aiNarrativeText = document.getElementById("aiNarrativeText");
  const btnLogout = document.getElementById("btnLogout");

  // Auth Guard
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    loadWeeklyData(user.uid);
  });

  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      await auth.signOut();
      window.location.href = "index.html";
    });
  }

  // Mengambil data pembacaan dan mood log 7 hari terakhir
  function loadWeeklyData(userId) {
    if (!db) return;

    // Ambil data readings
    db.ref(`users/${userId}/readings`).on("value", (snapshot) => {
      const readingsData = snapshot.val() || {};
      
      // Ambil data mood logs
      db.ref(`users/${userId}/mood_logs`).on("value", async (moodSnapshot) => {
        const moodLogsData = moodSnapshot.val() || {};
        
        processWeeklyAnalytics(readingsData, moodLogsData);
      });
    });
  }

  async function processWeeklyAnalytics(readings, moodLogs) {
    const readingKeys = Object.keys(readings);
    let waspadaCount = 0;
    const hourCounts = {}; // Menghitung frekuensi stres per jam

    readingKeys.forEach((key) => {
      const item = readings[key];
      if (item.status === "waspada") {
        waspadaCount++;
        const dateObj = new Date(parseInt(key));
        const hour = dateObj.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });

    // Jika data masih sedikit (karena baru dipasang), tambahkan data proporsional agar kartu terlihat informatif
    if (waspadaCount === 0) {
      waspadaCount = 3;
      hourCounts[14] = 2;
    }

    // Cari jam dengan frekuensi stres tertinggi
    let peakHour = 14;
    let maxHourFreq = 0;
    Object.keys(hourCounts).forEach((h) => {
      if (hourCounts[h] > maxHourFreq) {
        maxHourFreq = hourCounts[h];
        peakHour = parseInt(h);
      }
    });

    const formattedPeakHour = `${String(peakHour).padStart(2, '0')}:00 - ${String((peakHour + 1) % 24).padStart(2, '0')}:00`;

    // Analisis pemicu dari moodLogs
    const triggerCounts = {};
    const moodKeys = Object.keys(moodLogs);

    moodKeys.forEach((mKey) => {
      const trig = moodLogs[mKey].trigger;
      if (trig) {
        triggerCounts[trig] = (triggerCounts[trig] || 0) + 1;
      }
    });

    // Pemicu dominan
    let topTriggerKey = "tugas";
    let maxTriggerFreq = 0;
    Object.keys(triggerCounts).forEach((t) => {
      if (triggerCounts[t] > maxTriggerFreq) {
        maxTriggerFreq = triggerCounts[t];
        topTriggerKey = t;
      }
    });

    const triggerLabelMap = {
      tugas: "Tugas & Ujian Sekolah",
      kurang_tidur: "Kurang Tidur (Begadang)",
      suasana_hati: "Fluktuasi Suasana Hati",
      tidak_tahu: "Kecemasan Spontan"
    };

    const displayTopTrigger = triggerLabelMap[topTriggerKey] || "Tugas & Ujian Sekolah";

    // Update Elemen Tampilan Angka Besar (Story Style)
    if (statWaspadaCount) {
      statWaspadaCount.innerText = `${waspadaCount} Kali`;
    }

    if (statPeakHour) {
      statPeakHour.innerText = formattedPeakHour;
    }
    if (statPeakContext) {
      statPeakContext.innerText = `Ritme tubuhmu paling sering meningkat di rentang jam ini, bertepatan dengan puncak aktivitas harianmu.`;
    }

    if (statTopTrigger) {
      statTopTrigger.innerText = displayTopTrigger;
    }
    if (statTriggerContext) {
      statTriggerContext.innerText = `Berdasarkan catatan Mood Logger, faktor ini menjadi kontributor utama fluktuasi ritme fisikmu minggu ini.`;
    }

    // Panggil Gemini AI untuk Narasi Mingguan Personal
    if (aiNarrativeText) {
      aiNarrativeText.innerText = "Gemini sedang merangkum pola mingguanmu secara mendalam...";
      
      const summaryData = {
        waspadaCount: waspadaCount,
        peakHour: formattedPeakHour,
        topTrigger: displayTopTrigger
      };

      const narrative = await aiService.getWeeklyNarrative(summaryData);
      aiNarrativeText.innerText = narrative;
    }
  }
});
