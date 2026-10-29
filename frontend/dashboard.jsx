import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Sidebar from "./Sidebar.jsx";
import {
  LayoutGrid,
  BarChart2,
  Smile,
  Users,
  Link2,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Calendar,
  Bell,
  Activity,
  Watch,
  Bluetooth,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ShieldAlert,
  Moon,
  Sparkles,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { subscribeToDashboardData, DEFAULT_DASHBOARD_DATA } from "./dashboardService.js";
import avatar1 from "../Assets/Picture/Ellipse 31.png";
import avatar2 from "../Assets/Picture/Ellipse 32.png";
import avatar3 from "../Assets/Picture/Ellipse 33.png";
import avatar4 from "../Assets/Picture/Ellipse 34.png";
import avatar5 from "../Assets/Picture/Ellipse 35.png";
import stethoscopeIcon from "../Assets/Icon/solar_stethoscope-bold (1).png";
import pulseIcon from "../Assets/Icon/solar_pulse-linear (1).png";

export default function Dashboard({ onNavigate }) {
  // Ambil data akun yang login (Google atau Form)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("aurasync_user");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Gagal parse aurasync_user:", e);
    }
    return {
      name: "Kawan",
      email: "siswa@aurasync.id",
      picture: null,
    };
  });

  // State menu navigasi sidebar yang sedang aktif
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // State drawer navigasi versi mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State mode smartband (fokus | relaksasi | tidur)
  const [activeMode, setActiveMode] = useState("fokus");

  // State rentang waktu chart (hari-ini | 7-hari | 30-hari)
  const [timeFilter, setTimeFilter] = useState("hari-ini");

  // Data metriks real-time dari dashboardService (siap dihubungkan ke Firebase)
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Berlangganan data real-time (mock / Firebase ready)
    const unsubscribe = subscribeToDashboardData(user.email, (updatedData) => {
      setMetrics(updatedData);
    });
    return () => unsubscribe();
  }, [user.email]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah kamu yakin ingin keluar?");
    if (confirmLogout) {
      localStorage.removeItem("aurasync_user");
      if (onNavigate) onNavigate("/");
    }
  };

  // Navigasi handler
  const handleNavClick = (menuName, routePath) => {
    setActiveMenu(menuName);
    setIsMobileMenuOpen(false);
    if (menuName === "Keluar") {
      handleLogout();
    } else if (routePath && onNavigate) {
      onNavigate(routePath);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* ============================================================
          SIDEBAR NAVIGATION (SHARED COMPONENT)
          ============================================================ */}
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
        deviceBattery={metrics?.device?.battery || 97}
        deviceSubtitle={metrics?.device?.status ? "D18 Tersambung" : "D18 Belum Terhubung"}
        deviceBtnText="Sambung Sekarang"
        topBarActions={
          <div className="mobile-top-actions">
            <button
              type="button"
              className="mobile-icon-btn"
              title="Notifikasi"
              aria-label="Notifikasi"
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </button>

            <button
              type="button"
              className="mobile-user-avatar-btn"
              title="Pengaturan Profil"
              onClick={() => {
                if (onNavigate) onNavigate("/settings");
              }}
              aria-label="Profil Pengguna"
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || "Foto Profil"}
                  className="user-avatar-img"
                />
              ) : (
                <div className="user-avatar-fallback">
                  {(user.name || "K").charAt(0).toUpperCase()}
                </div>
              )}
            </button>
          </div>
        }
      />

      {/* ============================================================
          2. MAIN CONTENT AREA
          ============================================================ */}
      <main className="dashboard-main">
        {/* Header Row: Selamat Datang [Nama user] + Actions */}
        <header className="dashboard-header">
          <div>
            <h1 className="welcome-title">
              Selamat Datang {user.name || "Kawan"}
            </h1>
            <p className="welcome-subtitle">Pantau Kondisi Kamu!</p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="header-icon-btn"
              title="Kalender Harian"
              aria-label="Kalender Harian"
            >
              <Calendar size={18} />
            </button>
            <button
              type="button"
              className="header-icon-btn"
              title="Notifikasi"
              aria-label="Notifikasi"
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </button>

            {/* User Profile Capsule */}
            <div className="user-profile-capsule" title="Profil Akun">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || "Foto Profil"}
                  className="user-avatar-img"
                />
              ) : (
                <div className="user-avatar-fallback">
                  {(user.name || "K").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="user-info-text">
                <span className="user-display-name">
                  {user.name ? user.name.split(" ")[0] : "Frenkie"}
                </span>
                <span className="user-display-meta">
                  18 Tahun , Bekasi
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ============================================================
            3. TIGA BOX ATAS (TOP METRIC CARDS)
            ============================================================ */}
        <section className="top-metric-grid" aria-label="Metrik Utama Tubuh">
          {/* Card 1: Rata-rata BPM Harian */}
          <div className="metric-card">
            <div className="metric-card-header">
              <div className="metric-card-icon-wrap">
                <img
                  src={stethoscopeIcon}
                  alt="Ikon Rata-rata BPM"
                  className="metric-card-icon-img"
                />
              </div>
              <span className="metric-top-text">Rata-rata BPM Harian</span>
            </div>
            <div className="metric-number-row">
              <span className="metric-main-number">
                {metrics?.bpm || 72}
              </span>
              <span className="metric-unit-badge">BPM</span>
            </div>
            <p className="metric-left-bottom-text">
              {metrics?.bpmChange || "-2.1% mulai rendah"}
            </p>
          </div>

          {/* Card 2: Variabilitas Detak Jantung */}
          <div className="metric-card">
            <div className="metric-card-header">
              <div className="metric-card-icon-wrap">
                <img
                  src={pulseIcon}
                  alt="Ikon Variabilitas Detak Jantung"
                  className="metric-card-icon-img"
                />
              </div>
              <span className="metric-top-text">Variabilitas Detak Jantung</span>
            </div>
            <div className="metric-number-row">
              <span className="metric-main-number">
                {metrics?.hrv || 68}
              </span>
              <span className="metric-unit-badge">ms</span>
            </div>
            <p className="metric-secondary-bottom-text">
              {metrics?.hrvStatus || "Aktivitas saraf parasimpatis dominan"}
            </p>
          </div>

          {/* Card 3: Skor Strees */}
          <div className="metric-card">
            <div className="metric-card-header">
              <div className="metric-card-icon-wrap">
                <img
                  src={pulseIcon}
                  alt="Ikon Skor Strees"
                  className="metric-card-icon-img"
                />
              </div>
              <span className="metric-top-text">Skor Strees</span>
            </div>
            <div className="metric-number-row">
              <span className="metric-main-number">
                {metrics?.stressScore || 32}
              </span>
              <span className="metric-sub-number">/100</span>
            </div>
            <p className="metric-secondary-bottom-text">
              <TrendingUp size={13} style={{ color: "#10B981" }} />
              {metrics?.stressChange || "+3.2% Pemulihan"}
            </p>
          </div>
        </section>

        {/* ============================================================
            4. SMART WATCH BAND ACTIVE STRIP BANNER
            ============================================================ */}
        <section className="device-status-banner" aria-label="Status Smart Watch Band">
          <div className="banner-left-info">
            <div className="banner-watch-icon">
              <Watch size={20} />
            </div>
            <div className="banner-device-names">
              <span className="banner-device-title">
                {metrics?.device?.name || "D18 Smart Watch Band Active"}
              </span>
              <span className="banner-device-signal">
                Sinyal {metrics?.device?.signal || "-42 dBm (Sangat Baik)"}
              </span>
            </div>
          </div>

          <div className="banner-divider" />

          <div className="banner-mid-info">
            <div className="banner-status-tag">
              <Bluetooth size={16} style={{ color: "#1E6AFF" }} />
              <span>{metrics?.device?.status || "Terhubung Stabil"}</span>
            </div>
            <span className="banner-battery-tag">
              Baterai {metrics?.device?.battery || 97}%
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="banner-mode-switcher" role="tablist">
            <button
              type="button"
              className={`mode-tab-btn ${activeMode === "fokus" ? "active" : ""}`}
              onClick={() => setActiveMode("fokus")}
            >
              <Zap size={13} />
              <span>Mode Fokus</span>
            </button>
            <button
              type="button"
              className={`mode-tab-btn ${activeMode === "relaksasi" ? "active" : ""}`}
              onClick={() => setActiveMode("relaksasi")}
            >
              <Sparkles size={13} />
              <span>Mode Relaksasi</span>
            </button>
            <button
              type="button"
              className={`mode-tab-btn ${activeMode === "tidur" ? "active" : ""}`}
              onClick={() => setActiveMode("tidur")}
            >
              <Moon size={13} />
              <span>Mode Tidur</span>
            </button>
          </div>
        </section>

        {/* ============================================================
            5. CHART: KORELASI INDEKS STRES & DETAK NADI
            ============================================================ */}
        <section className="chart-card-container" aria-label="Grafik Analisis Respon Saraf">
          <div className="chart-header-row">
            <div className="chart-title-wrap">
              <h2>Korelasi Indeks Stres & Detak Nadi</h2>
              <p>
                Data analisis harian berdasarkan
                <br />
                respon saraf
              </p>
            </div>

            <div className="chart-controls-wrap">
              {/* Legend: Indeks Strees 1-100 & Detak Nadi */}
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-pill-stress" />
                  <span>Indeks Strees 1–100</span>
                </div>
                <div className="legend-item">
                  <span className="legend-pill-pulse" />
                  <span>Detak Nadi</span>
                </div>
              </div>

              {/* Timefilter */}
              <div className="chart-time-tabs">
                <button
                  type="button"
                  className={`time-tab-link ${timeFilter === "hari-ini" ? "active" : ""}`}
                  onClick={() => setTimeFilter("hari-ini")}
                >
                  Hari Ini
                </button>
                <button
                  type="button"
                  className={`time-tab-link ${timeFilter === "7-hari" ? "active" : ""}`}
                  onClick={() => setTimeFilter("7-hari")}
                >
                  7 Hari
                </button>
                <button
                  type="button"
                  className={`time-tab-link ${timeFilter === "30-hari" ? "active" : ""}`}
                  onClick={() => setTimeFilter("30-hari")}
                >
                  30 Hari
                </button>
              </div>
            </div>
          </div>

          {/* Decoupled Non-Stretched Line Chart Canvas */}
          <div className="chart-body-wrapper">
            <div className="chart-main-row">
              {/* Y Axis: Native HTML text, ZERO distortion, perfectly centered on grid lines */}
              <div className="chart-y-axis">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              {/* Plot Area */}
              <div className="chart-plot-container">
                {/* 5 HTML Grid Lines */}
                <div className="chart-html-grid">
                  <div className="chart-html-grid-line" />
                  <div className="chart-html-grid-line" />
                  <div className="chart-html-grid-line" />
                  <div className="chart-html-grid-line" />
                  <div className="chart-html-grid-line" />
                </div>

                {/* SVG Curves & Area (Vector only, no text) */}
                <svg
                  className="chart-svg-layer"
                  viewBox="0 0 1000 200"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="stressAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E6AFF" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="#1E6AFF" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="pulseAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#706EE7" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#706EE7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Stress Area Gradient */}
                  <path
                    d="M 0,126 L 55,104 L 100,104 L 111.1,120 L 135,90 L 160,100 L 190,64 L 222.2,94 L 255,56 L 280,110 L 333.3,84 L 388,24 L 444.4,60 L 490,40 L 555.6,40 L 610,40 L 666.7,84 L 720,68 L 777.8,94 L 830,116 L 888.9,60 L 944,92 L 1000,64 L 1000,200 L 0,200 Z"
                    fill="url(#stressAreaGradient)"
                  />

                  {/* Pulse Area Gradient */}
                  <path
                    d="M 0,176 L 55,144 L 111.1,170 L 166,140 L 195,176 L 222.2,160 L 250,168 L 280,136 L 333.3,152 L 388,120 L 444.4,116 L 490,136 L 555.6,96 L 666.7,30 L 720,72 L 777.8,30 L 830,116 L 888.9,36 L 944,50 L 1000,16 L 1000,200 L 0,200 Z"
                    fill="url(#pulseAreaGradient)"
                  />

                  {/* Pulse Line (#706EE7) */}
                  <path
                    d="M 0,176 L 55,144 L 111.1,170 L 166,140 L 195,176 L 222.2,160 L 250,168 L 280,136 L 333.3,152 L 388,120 L 444.4,116 L 490,136 L 555.6,96 L 666.7,30 L 720,72 L 777.8,30 L 830,116 L 888.9,36 L 944,50 L 1000,16"
                    fill="none"
                    stroke="#706EE7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Stress Line (#1E6AFF) */}
                  <path
                    d="M 0,126 L 55,104 L 100,104 L 111.1,120 L 135,90 L 160,100 L 190,64 L 222.2,94 L 255,56 L 280,110 L 333.3,84 L 388,24 L 444.4,60 L 490,40 L 555.6,40 L 610,40 L 666.7,84 L 720,68 L 777.8,94 L 830,116 L 888.9,60 L 944,92 L 1000,64"
                    fill="none"
                    stroke="#1E6AFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Vertical Dotted Line at 13:00 */}
                  <line
                    x1="444.4"
                    y1="60"
                    x2="444.4"
                    y2="200"
                    stroke="#1E6AFF"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.65"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Vertical Dotted Line at 18:00 */}
                  <line
                    x1="777.8"
                    y1="30"
                    x2="777.8"
                    y2="200"
                    stroke="#706EE7"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.65"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Markers: Native HTML Circles (Never Ovals!) */}
                <div
                  className="chart-point-marker marker-blue-ring"
                  style={{ left: "44.44%", top: "30%" }}
                />
                <div
                  className="chart-point-marker marker-purple-ring"
                  style={{ left: "77.78%", top: "15%" }}
                />

                {/* Tooltip Float: Native HTML card (Never Stretched!) */}
                <div
                  className="chart-html-tooltip"
                  style={{ left: "44.44%", top: "18px" }}
                >
                  <span className="tooltip-red-circle" />
                  <div className="tooltip-text-col">
                    <span className="tooltip-title-text">Puncak Strees : 77 BPM</span>
                    <span className="tooltip-sub-text">Hari ini : 22 Oktober</span>
                  </div>
                </div>
              </div>
            </div>

            {/* X Axis Row: Native HTML text, ZERO distortion */}
            <div className="chart-x-axis-row">
              <div className="chart-y-spacer" />
              <div className="chart-x-axis">
                <span>06:00</span>
                <span>08:00</span>
                <span>10:00</span>
                <span>12:00</span>
                <span>13:00</span>
                <span>14:00</span>
                <span>16:00</span>
                <span>18:00</span>
                <span>20:00</span>
                <span>22:00</span>
              </div>
            </div>
          </div>

          {/* Footer Chart */}
          <div className="chart-bottom-row">
            <p className="chart-bottom-note">
              Stress turun drastis -42% setelah latihan pernafasan
            </p>
            <a
              href="#analisis"
              onClick={(e) => {
                e.preventDefault();
                setActiveMenu("Analisis");
              }}
              className="chart-more-link"
            >
              Analisis lebih lengkap
            </a>
          </div>
        </section>

        {/* ============================================================
            6. BOTTOM SECTION: 2 COLUMNS
            ============================================================ */}
        <section className="bottom-dashboard-grid">
          {/* Kolom Kiri: Komunitas & Dukungan */}
          <div className="bottom-card">
            <div className="bottom-card-header">
              <h3>Komunitas & Dukungan</h3>
              <p>Lihat inspirasi dan saling dukung sesama</p>
            </div>

            {/* Overlapping Avatars */}
            <div className="community-avatars-row">
              <div className="community-avatar-item" title="Siswa 1">
                <img src={avatar1} alt="Anggota Komunitas 1" />
              </div>
              <div className="community-avatar-item" title="Siswa 2">
                <img src={avatar2} alt="Anggota Komunitas 2" />
              </div>
              <div className="community-avatar-item" title="Siswa 3">
                <img src={avatar3} alt="Anggota Komunitas 3" />
              </div>
              <div className="community-avatar-item" title="Siswa 4">
                <img src={avatar4} alt="Anggota Komunitas 4" />
              </div>
              <div className="community-avatar-item" title="Siswa 5">
                <img src={avatar5} alt="Anggota Komunitas 5" />
              </div>
            </div>

            <a
              href="#komunitas"
              onClick={(e) => {
                e.preventDefault();
                setActiveMenu("Komunitas");
              }}
              className="community-footer-link"
            >
              <span>Lihat secara lengkap</span>
              <ChevronRight size={16} />
            </a>
          </div>

          {/* Kolom Kanan: Penyebab Stres */}
          <div className="bottom-card">
            <div className="bottom-card-header">
              <h3>Penyebab Stres</h3>
              <p>Analisis apa yang membuat kamu stres</p>
            </div>

            <div className="stress-causes-content">
              {/* Graphic Bubbles Matching Mockup */}
              <div className="bubbles-graphic-wrap" aria-hidden="true">
                <div className="bubble-circle bubble-53">53%</div>
                <div className="bubble-circle bubble-41">41%</div>
                <div className="bubble-circle bubble-26">26%</div>
                <div className="bubble-circle bubble-12">12%</div>
              </div>

              {/* Breakdown List */}
              <div className="causes-list">
                {(metrics?.causes || DEFAULT_DASHBOARD_DATA.causes).map((item, idx) => (
                  <div key={idx} className="cause-item-row">
                    <span
                      className="cause-color-dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="cause-pct-tag">{item.percentage}%</span>
                    <span className="cause-label-text">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
