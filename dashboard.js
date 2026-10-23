/**
 * ==============================================================================
 * AuraSync - Dashboard "Vibe & Pulse" (dashboard.js)
 * ==============================================================================
 * Menampilkan:
 * 1. Kartu Status Real-time ("Tenang" / "Waspada") dengan animasi denyut
 * 2. AI Insight (1-2 kalimat analisis ramah dari Google Gemini API)
 * 3. Grafik Garis Dinamis BPM sepanjang hari menggunakan Chart.js
 * 4. Navigasi jalan pintas ke Decompression Room & Weekly Insight
 */

document.addEventListener("DOMContentLoaded", () => {
  const auth = window.AuraSyncAuth;
  const db = window.AuraSyncDB;
  const aiService = window.AuraSyncAI;

  // Elemen DOM
  const statusCard = document.getElementById("statusCard");
  const statusText = document.getElementById("statusText");
  const liveBpmVal = document.getElementById("liveBpmVal");
  const liveGsrVal = document.getElementById("liveGsrVal");
  const aiInsightText = document.getElementById("aiInsightText");
  const aiInsightStatusIndicator = document.getElementById("aiInsightStatusIndicator");
  const userGreeting = document.getElementById("userGreeting");
  const btnLogout = document.getElementById("btnLogout");

  let bpmChart = null;
  let lastEvaluatedBpm = 0;
  let lastEvaluatedGsr = 0;
  let lastInsightUpdateTime = 0;

  // Cek apakah user sedang login
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    const displayName = user.displayName || (user.email ? user.email.split("@")[0] : "Teman");
    if (userGreeting) userGreeting.innerText = `Halo, ${displayName} 👋`;
    
    initChart();
    listenToRealtimeReadings(user.uid);
  });

  // Tombol Logout
  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      await auth.signOut();
      window.location.href = "index.html";
    });
  }

  // Inisialisasi Chart.js Line Chart
  function initChart() {
    const ctx = document.getElementById("bpmChartCanvas");
    if (!ctx) return;

    // Buat efek gradasi warna di bawah garis grafik
    const gradient = ctx.getContext("2d").createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, "rgba(20, 184, 166, 0.35)");
    gradient.addColorStop(1, "rgba(20, 184, 166, 0.0)");

    bpmChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: "BPM (Detak Jantung)",
          data: [],
          borderColor: "#14b8a6",
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: "#2dd4bf",
          pointBorderColor: "#0f172a",
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#94a3b8",
            bodyColor: "#f8fafc",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (context) => `${context.parsed.y} BPM`
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.04)" },
            ticks: { color: "#64748b", font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } }
          },
          y: {
            min: 50,
            max: 140,
            grid: { color: "rgba(255, 255, 255, 0.04)" },
            ticks: { color: "#64748b", font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } }
          }
        }
      }
    });
  }

  // Mendengarkan data pembacaan real-time dari Firebase
  function listenToRealtimeReadings(userId) {
    if (!db) return;

    // Ambil 15 data pembacaan terakhir
    db.ref(`users/${userId}/readings`).limitToLast(15).on("value", (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.val();
      const timestamps = Object.keys(data).sort();
      if (timestamps.length === 0) return;

      const chartLabels = [];
      const chartValues = [];

      let latestReading = null;

      timestamps.forEach((ts) => {
        const item = data[ts];
        const dateObj = new Date(parseInt(ts));
        const timeLabel = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        chartLabels.push(timeLabel);
        chartValues.push(item.bpm);
        latestReading = item;
      });

      // Perbarui Grafik Chart.js
      if (bpmChart) {
        bpmChart.data.labels = chartLabels;
        bpmChart.data.datasets[0].data = chartValues;
        bpmChart.update("none"); // Update halus tanpa kedip
      }

      // Perbarui Status Card
      if (latestReading) {
        updateStatusCard(latestReading.bpm, latestReading.gsr, latestReading.status);
      }
    });
  }

  // Perbarui UI Kartu Status
  function updateStatusCard(bpm, gsr, status) {
    if (liveBpmVal) liveBpmVal.innerText = bpm;
    if (liveGsrVal) liveGsrVal.innerText = gsr;

    if (status === "waspada") {
      statusCard.classList.add("waspada");
      statusText.innerText = "Waspada";
      statusText.style.color = "#fbbf24";
    } else {
      statusCard.classList.remove("waspada");
      statusText.innerText = "Tenang";
      statusText.style.color = "#34d399";
    }

    // Perbarui AI Insight jika data berubah signifikan atau sudah lewat 20 detik
    const now = Date.now();
    const bpmChangedSignificantly = Math.abs(bpm - lastEvaluatedBpm) >= 6;
    const isTimeToRefresh = (now - lastInsightUpdateTime) > 20000;

    if (bpmChangedSignificantly || isTimeToRefresh) {
      lastEvaluatedBpm = bpm;
      lastEvaluatedGsr = gsr;
      lastInsightUpdateTime = now;
      fetchAIInsight(bpm, gsr, status);
    }
  }

  // Mengambil 1-2 kalimat wawasan dari Google Gemini AI
  async function fetchAIInsight(bpm, gsr, status) {
    if (aiInsightStatusIndicator) {
      aiInsightStatusIndicator.innerText = "Menganalisis pola...";
    }

    try {
      const insight = await aiService.getDashboardInsight(bpm, gsr, status);
      if (aiInsightText) {
        aiInsightText.innerText = insight;
      }
      if (aiInsightStatusIndicator) {
        aiInsightStatusIndicator.innerText = "Terbarui via Gemini AI";
      }

      // Simpan riwayat insight ke Firebase
      const userId = window.getAuraSyncUserId();
      if (db && userId) {
        db.ref(`users/${userId}/ai_insight/${Date.now()}`).set({ text: insight });
      }
    } catch (e) {
      console.error("Gagal mendapatkan AI Insight:", e);
      if (aiInsightStatusIndicator) {
        aiInsightStatusIndicator.innerText = "Mode offline";
      }
    }
  }
});
