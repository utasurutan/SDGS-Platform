import { useState } from "react";
import "./landing-page.css";
import { Bell, Watch, BedDouble, FaceGrinning, Menu, X } from "lucide-react";
import reviewImg from "../Assets/Picture/Group 21.png";
import heroVisualImg from "../Assets/Picture/Group 26 (1).svg";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="header-container">
        {/* Sisi Kiri: Logo */}
        <a className="aura-sync-logo" href="#">AuraSync</a>

        {/* Tengah: 4 Menu Link (Desktop) */}
        <nav className="navbar-container">
          <ul className="navbar-links">
            <li><a href="#fitur">Fitur & Teknologi</a></li>
            <li><a href="#cara-kerja">Cara Kerja</a></li>
            <li><a href="#ruang-tenang">Ruang Tenang</a></li>
            <li><a href="#tentang">Tentang Kami</a></li>
          </ul>
        </nav>

        {/* Sisi Kanan: Tombol, Notifikasi, & Hamburger Menu */}
        <div className="btn-group">
          <a href="#kontak" className="btn-contact">Hubungi Kami</a>
          <a href="#notifikasi" className="btn-bell" aria-label="Notifikasi">
            <Bell size={20} />
          </a>
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
            type="button"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Navigasi Mobile (Dropdown) */}
        {isMobileMenuOpen && (
          <nav className="mobile-nav-menu">
            <ul>
              <li><a href="#fitur" onClick={() => setIsMobileMenuOpen(false)}>Fitur & Teknologi</a></li>
              <li><a href="#cara-kerja" onClick={() => setIsMobileMenuOpen(false)}>Cara Kerja</a></li>
              <li><a href="#ruang-tenang" onClick={() => setIsMobileMenuOpen(false)}>Ruang Tenang</a></li>
              <li><a href="#tentang" onClick={() => setIsMobileMenuOpen(false)}>Tentang Kami</a></li>
            </ul>
          </nav>
        )}
      </header>

      <main className="main-wrapper">
        <section className="hero-page" id="beranda">
          {/* Kolom Kiri: Teks, Tombol, Stat, & Review */}
          <div className="hero-left">
            <div className="hero-text">
              <h1 className="hero-top-txt">
                Mari Mulai Perjalanan <br />
                Menuju Pikiran yang Lebih <br />
                Tenang
              </h1>
              <p className="hero-desc-text">
                Pantau kondisi stres dan detak jantungmu secara real-time lewat <br />
                gelang pintar. Kami ada untuk menuntunmu kembali rileks
              </p>
              <a href="#fitur" className="mulai-pj-btn">Mulai Perjalananmu</a>
            </div>

            <div className="stat-container">
              <div className="stat-items">
                <div className="stat-top">
                  <FaceGrinning size={32} strokeWidth={2.2} color="#706EE7" />
                  <span className="stat-number">94%</span>
                </div>
                <div className="stat-bottom">
                  <p>Merasa Lebih Tenang</p>
                </div>
              </div>

              <div className="stat-items">
                <div className="stat-top">
                  <Watch size={32} strokeWidth={2.2} color="#706EE7" />
                  <span className="stat-number">100%</span>
                </div>
                <div className="stat-bottom">
                  <p>Kompatibel Dan Akurat</p>
                </div>
              </div>

              <div className="stat-items">
                <div className="stat-top">
                  <BedDouble size={32} strokeWidth={2.2} color="#706EE7" />
                  <span className="stat-number">88%</span>
                </div>
                <div className="stat-bottom">
                  <p>Kualitas Istirahat Meningkat</p>
                </div>
              </div>
            </div>

            <div className="review-wrapper">
              <img className="review-image" src={reviewImg} alt="Review Pengguna" />
            </div>
          </div>

          {/* Kolom Kanan: Visual Ilustrasi */}
          <div className="hero-visual">
            <img src={heroVisualImg} alt="AuraSync Platform Preview" />
          </div>
        </section>
      </main>
    </>
  );
}