import { useState, useEffect } from "react";
import "./connect-device.css";
import deviceImg from "../Assets/Picture/download__36_-removebg-preview 1.png";

/**
 * Bluetooth Icon SVG (inline, matches reference design)
 */
function BluetoothIcon({ size = 16, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6.5 6.5L17.5 17.5L12 23V1L17.5 6.5L6.5 17.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Smartwatch Icon for device card
 */
function SmartwatchIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="5" y="6" width="14" height="13" rx="3" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M8 19v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1" />
      <path d="M12 10v2.5l1.5 1.5" />
    </svg>
  );
}

/**
 * Check Icon for device selected state
 */
function CheckIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * Rotate Icon for connect button spinner
 */
function RotateCwIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

/**
 * HRV Wave badge – floating animated element showing bio data
 */
function HrvBadge({ position, label }) {
  return (
    <div className={`cd-hrv-badge ${position}`} aria-hidden="true">
      {position === "left" ? (
        <>
          <span className="cd-hrv-dot" />
          <span>{label}</span>
        </>
      ) : (
        <>
          <div className="cd-hrv-wave">
            <span />
            <span />
            <span />
            <span />
          </div>
          <span>{label}</span>
        </>
      )}
    </div>
  );
}

/**
 * ConnectDevice – halaman perantara setelah sign-up / login
 *
 * Dua state utama:
 *   1. searching  → menampilkan skeleton + loading dots, tombol disabled
 *   2. found      → menampilkan kartu perangkat + tombol aktif
 *
 * Karena belum ada IoT sungguhan, aplikasi selamanya ada di state "searching"
 * (deviceFound tetap false) sehingga pengguna hanya bisa menekan "Lewati".
 */
export default function ConnectDevice({ onNavigate }) {
  // Simulasi: perangkat tidak pernah ditemukan (no real IoT)
  const [deviceFound] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Dots counter for "Mencari SmartWrist Band.." text animation
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleConnect = () => {
    if (!deviceFound) return;
    setConnecting(true);
    // Simulasi koneksi – navigate ke dashboard setelah 1.5 detik
    setTimeout(() => {
      setConnecting(false);
      if (onNavigate) onNavigate("/dashboard");
    }, 1500);
  };

  const handleSkip = () => {
    if (onNavigate) onNavigate("/dashboard");
  };

  const dots = ".".repeat(dotCount);

  return (
    <div className="cd-wrapper">
      <main className="cd-card" role="main" aria-label="Menghubungkan Perangkat">
        {/* ── Header ── */}
        <header className="cd-header">
          <h1 className="cd-title">Menghubungkan Perangkat</h1>
          <p className="cd-subtitle">
            Pastikan blueetooth ponselmu aktif dan gelang Smart Brand berada di dekatmu
          </p>
        </header>

        {/* ── Device Visual ── */}
        <div className="cd-visual" aria-hidden="true">
          {/* Glow background */}
          <div className="cd-glow-bg" />

          {/* Pulse scanning rings */}
          <div className="cd-pulse-ring" />
          <div className="cd-pulse-ring" />
          <div className="cd-pulse-ring" />

          {/* Floating HRV Badges */}
          <HrvBadge position="left" label="HRV 84ms" />
          <HrvBadge position="right" label="HRV 84ms" />

          {/* Device image */}
          <img
            src={deviceImg}
            alt="SmartWrist Band"
            className="cd-device-img"
          />
        </div>

        {/* ── Search Status ── */}
        <div className="cd-search-status" aria-live="polite">
          <span className="cd-search-dot" aria-hidden="true" />
          <span className="cd-search-label">
            {deviceFound ? (
              "SmartWrist Band D18/116 ditemukan"
            ) : (
              <>
                Mencari SmartWrist Band
                <span className="cd-loading-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="cd-bluetooth-icon">
                  <BluetoothIcon size={15} />
                </span>
              </>
            )}
          </span>
        </div>

        {/* ── Device Card / Skeleton ── */}
        {deviceFound ? (
          <div className="cd-device-found">
            <div className="cd-device-icon-wrap">
              <SmartwatchIcon size={22} />
            </div>
            <div className="cd-device-info">
              <p className="cd-device-name">D18 Smart Watch</p>
              <p className="cd-device-meta">ID :88–9A4F &nbsp; Sinyal -42 dBm</p>
            </div>
            <div className="cd-device-check">
              <CheckIcon size={14} />
            </div>
          </div>
        ) : (
          /* Skeleton shimmer while searching */
          <div className="cd-device-skeleton" aria-hidden="true">
            <div className="cd-skel-icon" />
            <div className="cd-skel-lines">
              <div className="cd-skel-line" />
              <div className="cd-skel-line short" />
            </div>
          </div>
        )}

        {/* ── Connect Button ── */}
        <button
          type="button"
          id="cd-connect-btn"
          className="cd-connect-btn"
          onClick={handleConnect}
          disabled={!deviceFound || connecting}
          aria-label="Hubungkan perangkat sekarang"
        >
          {connecting ? (
            <>
              <span className="cd-btn-spin">
                <RotateCwIcon size={18} />
              </span>
              Menghubungkan…
            </>
          ) : (
            <>
              <span className="cd-btn-spin" aria-hidden="true">
                <RotateCwIcon size={18} />
              </span>
              Hubungkan Sekarang
            </>
          )}
        </button>

        {/* ── Skip Link ── */}
        <button
          type="button"
          id="cd-skip-btn"
          className="cd-skip-link"
          onClick={handleSkip}
          aria-label="Lewati dan masuk ke aplikasi"
        >
          Lewati
        </button>
      </main>
    </div>
  );
}
