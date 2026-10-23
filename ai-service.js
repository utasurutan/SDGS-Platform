/**
 * ==============================================================================
 * AuraSync - Layanan AI Google Gemini (ai-service.js)
 * ==============================================================================
 * Mengirim permintaan langsung dari sisi client (browser) ke Google Gemini API
 * menggunakan fetch tanpa perlu server backend Node.js terpisah.
 * 
 * Dilengkapi fallback cerdas (rule-based empathy engine) jika API key belum diisi,
 * sehingga platform tetap dapat diperagakan dengan lancar di hadapan juri/guru.
 */

const AuraSyncAI = {
  // Panggil endpoint generatif Google Gemini
  async callGemini(promptText, systemInstruction = "") {
    const config = window.AURASYNC_CONFIG || {};
    const apiKey = config.gemini ? config.gemini.apiKey : "";
    const isKeyDefault = !apiKey || apiKey === "GANTI_DENGAN_GEMINI_API_KEY";

    // Jika belum mengisi API Key asli, gunakan respons cerdas fallback
    if (isKeyDefault) {
      console.info("ℹ️ [Gemini AI] Menggunakan respon fallback cerdas (kunci API belum diisi di config.js).");
      return null; // Meminta pemanggil menggunakan fallback lokal
    }

    const modelName = config.gemini.model || "gemini-1.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 350
      }
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn("⚠️ [Gemini AI] HTTP Error:", response.status, errorData);
        return null;
      }

      const data = await response.json();
      const candidate = data.candidates && data.candidates[0];
      if (candidate && candidate.content && candidate.content.parts) {
        return candidate.content.parts.map(p => p.text).join(" ").trim();
      }
      return null;
    } catch (err) {
      console.error("❌ [Gemini AI] Fetch Exception:", err);
      return null;
    }
  },

  // ----------------------------------------------------------------------------
  // 1. DASHBOARD INSIGHT
  // ----------------------------------------------------------------------------
  async getDashboardInsight(bpm, gsr, status) {
    const prompt = `User sedang menggunakan gelang pintar Biomark-Stress Tracker.
Data saat ini: BPM = ${bpm} bpm, GSR = ${gsr} uS (konduktansi kulit), Status = ${status}.
Berikan 1 sampai 2 kalimat analisis singkat dalam bahasa Indonesia yang ramah, menenangkan, dan mudah dipahami remaja/siswa. Jangan mendiagnosis medis. Beri dorongan positif singkat.`;

    const aiResponse = await this.callGemini(prompt);
    if (aiResponse) return aiResponse;

    // Fallback cerdas jika API key belum aktif
    if (status === "waspada" || bpm >= 95) {
      return `Detak jantungmu terdeteksi sedikit meningkat (${bpm} bpm). Nafaslah perlahan selama 2 menit untuk menenangkan kembali ritme tubuhmu.`;
    } else {
      return `Kondisi fisikmu terpantau tenang dan seimbang (${bpm} bpm). Pertahankan ritme kerja yang santai dan jangan lupa cukupi hidrasi air minum.`;
    }
  },

  // ----------------------------------------------------------------------------
  // 2. REKOMENDASI DECOMPRESSION ROOM
  // ----------------------------------------------------------------------------
  async getDecompressionSuggestion(status, recentTrigger) {
    const triggerLabelMap = {
      tugas: "beban tugas sekolah/pekerjaan",
      kurang_tidur: "kurang tidur / kelelahan",
      suasana_hati: "suasana hati yang sedang turun",
      tidak_tahu: "kegelisahan tanpa sebab pasti"
    };
    const triggerDesc = triggerLabelMap[recentTrigger] || "rutinitas harian";

    const prompt = `Status fisik saat ini: ${status}. Pemicu terakhir: ${triggerDesc}.
Tersedia 3 opsi terapi: 'Binaural Beats' (gelombang fokus relaks), 'White Noise' (peredam kebisingan pikiran), dan 'Grounding Visual' (latihan napas visual).
Pilihkan 1 opsi yang paling pas dan jelaskan alasannya dalam 1 baris kalimat singkat (maksimal 20 kata).`;

    const aiResponse = await this.callGemini(prompt);
    if (aiResponse) return aiResponse;

    // Fallback cerdas
    if (recentTrigger === "kurang_tidur") {
      return "Tubuhmu lelah; coba dengarkan White Noise lembut untuk membantu rileks sejenak.";
    } else if (recentTrigger === "tugas" || status === "waspada") {
      return "Pikiranmu padat; coba Grounding Visual untuk menstabilkan kembali detak napasmu.";
    } else {
      return "Coba dengarkan Binaural Beats frekuensi Alfa untuk merilekskan pikiranmu.";
    }
  },

  // ----------------------------------------------------------------------------
  // 3. WEEKLY BIO-INSIGHT NARRATIVE
  // ----------------------------------------------------------------------------
  async getWeeklyNarrative(summaryData) {
    const { waspadaCount, peakHour, topTrigger } = summaryData;
    const prompt = `Berikut ringkasan data stres 7 hari pengguna gelang Biomark:
- Frekuensi status 'Waspada': ${waspadaCount} kali
- Jam paling rawan lonjakan stres: sekitar pukul ${peakHour}
- Pemicu yang paling sering dicatat: ${topTrigger}

Tulis rangkuman naratif 2-3 kalimat bersahabat yang merangkum pola ini, diikuti 1 saran praktis hidup sehat yang mudah diterapkan remaja. Gunakan bahasa Indonesia santai namun empatik.`;

    const aiResponse = await this.callGemini(prompt);
    if (aiResponse) return aiResponse;

    // Fallback naratif
    return `Minggu ini kamu mengalami sekitar ${waspadaCount} kali lonjakan ritme tubuh, paling sering terjadi di sekitar pukul ${peakHour} yang dipicu oleh ${topTrigger}. Ingat, istirahat sejenak 5 menit di sela aktivitas berat bukanlah tanda kemunduran, melainkan cara tubuh mengisi kembali energi terbaikmu.`;
  },

  // ----------------------------------------------------------------------------
  // 4. CHATBOT CURHAT SINGKAT (DENGAN SAFETY GUARDRAILS)
  // ----------------------------------------------------------------------------
  async chatReply(userMessage, conversationHistory = []) {
    const systemPrompt = `Kamu adalah "AuraSync Companion", asisten pendengar digital untuk penderita high-functioning anxiety di kalangan pelajar/remaja.
PEDOMAN UTAMA:
1. Selalu berbicara dengan nada hangat, penuh empati, suportif, santai, dan TIDAK MENGHAKIMI.
2. JANGAN PERNAH mendiagnosis penyakit medis/kejiwaan, dan tegaskan bahwa kamu adalah teman dengar, bukan psikolog/terapis profesional.
3. Berikan ruang bagi pengguna untuk meluapkan unek-uneknya ("Curhat").
4. ATURAN KRITIS KESELAMATAN: Jika pesan pengguna mengandung tanda-tanda krisis, melukai diri, putus asa ekstrem, atau bahaya, segera respons dengan penuh kasih sayang dan arahkan dengan lembut untuk segera menghubungi orang terdekat (orang tua, guru BK, sahabat) atau nomor bantuan darurat. JANGAN berusaha menangani bahaya sendirian.
5. Jawab dalam 2 sampai 4 kalimat yang menenangkan, ringkas, dan membesarkan hati.`;

    let formattedContext = "";
    if (conversationHistory.length > 0) {
      const recent = conversationHistory.slice(-4);
      formattedContext = recent.map(c => `${c.role === "user" ? "User" : "AI"}: ${c.text}`).join("\n") + "\n";
    }

    const fullPrompt = `${formattedContext}User: ${userMessage}\nAI:`;

    const aiResponse = await this.callGemini(fullPrompt, systemPrompt);
    if (aiResponse) return aiResponse;

    // Fallback jika API key belum dimasukkan
    const lower = userMessage.toLowerCase();
    if (lower.includes("mati") || lower.includes("menyerah") || lower.includes("putus asa") || lower.includes("bunuh")) {
      return "Aku di sini mendengarkanmu, tapi keselamatan dan hidupmu sangat berharga. Tolong segera bicara langsung dengan orang tua, sahabat terpercaya, atau hubungi orang terdekatmu sekarang juga ya. Kamu tidak harus memikul semuanya sendirian.";
    }
    if (lower.includes("lelah") || lower.includes("capek") || lower.includes("tugas")) {
      return "Tarik napas panjang dulu ya. Wajar sekali merasa lelah dengan semua tuntutan yang sedang kamu hadapi. Luangkan 10 menit untuk melepaskan beban dan beristirahat tanpa rasa bersalah.";
    }
    if (lower.includes("takut") || lower.includes("cemas") || lower.includes("khawatir")) {
      return "Kecemasan itu nyata, tapi kamu lebih kuat dari rasa takutmu saat ini. Kamu sudah berusaha sebaik mungkin sampai hari ini, dan itu patut diapresiasi. Ada yang mau kamu ceritakan lagi?";
    }
    return "Terima kasih sudah berbagi cerita denganku. Terkadang mengeluarkan apa yang ada di kepala adalah langkah pertama agar dada terasa lebih lega. Aku selalu ada di sini untuk mendengarkan.";
  }
};

window.AuraSyncAI = AuraSyncAI;
