import React from "react";
import "./sidebar.css";
import brandLogo from "../Assets/Icon/brand-logo.png";
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
  Menu,
  X,
} from "lucide-react";

export default function Sidebar({
  activeMenu = "Dashboard",
  isMobileMenuOpen = false,
  onNavClick,
  onMobileClose,
  onNavigateToHome,
  onMobileOpen,
  sidebarClassName = "shared-sidebar",
  brandText = "",
  showLogoIcon = true,
  deviceBattery = 97,
  deviceSubtitle = "D18 Tersambung",
  deviceBtnText = "Terhubung",
  topBarActions = null,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${isMobileMenuOpen ? "active" : ""}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* Mobile Top Bar */}
      <header className="mobile-top-bar" aria-label="Mobile Navigation Bar">
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={onMobileOpen}
          aria-label="Buka Navigasi"
        >
          <Menu size={20} />
        </button>

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigateToHome) onNavigateToHome();
          }}
          className="mobile-brand-link"
        >
          {showLogoIcon && (
            <img
              src={brandLogo}
              alt="Logo"
              className="sidebar-brand-img"
            />
          )}
          {brandText ? <span className="brand-text-aurasync">{brandText}</span> : null}
        </a>

        {topBarActions ? (
          topBarActions
        ) : (
          <div className="mobile-top-spacer" aria-hidden="true" />
        )}
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`${sidebarClassName} ${isMobileMenuOpen ? "mobile-open" : ""}`}
        aria-label="Sidebar Navigasi"
      >
        <div>
          {/* Header Sidebar / Brand */}
          <div className="sidebar-brand-wrapper">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (onMobileClose) onMobileClose();
                if (onNavigateToHome) onNavigateToHome();
              }}
              className="sidebar-brand"
            >
              {showLogoIcon && (
                <img
                  src={brandLogo}
                  alt="Logo"
                  className="sidebar-brand-img"
                />
              )}
              {brandText ? <span className="brand-text-aurasync">{brandText}</span> : null}
            </a>

            <button
              type="button"
              className="sidebar-close-btn"
              onClick={onMobileClose}
              aria-label="Tutup Menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="sidebar-nav">
            {/* Category: MENU */}
            <div className="sidebar-category">
              <span className="category-title">MENU</span>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Dashboard" ? "active" : ""}`}
                onClick={() => onNavClick && onNavClick("Dashboard", "/dashboard")}
              >
                <LayoutGrid size={16} className="nav-icon" />
                <span>Dashboard</span>
              </button>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Analisis" ? "active" : ""}`}
                onClick={() => onNavClick && onNavClick("Analisis")}
              >
                <BarChart2 size={16} className="nav-icon" />
                <span>Analisis</span>
              </button>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Tenang" ? "active" : ""}`}
                onClick={() => onNavClick && onNavClick("Tenang")}
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
                onClick={() => onNavClick && onNavClick("Komunitas", "/komunitas")}
              >
                <Users size={16} className="nav-icon" />
                <span>Komunitas</span>
              </button>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Hubungkan" ? "active" : ""}`}
                onClick={() => onNavClick && onNavClick("Hubungkan", "/connect-device")}
              >
                <Link2 size={16} className="nav-icon" />
                <span>Hubungkan</span>
              </button>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Chat AI" ? "active" : ""}`}
                onClick={() => onNavClick && onNavClick("Chat AI", "/chat-ai")}
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
                onClick={() => onNavClick && onNavClick("Pengaturan", "/settings")}
              >
                <SettingsIcon size={16} className="nav-icon" />
                <span>Pengaturan</span>
              </button>
              <button
                type="button"
                className={`nav-item-btn ${activeMenu === "Faq" ? "active" : ""}`}
                onClick={() => onNavClick && onNavClick("Faq", "/faq")}
              >
                <HelpCircle size={16} className="nav-icon" />
                <span>Faq</span>
              </button>
              <button
                type="button"
                className="nav-item-btn"
                onClick={() => onNavClick && onNavClick("Keluar")}
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
            <span className="device-battery-pct">{deviceBattery}%</span>
          </div>
          <p className="device-card-subtitle">{deviceSubtitle}</p>
          <button
            type="button"
            className="device-card-btn"
            onClick={() => onNavClick && onNavClick("Hubungkan", "/connect-device")}
          >
            {deviceBtnText}
          </button>
        </div>
      </aside>
    </>
  );
}
