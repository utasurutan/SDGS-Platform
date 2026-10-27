import React, { useState, useRef, useEffect } from "react";
import "./settings.css";
import {
  LayoutGrid,
  BarChart2,
  Smile,
  Users,
  Link2,
  MessageSquare,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  User,
  Eye,
  EyeOff,
  ChevronDown,
  Check,
} from "lucide-react";

export default function SettingsPage({ onNavigate }) {
  // Ambil data user yang tersimpan di localStorage
  const [initialUser] = useState(() => {
    try {
      const saved = localStorage.getItem("aurasync_user");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Gagal parse aurasync_user:", e);
    }
    return {
      name: "Frenkie De",
      email: "frenkiede@gmail.com",
      picture: null,
    };
  });

  // Form profile states
  const [name, setName] = useState(initialUser.name || "Frenkie De");
  const [email, setEmail] = useState(initialUser.email || "frenkiede@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState("Bahasa Indonesia");
  const [avatar, setAvatar] = useState(initialUser.picture || null);

  // Preference states
  const [calmTarget, setCalmTarget] = useState(() => {
    return localStorage.getItem("aurasync_calm_target") || "20 mnt";
  });
  const [breathReminder, setBreathReminder] = useState(() => {
    const saved = localStorage.getItem("aurasync_breath_reminder");
    return saved !== null ? saved === "true" : true;
  });
  const [workFocusMode, setWorkFocusMode] = useState(() => {
    const saved = localStorage.getItem("aurasync_work_focus");
    return saved !== null ? saved === "true" : true;
  });

  // Privacy & Data states
  const [endToEndEncryption, setEndToEndEncryption] = useState(() => {
    const saved = localStorage.getItem("aurasync_encryption");
    return saved !== null ? saved === "true" : true;
  });
  const [weeklyReflectionEmail, setWeeklyReflectionEmail] = useState(() => {
    const saved = localStorage.getItem("aurasync_weekly_email");
    return saved !== null ? saved === "true" : true;
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef(null);

  // Sidebar active menu
  const [activeMenu, setActiveMenu] = useState("Pengaturan");

  // Handler Navigasi Sidebar
  const handleNavClick = (menuName, routePath) => {
    setActiveMenu(menuName);
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

  // Upload foto avatar baru
  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran foto melebihi batas 2 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Hapus foto avatar
  const handleDeletePhoto = () => {
    setAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Simpan perubahan form
  const handleSave = () => {
    const updatedUser = {
      ...initialUser,
      name,
      email,
      picture: avatar,
    };

    try {
      localStorage.setItem("aurasync_user", JSON.stringify(updatedUser));
      localStorage.setItem("aurasync_calm_target", calmTarget);
      localStorage.setItem("aurasync_breath_reminder", String(breathReminder));
      localStorage.setItem("aurasync_work_focus", String(workFocusMode));
      localStorage.setItem("aurasync_encryption", String(endToEndEncryption));
      localStorage.setItem("aurasync_weekly_email", String(weeklyReflectionEmail));
    } catch (e) {
      console.warn("Gagal menyimpan ke localStorage:", e);
    }

    setToastMessage("Pengaturan akun berhasil disimpan!");
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Batalkan perubahan form
  const handleCancel = () => {
    setName(initialUser.name || "Frenkie De");
    setEmail(initialUser.email || "frenkiede@gmail.com");
    setPassword("••••••••");
    setAvatar(initialUser.picture || null);
    setCalmTarget(localStorage.getItem("aurasync_calm_target") || "20 mnt");
  };

  return (
    <div className="settings-layout">
      {/* ============================================================
          1. SIDEBAR NAVIGATION
          ============================================================ */}
      <aside className="settings-sidebar" aria-label="Sidebar Navigasi">
        <div>
          {/* Brand Logo AuraSync */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate("/");
            }}
            className="sidebar-brand"
          >
            <span className="brand-text-aurasync">AuraSync</span>
          </a>

          <nav className="sidebar-nav">
            {/* Category: MENU */}
            <div className="sidebar-category">
              <span className="category-title">MENU</span>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Dashboard" ? "active" : ""}`}
                onClick={() => handleNavClick("Dashboard", "/dashboard")}
              >
                <LayoutGrid size={16} className="nav-icon" />
                <span>Dashboard</span>
              </button>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Analisis" ? "active" : ""}`}
                onClick={() => handleNavClick("Analisis")}
              >
                <BarChart2 size={16} className="nav-icon" />
                <span>Analisis</span>
              </button>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Tenang" ? "active" : ""}`}
                onClick={() => handleNavClick("Tenang")}
              >
                <Smile size={16} className="nav-icon" />
                <span>Tenang</span>
              </button>
            </div>

            {/* Category: FITUR */}
            <div className="sidebar-category">
              <span className="category-title">FITUR</span>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Komunitas" ? "active" : ""}`}
                onClick={() => handleNavClick("Komunitas")}
              >
                <Users size={16} className="nav-icon" />
                <span>Komunitas</span>
              </button>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Hubungkan" ? "active" : ""}`}
                onClick={() => handleNavClick("Hubungkan", "/connect-device")}
              >
                <Link2 size={16} className="nav-icon" />
                <span>Hubungkan</span>
              </button>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Chat AI" ? "active" : ""}`}
                onClick={() => handleNavClick("Chat AI")}
              >
                <MessageSquare size={16} className="nav-icon" />
                <span>Chat AI</span>
              </button>
            </div>

            {/* Category: UMUM */}
            <div className="sidebar-category">
              <span className="category-title">UMUM</span>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Pengaturan" ? "active" : ""}`}
                onClick={() => handleNavClick("Pengaturan", "/settings")}
              >
                <SettingsIcon size={16} className="nav-icon" />
                <span>Pengaturan</span>
              </button>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Faq" ? "active" : ""}`}
                onClick={() => handleNavClick("Faq")}
              >
                <HelpCircle size={16} className="nav-icon" />
                <span>Faq</span>
              </button>
              <button
                type="button"
                className="nav-item-btn"
                onClick={() => handleNavClick("Keluar")}
              >
                <LogOut size={16} className="nav-icon" />
                <span>Keluar</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Card in Sidebar: IoT Smart Band */}
        <div className="sidebar-device-card">
          <div className="device-card-header">
            <div className="device-badge-title">
              <span className="device-pulse-dot" />
              <span>IoT Smart Band</span>
            </div>
            <span className="device-battery-pct">97%</span>
          </div>
          <p className="device-card-subtitle">D18 Tersambung</p>
          <button
            type="button"
            className="device-card-btn"
            onClick={() => {
              if (onNavigate) onNavigate("/connect-device");
            }}
          >
            Sambung Sekarang
          </button>
        </div>
      </aside>

      {/* ============================================================
          2. MAIN CONTENT AREA
          ============================================================ */}
      <main className="settings-main">
        {/* Header: Pengaturan Akun */}
        <header className="settings-header">
          <h1 className="settings-title">Pengaturan Akun</h1>
          <p className="settings-subtitle">Kelola identitas profil dan data pribadi anda</p>
        </header>

        {/* ============================================================
            CARD 1: PROFIL & IDENTITAS DIRI
            ============================================================ */}
        <section className="settings-card" aria-labelledby="card-profile-title">
          <div className="card-top-bar">
            <div className="card-title-wrap">
              <h2 id="card-profile-title" className="card-main-title">
                Profil & Identitas Diri
              </h2>
              <p className="card-main-desc">
                Informasi dasar yang digunakan untuk merubah identitas mu
              </p>
            </div>
            <div className="card-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                Batalkan
              </button>
              <button
                type="button"
                className="btn-save"
                onClick={handleSave}
              >
                Simpan
              </button>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="avatar-section">
            <div className="avatar-circle-wrap">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Foto Profil"
                  className="avatar-img-preview"
                />
              ) : (
                <User size={30} className="avatar-user-icon" />
              )}
            </div>

            <div className="avatar-actions-wrap">
              <div className="avatar-btn-row">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/png, image/jpeg"
                  onChange={handlePhotoUpload}
                />
                <button
                  type="button"
                  className="btn-upload-photo"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  Unggah foto baru
                </button>
                <button
                  type="button"
                  className="btn-delete-photo"
                  onClick={handleDeletePhoto}
                >
                  Hapus
                </button>
              </div>
              <p className="avatar-format-hint">
                Format yang didukung JPG, PNG. Maksimum 2 MB
              </p>
            </div>
          </div>

          {/* Form Grid (Nama, Email, Kata Sandi, Bahasa) */}
          <div className="settings-form-grid">
            {/* Nama Lengkap */}
            <div className="form-group">
              <label htmlFor="fullname-input" className="form-label">
                Nama Lengkap<span className="form-label-required">*</span>
              </label>
              <div className="input-container">
                <input
                  id="fullname-input"
                  type="text"
                  className="settings-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            </div>

            {/* Alamat Email */}
            <div className="form-group">
              <label htmlFor="email-input" className="form-label">
                Alamat Email<span className="form-label-required">*</span>
              </label>
              <div className="input-container">
                <input
                  id="email-input"
                  type="email"
                  className="settings-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            {/* Kata Sandi */}
            <div className="form-group">
              <label htmlFor="password-input" className="form-label">
                Kata Sandi<span className="form-label-required">*</span>
              </label>
              <div className="input-container">
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  className="settings-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata sandi"
                />
                <button
                  type="button"
                  className="input-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Bahasa Antarmuka */}
            <div className="form-group">
              <label htmlFor="language-select" className="form-label">
                Bahasa Antarmuka<span className="form-label-required">*</span>
              </label>
              <div className="input-container">
                <select
                  id="language-select"
                  className="settings-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="English">English</option>
                </select>
                <ChevronDown size={16} className="select-chevron" />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CARD 2: PREFERENSI KESEJAHTERAAN & IDENTITAS
            ============================================================ */}
        <section className="settings-card" aria-labelledby="card-wellbeing-title">
          <div className="card-title-wrap">
            <h2 id="card-wellbeing-title" className="card-main-title">
              Preferensi Kesejahteraan & Identitas
            </h2>
            <p className="card-main-desc">
              Informasi dasar yang digunakan untuk merubah identitas mu
            </p>
          </div>

          <div className="card-divider" />

          {/* Row 1: Target Ketenangan Harian */}
          <div className="settings-row-item">
            <div className="row-item-info">
              <span className="row-item-title">Target Ketenangan Harian</span>
              <span className="row-item-desc">
                durasi kumulatif latihan relaksasi terpandu dengan gaya hidup anda
              </span>
            </div>
            <div className="segmented-pill-wrap" role="radiogroup" aria-label="Target Ketenangan Harian">
              {["10 mnt", "20 mnt", "30 mnt"].map((duration) => (
                <button
                  key={duration}
                  type="button"
                  className={`pill-option-btn ${calmTarget === duration ? "active" : ""}`}
                  onClick={() => setCalmTarget(duration)}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Pengingat Nafas Harian (4-7-8) */}
          <div className="settings-row-item">
            <div className="row-item-info">
              <span className="row-item-title">Pengingat Nafas Harian (4-7-8)</span>
              <span className="row-item-desc">
                Kirimkan notifikasi lembut untuk menstabilkan detak ritmis dua kali sehari (pagi-malam)
              </span>
            </div>
            <label className="toggle-switch-wrap">
              <input
                type="checkbox"
                checked={breathReminder}
                onChange={(e) => setBreathReminder(e.target.checked)}
                aria-label="Pengingat Nafas Harian"
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Row 3: Mode Fokus Selama Jam Kerja */}
          <div className="settings-row-item">
            <div className="row-item-info">
              <span className="row-item-title">Mode Fokus Selama Jam Kerja</span>
              <span className="row-item-desc">
                Menetapkan semua interupsi kritis secara otomatis dari pukul 09.00 hingga 17.00
              </span>
            </div>
            <label className="toggle-switch-wrap">
              <input
                type="checkbox"
                checked={workFocusMode}
                onChange={(e) => setWorkFocusMode(e.target.checked)}
                aria-label="Mode Fokus Selama Jam Kerja"
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </section>

        {/* ============================================================
            CARD 3: PRIVASI & RANGKUMAN DATA
            ============================================================ */}
        <section className="settings-card" aria-labelledby="card-privacy-title">
          <div className="card-title-wrap">
            <h2 id="card-privacy-title" className="card-main-title">
              Privasi & Rangkuman Data
            </h2>
            <p className="card-main-desc">
              Semua data privasi dan merespons beban pikiran anda
            </p>
          </div>

          <div className="card-divider" />

          {/* Row 1: Enkripsi Menyeluruh (End To End) */}
          <div className="settings-row-item">
            <div className="row-item-info">
              <span className="row-item-title">Enkripsi Menyeluruh (End To End)</span>
              <span className="row-item-desc">
                Catatan jurnal AI dan riwayat hening anda deskripsi sebelum disimpan di dalam server agar tidak ada pihak ketiga
              </span>
            </div>
            <label className="toggle-switch-wrap">
              <input
                type="checkbox"
                checked={endToEndEncryption}
                onChange={(e) => setEndToEndEncryption(e.target.checked)}
                aria-label="Enkripsi Menyeluruh"
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Row 2: Rangkuman Refleksi Mingguan (Email) */}
          <div className="settings-row-item">
            <div className="row-item-info">
              <span className="row-item-title">Rangkuman Refleksi Mingguan (Email)</span>
              <span className="row-item-desc">
                Dapatkan kemajuan relaksasi setiap hari minggu 06.00
              </span>
            </div>
            <label className="toggle-switch-wrap">
              <input
                type="checkbox"
                checked={weeklyReflectionEmail}
                onChange={(e) => setWeeklyReflectionEmail(e.target.checked)}
                aria-label="Rangkuman Refleksi Mingguan"
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </section>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="settings-toast" role="status">
          <Check size={18} className="toast-icon-check" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
