import React, { useState, useRef, useEffect } from "react";
import "./chat-ai.css";
import Sidebar from "./Sidebar.jsx";
import lotusIcon from "../Assets/Icon/material-symbols-light_menstrual-health-outline.png";
import {
  Calendar,
  Bell,
  Sparkles,
  Plus,
  ArrowUp,
  Mic,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCw,
  Check,
  MessageSquare,
  User as UserIcon,
} from "lucide-react";

// Initial conversations mapped by history item ID
const CONVERSATION_DATABASE = {
  "hist-1": [
    {
      id: "msg-1",
      sender: "user",
      text: "lagi capek banget rasanya malam ini. Tugas-tugas sekolah numpuk, belum lagi mikirin persiapan PKL dan harus bagi waktu buat desain portofolio, takut ga keburu semuanya.",
    },
    {
      id: "msg-2",
      sender: "ai",
      text: "Halo, Frenkie. Tarik napas pelan-pelan dulu, ya. Dari data smart band kamu juga keliatan HRV-nya lagi agak turun malam ini. Wajar banget kalau kamu ngerasa kewalahan. Menggabungkan deadline tugas sekolah, persiapan magang, dan ambisi bikin portofolio keren secara bersamaan itu beban mental yang nggak kecil. Valid banget kalau kamu capek. Kamu udah hebat lho bisa bertahan sejauh ini",
    },
    {
      id: "msg-3",
      sender: "user",
      text: "Iya, rasanya sesak aja kalau dipendem sendiri, takut kelihatan lemah kalau ngeluh ke orang lain",
    },
    {
      id: "msg-4",
      sender: "ai",
      text: "Hei, merasa lelah dan butuh jeda itu bukan tanda kelemahan, kok. Itu tanda kalau kamu manusia biasa yang butuh istirahat. Di ruang ini, kamu nggak perlu jaim atau pura-pura kuat di depan siapa pun. Silakan luapin aja semua yang ada di kepalamu ke aku. Mau cerita apa lagi? Aku dengerin kok, Anagatha.",
    },
    {
      id: "msg-5",
      sender: "user",
      text: "Makasih ya, Frenkie... Jujur sedikit lega setelah ngetik ini. Kayaknya kepala udah agak enakan",
    },
    {
      id: "msg-6",
      sender: "ai",
      text: "ama-sama, Anagatha. Senang bisa nemenin kamu malam ini. Obrolan kita tadi udah otomatis tersimpan rapi di Private kamu dengan tag #KelelahanAkademik dan #KecemasanMasaDepan",
    },
  ],
};

const DEFAULT_HISTORY_ITEMS = [
  { id: "hist-1", title: "Beban PKL & Portofolio yang Bikin Overthinking" },
  { id: "hist-2", title: "Evaluasi Detak Jantung Pasca Presentasi" },
  { id: "hist-3", title: "Cemas Menghadapi Deadline Tugas Jaringan" },
  { id: "hist-4", title: "Sesi Breathing & Menenangkan Pikiran" },
  { id: "hist-5", title: "Bingung Membagi Waktu Antara Sekolah & Desain" },
  { id: "hist-6", title: "Konsultasi Biometrik & Laporan Tidur" },
  { id: "hist-7", title: "Meluapkan Emosi karena Salah Paham Grup" },
  { id: "hist-8", title: "Ngerasa Insecure Bandingin Diri Sama Temen Seangkatan" },
  { id: "hist-9", title: "Panik, Project Website Kena Deadline Besok Pagi" },
  { id: "hist-10", title: "Diskusi Soal Pola Tidur Kurang Nyenyak" },
  { id: "hist-11", title: "Badan Capek Tapi Pikiran Malah Makin Rame" },
];

export default function ChatAIPage({ onNavigate }) {
  // Current user info
  const [user] = useState(() => {
    try {
      const saved = localStorage.getItem("aurasync_user");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Gagal parse aurasync_user:", e);
    }
    return {
      name: "Frenkie",
      ageCity: "18 Tahun , Bekasi",
      picture: null,
    };
  });

  // Sidebar navigation state
  const [activeMenu, setActiveMenu] = useState("Chat AI");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active conversation state (default to hist-1 from Image 2)
  const [activeHistoryId, setActiveHistoryId] = useState("hist-1");
  const [historyList, setHistoryList] = useState(DEFAULT_HISTORY_ITEMS);
  const [messages, setMessages] = useState(() => CONVERSATION_DATABASE["hist-1"]);

  // Input states
  const [inputText, setInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Feedback states (msgId -> "up" | "down")
  const [messageReactions, setMessageReactions] = useState({});
  const [regeneratingId, setRegeneratingId] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll when messages update
  useEffect(() => {
    if (messages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAiTyping]);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  };

  // Nav click handler
  const handleNavClick = (menuName, routePath) => {
    setActiveMenu(menuName);
    setIsMobileMenuOpen(false);
    if (menuName === "Keluar") {
      const confirmLogout = window.confirm("Apakah kamu yakin ingin keluar?");
      if (confirmLogout) {
        localStorage.removeItem("aurasync_user");
        if (onNavigate) onNavigate("/");
      }
    } else if (routePath && onNavigate) {
      onNavigate(routePath);
    }
  };

  // Switch conversation from history list
  const handleSelectHistory = (item) => {
    setActiveHistoryId(item.id);
    if (CONVERSATION_DATABASE[item.id]) {
      setMessages(CONVERSATION_DATABASE[item.id]);
    } else {
      // Generate a mock conversation for demo items
      setMessages([
        {
          id: `msg-${Date.now()}-1`,
          sender: "user",
          text: `Halo, aku mau bahas tentang "${item.title}".`,
        },
        {
          id: `msg-${Date.now()}-2`,
          sender: "ai",
          text: `Halo ${user.name || "Frenkie"}. Aku siap mendengarkan dan membahas tentang ${item.title}. Luapkan apa yang sedang kamu rasakan saat ini, tarik napas dalam-dalam, dan ceritakan pelan-pelan ya.`,
        },
      ]);
    }
  };

  // Start a new chat (switches to Empty Greeting state from Image 1)
  const handleStartNewChat = () => {
    setActiveHistoryId(null);
    setMessages([]);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Send user message
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isAiTyping) return;

    const newUserMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
    };

    const updatedMessages = [...(messages || []), newUserMsg];
    setMessages(updatedMessages);
    setInputText("");

    // If we were in empty greeting state, create a new history item
    if (!activeHistoryId) {
      const newHistId = `hist-${Date.now()}`;
      const titleSummary = trimmed.length > 40 ? trimmed.substring(0, 38) + "..." : trimmed;
      const newHistItem = { id: newHistId, title: titleSummary };
      setHistoryList([newHistItem, ...historyList]);
      setActiveHistoryId(newHistId);
    }

    // Simulate empathetic AI response
    setIsAiTyping(true);
    setTimeout(() => {
      let aiResponseText = `Terima kasih sudah mau berbagi cerita, ${user.name || "Frenkie"}. Aku mengerti betul perasaan kamu saat ini. Ingatlah bahwa kamu tidak harus memikul semua beban sekaligus. Luangkan waktu sejenak untuk minum air dan ambil 3 kali tarikan napas dalam-dalam. Ada hal lain yang ingin kamu luapkan?`;

      if (trimmed.toLowerCase().includes("stres") || trimmed.toLowerCase().includes("capek") || trimmed.toLowerCase().includes("lelah")) {
        aiResponseText = `Aku bisa merasakan betapa melelahkannya fase ini untuk kamu, ${user.name || "Frenkie"}. Dari indikator denyut tubuhmu, memang terlihat ada sedikit lonjakan beban stres. Tolong jangan terlalu keras pada dirimu sendiri ya. Istirahat sejenak bukanlah kegagalan, melainkan persiapan agar kamu bisa kembali berenergi. Aku selalu di sini mendengarkanmu.`;
      } else if (trimmed.toLowerCase().includes("tugas") || trimmed.toLowerCase().includes("sekolah") || trimmed.toLowerCase().includes("deadline")) {
        aiResponseText = `Deadline dan tuntutan tugas sekolah memang sering kali memicu kecemasan mendadak. Coba kita urai satu per satu dari yang paling ringan. Kamu sudah melangkah sejauh ini dan sudah membuktikan kemampuanmu. Tarik napas pelan-pelan, ya.`;
      }

      const newAiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiResponseText,
      };

      setMessages((prev) => [...prev, newAiMsg]);
      setIsAiTyping(false);
    }, 1100);
  };

  // Copy AI response to clipboard
  const handleCopyText = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast("Teks respons disalin ke clipboard!");
    }
  };

  // Thumbs up / down feedback
  const handleReaction = (msgId, type) => {
    setMessageReactions((prev) => ({
      ...prev,
      [msgId]: prev[msgId] === type ? null : type,
    }));
  };

  // Regenerate AI response
  const handleRegenerate = (msgId) => {
    setRegeneratingId(msgId);
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? {
                ...m,
                text: `${m.text}\n\n(Catatan: Kamu hebat sudah bertahan dan melangkah sampai hari ini. Jangan ragu mengambil jeda sejenak.)`,
              }
            : m
        )
      );
      setRegeneratingId(null);
      showToast("Respons AI telah diperbarui!");
    }, 900);
  };

  // Toggle voice recording simulation
  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      showToast("Mendengarkan suara kamu... Silakan bicara.");
      setTimeout(() => {
        setIsRecording(false);
        setInputText("Kepalaku rasanya agak berat setelah seharian belajar di sekolah.");
        showToast("Suara berhasil diubah menjadi teks!");
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const isGreetingState = !messages || messages.length === 0;

  return (
    <div className="chat-ai-layout">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="chat-toast" role="status" aria-live="polite">
          <Check size={16} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Shared Sidebar Component (Matches Dashboard, Komunitas, Berita) */}
      <Sidebar
        activeMenu={activeMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        onNavClick={handleNavClick}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        onNavigateToHome={() => {
          if (onNavigate) onNavigate("/");
        }}
        onMobileOpen={() => setIsMobileMenuOpen(true)}
        sidebarClassName="shared-sidebar"
        showLogoIcon={true}
        deviceBattery={97}
        deviceSubtitle="D18 Tersambung"
        deviceBtnText="Terhubung"
      />

      {/* Main Chat AI Workspace */}
      <main className="chat-ai-main">
        {/* Top Header Bar */}
        <header className="chat-ai-header">
          <div className="chat-header-greeting">
            <h1 className="chat-page-title">Asisten Cepat Mental Kamu</h1>
            <p className="chat-page-subtitle">Bertanya dengan cepat dengan asisten ini</p>
          </div>

          <div className="chat-header-actions">
            <button
              type="button"
              className="chat-header-btn"
              title="Kalender"
              aria-label="Kalender"
            >
              <Calendar size={18} />
            </button>
            <button
              type="button"
              className="chat-header-btn"
              title="Notifikasi"
              aria-label="Notifikasi"
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </button>

            {/* User Profile Pill */}
            <div className="chat-header-profile-card">
              <div className="chat-header-avatar">
                {user.picture ? (
                  <img src={user.picture} alt="Profil" />
                ) : (
                  <UserIcon size={18} color="#1E6AFF" />
                )}
              </div>
              <div className="chat-header-profile-text">
                <span className="chat-profile-name">{user.name || "Frenkie"}</span>
                <span className="chat-profile-meta">{user.ageCity || "18 Tahun , Bekasi"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* ============================================================
            CONTENT AREA: EMPTY STATE (Image 1) OR ACTIVE CHAT (Image 2)
            ============================================================ */}
        {isGreetingState ? (
          /* STATE 1: Empty Greeting View (Image 1) */
          <div className="chat-empty-container">
            {/* Calming Lotus / Flower Emblem */}
            <div className="lotus-icon-wrapper" aria-hidden="true">
              <img
                src={lotusIcon}
                alt="Logo Tenang"
                className="lotus-icon-img"
              />
            </div>

            <h2 className="empty-greeting-heading">
              Selamat Pagi, {user.name || "Frenkie"} apa
              <br />
              Yang <span className="highlight-blue">ingin ditanyakan?</span>
            </h2>

            {/* Input card placed below greeting */}
            <div className="empty-input-wrapper">
              <form onSubmit={handleSendMessage} className="chat-input-card">
                <div className="chat-input-top-row">
                  <Sparkles size={18} className="input-sparkle-icon" />
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    className="chat-textarea"
                    placeholder="Bertanya kepada AI atau edukasi"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="chat-plus-btn"
                    title="Buat Percakapan Baru"
                    onClick={handleStartNewChat}
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="chat-input-bottom-row">
                  <div className="chat-input-tools-left">
                    <button
                      type="button"
                      className={`tool-audio-waves-btn ${isRecording ? "recording" : ""}`}
                      title="Rekam Suara"
                      onClick={handleToggleVoice}
                    >
                      <div className="audio-bars-anim">
                        <span className="audio-bar" />
                        <span className="audio-bar" />
                        <span className="audio-bar" />
                        <span className="audio-bar" />
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`tool-mic-btn ${isRecording ? "recording" : ""}`}
                      title="Mikrofon Input"
                      onClick={handleToggleVoice}
                    >
                      <Mic size={18} />
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="chat-send-btn"
                    disabled={!inputText.trim()}
                    title="Kirim Pesan"
                  >
                    <ArrowUp size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* STATE 2: Active Chat Feed + Right History Column (Image 2) */
          <div className="chat-active-layout">
            {/* Left Column: Messages Feed + Input */}
            <div className="chat-conversation-column">
              <div className="chat-messages-scroll">
                {messages.map((item) =>
                  item.sender === "user" ? (
                    /* User Message */
                    <div key={item.id} className="chat-message-user-wrap">
                      <div className="chat-user-avatar">
                        {user.picture ? (
                          <img
                            src={user.picture}
                            alt="User"
                            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                          />
                        ) : (
                          <UserIcon size={20} />
                        )}
                      </div>
                      <p className="chat-user-text">{item.text}</p>
                    </div>
                  ) : (
                    /* AI Response Bubble */
                    <div key={item.id} className="chat-message-ai-bubble">
                      <div className="chat-ai-text">{item.text}</div>
                      <div className="chat-ai-actions-row">
                        <div className="ai-action-left">
                          <button
                            type="button"
                            className={`ai-action-icon-btn ${
                              messageReactions[item.id] === "up" ? "active" : ""
                            }`}
                            title="Suka jawaban ini"
                            onClick={() => handleReaction(item.id, "up")}
                          >
                            <ThumbsUp size={15} />
                          </button>
                          <button
                            type="button"
                            className={`ai-action-icon-btn ${
                              messageReactions[item.id] === "down" ? "active" : ""
                            }`}
                            title="Kurang membantu"
                            onClick={() => handleReaction(item.id, "down")}
                          >
                            <ThumbsDown size={15} />
                          </button>
                        </div>

                        <div className="ai-action-right">
                          <button
                            type="button"
                            className="ai-action-icon-btn"
                            title="Salin respons"
                            onClick={() => handleCopyText(item.text)}
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            type="button"
                            className={`ai-action-icon-btn ${
                              regeneratingId === item.id ? "spinning" : ""
                            }`}
                            title="Buat ulang respons"
                            onClick={() => handleRegenerate(item.id)}
                          >
                            <RotateCw size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {/* AI Typing Indicator */}
                {isAiTyping && (
                  <div className="typing-indicator-wrap">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span style={{ marginLeft: "4px" }}>Aura AI sedang merespons...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Pinned Input Card */}
              <form onSubmit={handleSendMessage} className="chat-input-card">
                <div className="chat-input-top-row">
                  <Sparkles size={18} className="input-sparkle-icon" />
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    className="chat-textarea"
                    placeholder="Bertanya kepada AI atau edukasi"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="chat-plus-btn"
                    title="Percakapan Baru"
                    onClick={handleStartNewChat}
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="chat-input-bottom-row">
                  <div className="chat-input-tools-left">
                    <button
                      type="button"
                      className={`tool-audio-waves-btn ${isRecording ? "recording" : ""}`}
                      title="Rekam Suara"
                      onClick={handleToggleVoice}
                    >
                      <div className="audio-bars-anim">
                        <span className="audio-bar" />
                        <span className="audio-bar" />
                        <span className="audio-bar" />
                        <span className="audio-bar" />
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`tool-mic-btn ${isRecording ? "recording" : ""}`}
                      title="Mikrofon Input"
                      onClick={handleToggleVoice}
                    >
                      <Mic size={18} />
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="chat-send-btn"
                    disabled={!inputText.trim()}
                    title="Kirim Pesan"
                  >
                    <ArrowUp size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Riwayat Percakapan + IoT Smart Band (Image 2) */}
            <aside className="chat-sidebar-column">
              {/* Card 1: Riwayat Percakapan */}
              <div className="chat-history-card">
                <div className="history-card-header">
                  <h2 className="history-card-title">Riwayat Percakapan</h2>
                  <button
                    type="button"
                    className="btn-new-chat-pill"
                    onClick={handleStartNewChat}
                    title="Mulai percakapan baru"
                  >
                    + Baru
                  </button>
                </div>

                <div className="history-items-list">
                  {historyList.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`history-item-row ${
                        activeHistoryId === item.id ? "active" : ""
                      }`}
                      onClick={() => handleSelectHistory(item)}
                      title={item.title}
                    >
                      <MessageSquare size={15} className="history-item-icon" />
                      <span className="history-item-text">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
