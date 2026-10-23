/**
 * ==============================================================================
 * AuraSync - Curhat Singkat Chatbot Logic (chat.js)
 * ==============================================================================
 * Ruang dengar digital empatik sebelum mencari bantuan profesional.
 * - Membaca dan menyimpan riwayat chat ke node users/{userId}/chat_history
 * - Mengirim prompt dengan aturan keselamatan (safety guardrails) ke Gemini AI
 * - Menangani indikator pengetikan dan auto-scroll
 */

document.addEventListener("DOMContentLoaded", () => {
  const auth = window.AuraSyncAuth;
  const db = window.AuraSyncDB;
  const aiService = window.AuraSyncAI;

  const chatMessages = document.getElementById("chatMessages");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const btnSend = document.getElementById("btnSend");
  const btnLogout = document.getElementById("btnLogout");

  let localConversationHistory = [];
  let isAiResponding = false;

  // Auth Guard
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    loadChatHistory(user.uid);
  });

  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      await auth.signOut();
      window.location.href = "index.html";
    });
  }

  // 1. MEMUAT RIWAYAT CHAT DARI FIREBASE
  function loadChatHistory(userId) {
    if (!db) return;

    db.ref(`users/${userId}/chat_history`).on("value", (snapshot) => {
      chatMessages.innerHTML = "";
      localConversationHistory = [];

      const data = snapshot.val();
      if (!data) {
        // Pesan sambutan awal jika belum ada obrolan
        renderBubble("ai", "Halo! Aku AuraSync Companion. Kalau ada unek-unek, rasa cemas, atau beban hari ini yang ingin kamu ceritakan, silakan tulis di sini ya. Aku siap mendengarkan tanpa menghakimi. 😊");
        return;
      }

      const keys = Object.keys(data).sort();
      keys.forEach((k) => {
        const item = data[k];
        renderBubble(item.role, item.text);
        localConversationHistory.push({ role: item.role, text: item.text });
      });

      scrollToBottom();
    });
  }

  // 2. RENDER BUBBLE PERCAKAPAN
  function renderBubble(role, text, isTemporary = false) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role}`;
    bubble.innerText = text;
    if (isTemporary) bubble.id = "tempTypingBubble";

    chatMessages.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 3. MENGIRIM PESAN KE GEMINI AI
  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isAiResponding) return;

      const userText = chatInput.value.trim();
      if (!userText) return;

      const userId = window.getAuraSyncUserId();

      // Kosongkan input
      chatInput.value = "";
      btnSend.disabled = true;
      isAiResponding = true;

      // 1. Simpan pesan User ke Firebase
      const timestampUser = Date.now();
      if (db) {
        await db.ref(`users/${userId}/chat_history/${timestampUser}`).set({
          role: "user",
          text: userText
        });
      }

      // Tampilkan indikator mengetik
      const typingEl = renderBubble("ai", "AuraSync sedang merespon...", true);

      try {
        // Panggil Gemini AI dengan riwayat obrolan terkini
        const aiResponse = await aiService.chatReply(userText, localConversationHistory);

        // Hapus indikator mengetik
        if (typingEl && typingEl.parentNode) {
          typingEl.parentNode.removeChild(typingEl);
        }

        // Simpan respons AI ke Firebase
        const timestampAi = Date.now();
        if (db) {
          await db.ref(`users/${userId}/chat_history/${timestampAi}`).set({
            role: "ai",
            text: aiResponse
          });
        }
      } catch (err) {
        console.error("Gagal mengirim pesan chat:", err);
        if (typingEl) typingEl.innerText = "Maaf, aku sedang kesulitan terhubung. Tapi kamu tetap hebat hari ini!";
      } finally {
        isAiResponding = false;
        btnSend.disabled = false;
        chatInput.focus();
      }
    });
  }
});
