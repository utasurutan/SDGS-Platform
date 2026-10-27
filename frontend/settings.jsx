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
  ZoomIn,
  ZoomOut,
  RotateCw,
  X,
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

  // Crop modal states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);

  // Upload foto avatar baru - buka cropper modal
  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran foto melebihi batas 5 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCropImageSrc(event.target.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  // Callback saat crop berhasil diterapkan
  const handleCropApply = (croppedDataUrl) => {
    setAvatar(croppedDataUrl);
    setCropModalOpen(false);
    setCropImageSrc(null);
  };

  // Batalkan crop
  const handleCropCancel = () => {
    setCropModalOpen(false);
    setCropImageSrc(null);
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

      {/* Image Cropper Modal */}
      {cropModalOpen && cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onApply={handleCropApply}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}

/**
 * ImageCropperModal – Komponen modal interaktif pemotong foto profil lingkaran
 * Mendukung drag/pan, zoom slider + wheel, rotasi 90°, dan export canvas resolusi tinggi.
 */
function ImageCropperModal({ imageSrc, onApply, onCancel }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialOffsetX: 0, initialOffsetY: 0 });
  const [imgNatural, setImgNatural] = useState({ width: 1, height: 1 });
  const boxRef = useRef(null);

  const VIEWPORT_DIAMETER = 240;

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImgNatural({ width: img.naturalWidth, height: img.naturalHeight });
    };
  }, [imageSrc]);

  // Skala dasar agar gambar menutupi area lingkaran 240px
  const baseScale = Math.max(
    VIEWPORT_DIAMETER / (imgNatural.width || 1),
    VIEWPORT_DIAMETER / (imgNatural.height || 1)
  );
  const renderW = imgNatural.width * baseScale;
  const renderH = imgNatural.height * baseScale;

  // Mouse handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialOffsetX: offset.x,
      initialOffsetY: offset.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setOffset({
      x: dragStartRef.current.initialOffsetX + dx,
      y: dragStartRef.current.initialOffsetY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        initialOffsetX: offset.x,
        initialOffsetY: offset.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    setOffset({
      x: dragStartRef.current.initialOffsetX + dx,
      y: dragStartRef.current.initialOffsetY + dy,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse scroll wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(3, Math.max(1, +(prev + delta).toFixed(2))));
  };

  // Reset posisi & zoom
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  // Putar foto 90 derajat searah jarum jam
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Ekspor gambar hasil crop resolusi tinggi (400x400 px)
  const handleConfirmCrop = () => {
    const OUTPUT_SIZE = 400;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const M = OUTPUT_SIZE / VIEWPORT_DIAMETER;
    const canvasW = renderW * zoom * M;
    const canvasH = renderH * zoom * M;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      ctx.save();
      ctx.translate(OUTPUT_SIZE / 2 + offset.x * M, OUTPUT_SIZE / 2 + offset.y * M);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -canvasW / 2, -canvasH / 2, canvasW, canvasH);
      ctx.restore();

      const croppedUrl = canvas.toDataURL("image/jpeg", 0.92);
      onApply(croppedUrl);
    };
  };

  return (
    <div className="cropper-modal-backdrop" role="dialog" aria-modal="true">
      <div className="cropper-modal-card">
        {/* Header */}
        <div className="cropper-header">
          <div className="cropper-title-wrap">
            <h3 className="cropper-title">Potong Foto Profil</h3>
            <p className="cropper-desc">
              Geser dan sesuaikan foto agar pas di dalam lingkaran profil
            </p>
          </div>
          <button
            type="button"
            className="cropper-close-btn"
            onClick={onCancel}
            title="Tutup"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewport Box */}
        <div className="cropper-body">
          <div
            ref={boxRef}
            className="crop-preview-box"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            title="Klik dan geser untuk memposisikan foto"
          >
            <div
              className="crop-image-wrapper"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`,
                width: `${renderW * zoom}px`,
                height: `${renderH * zoom}px`,
                transition: isDragging ? "none" : "transform 0.08s ease-out",
              }}
            >
              <img
                src={imageSrc}
                alt="Pratinjau potong"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Circular Mask Overlay */}
            <svg
              viewBox="0 0 320 320"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <defs>
                <mask id="cropCircleMask">
                  <rect x="0" y="0" width="320" height="320" fill="white" />
                  <circle cx="160" cy="160" r="120" fill="black" />
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="320"
                height="320"
                fill="rgba(15, 23, 42, 0.65)"
                mask="url(#cropCircleMask)"
              />
              <circle
                cx="160"
                cy="160"
                r="120"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          {/* Controls */}
          <div className="cropper-controls">
            {/* Zoom Slider */}
            <div className="cropper-slider-row">
              <button
                type="button"
                className="cropper-icon-btn"
                onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.1).toFixed(2)))}
                title="Perkecil"
                aria-label="Perkecil"
              >
                <ZoomOut size={16} />
              </button>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="cropper-zoom-slider"
                aria-label="Tingkat Zoom Foto"
              />
              <button
                type="button"
                className="cropper-icon-btn"
                onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.1).toFixed(2)))}
                title="Perbesar"
                aria-label="Perbesar"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Aux Buttons */}
            <div className="cropper-aux-row">
              <button
                type="button"
                className="btn-rotate-photo"
                onClick={handleRotate}
              >
                <RotateCw size={14} />
                <span>Putar 90°</span>
              </button>
              <button
                type="button"
                className="btn-reset-crop"
                onClick={handleReset}
              >
                Reset Posisi
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="cropper-footer">
          <button
            type="button"
            className="btn-crop-cancel"
            onClick={onCancel}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn-crop-apply"
            onClick={handleConfirmCrop}
          >
            <Check size={16} />
            <span>Terapkan Foto</span>
          </button>
        </div>
      </div>
    </div>
  );
}
