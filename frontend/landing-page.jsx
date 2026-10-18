import { useState, useRef, useEffect } from "react";
import "./landing-page.css";
import {
  Bell,
  Watch,
  BedDouble,
  FaceGrinning,
  Menu,
  X,
  CloudMoon,
  Frown,
  HeartPlus,
  Dumbbell,
  ShieldPlus,
  Brain,
  ArrowRight,
  HeartPulse,
  Target,
  Clock,
  Users,
} from "lucide-react";
import reviewImg from "../Assets/Picture/Group 21.png";
import heroVisualImg from "../Assets/Picture/Group 26 (1).svg";
import smartBandImg from "../Assets/Picture/download__36_-removebg-preview 2.png";
import commitmentImg from "../Assets/Picture/Frame 39.png";

const impactCards = [
  {
    id: 1,
    icon: CloudMoon,
    title: "Pola Istirahat",
    description: "Dampak kelelahan ini sering kali datang diam-diam dan merusak fokusmu",
    link: "#pola-istirahat",
  },
  {
    id: 2,
    icon: Frown,
    title: "Kesehatan Mental",
    description: "Mengabaikan stres berkepanjangan dapat menguras stamina emosional",
    link: "#kesehatan-mental",
  },
  {
    id: 3,
    icon: HeartPlus,
    title: "Detak Jantung",
    description: "Kecemasan yang menumpuk memicu lonjakan detak jantung (BPM) berlebih",
    link: "#detak-jantung",
  },
  {
    id: 4,
    icon: Dumbbell,
    title: "Ketegangan Otot",
    description: "menahan tegak otot leher yang sering kali berujung pada sakit kepala",
    link: "#ketegangan-otot",
  },
  {
    id: 5,
    icon: ShieldPlus,
    title: "Imun Menurun",
    description: "sistem kekebalan tubuh, membuatmu jadi lebih rentan terserang penyakit",
    link: "#imun-menurun",
  },
  {
    id: 6,
    icon: Brain,
    title: "Penurunan Fokus",
    description: "Pikiran yang terlalu penuh (brain fog) membuat konsentrasi buyar",
    link: "#penurunan-fokus",
  },
];

const guideSteps = [
  {
    step: "01",
    title: "Pakai Perangkat",
    description: "Pasang Smart Band di pergelangan tangan hingga sensor menempel pas pada kulit.",
  },
  {
    step: "02",
    title: "Sambung Bluetooth",
    description: 'Nyalakan Bluetooth dan tekan tombol "Hubungkan" di platform web.',
  },
  {
    step: "03",
    title: "Pantau Biometrik",
    description: "Sensor merekam detak jantung (BPM) dan indikator stres secara real-time.",
  },
  {
    step: "04",
    title: "Mulai Relaksasi",
    description: "Ikuti panduan pernapasan terpandu atau musik saat indikator stres naik.",
  },
];


function HrvWaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="badge-svg-icon">
      <line x1="2.5" y1="6.5" x2="2.5" y2="11.5" stroke="#1E6AFF" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="5.75" y1="4" x2="5.75" y2="14" stroke="#1E6AFF" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="9" y1="1.8" x2="9" y2="16.2" stroke="#1E6AFF" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="12.25" y1="4" x2="12.25" y2="14" stroke="#1E6AFF" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="15.5" y1="6.5" x2="15.5" y2="11.5" stroke="#1E6AFF" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function DataBarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="badge-svg-icon">
      <rect x="2" y="9.5" width="3.2" height="6.5" rx="1.2" stroke="#A78BFA" strokeWidth="1.8" />
      <rect x="7.4" y="6" width="3.2" height="10" rx="1.2" stroke="#A78BFA" strokeWidth="1.8" />
      <rect x="12.8" y="2" width="3.2" height="14" rx="1.2" stroke="#A78BFA" strokeWidth="1.8" />
    </svg>
  );
}

export default function LandingPage({ onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollYOffset, setScrollYOffset] = useState(0);
  const showcaseRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!showcaseRef.current) return;
      const rect = showcaseRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const diff = (sectionCenter - viewportCenter) * -0.05;
      setScrollYOffset(Math.max(-30, Math.min(30, diff)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    if (!showcaseRef.current) return;
    const rect = showcaseRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

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
              <a 
                href="/sign-up" 
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate("/sign-up");
                  }
                }}
                className="mulai-pj-btn"
              >
                Mulai Perjalananmu
              </a>
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
 
        {/* Section 2: Dampak Stres */}
        <section className="stress-impact-section" id="dampak-stres">
          <div className="stress-impact-header">
            <h2 className="stress-impact-title">
              Beberapa Dampak Stres Membuat{" "}
              <span className="impact-highlight">Kamu Terkena Hal Ini!</span>
            </h2>
            <p className="stress-impact-subtitle">
              Dampak kelelahan ini sering kali datang diam-diam dan merusak fokusmu
            </p>
          </div>

          <div className="stress-impact-grid">
            {impactCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div key={card.id} className="stress-card">
                  <div className="stress-card-icon-box">
                    <IconComponent className="stress-card-icon" size={28} strokeWidth={2.1} />
                  </div>
                  <div className="stress-card-content">
                    <h3 className="stress-card-title">{card.title}</h3>
                    <p className="stress-card-desc">{card.description}</p>
                    <a href={card.link} className="stress-card-cta">
                      <span>Pelajari lebih lanjut</span>
                      <ArrowRight size={15} strokeWidth={2.2} className="cta-arrow" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Smart Band Showcase */}
        <section 
          className="smartband-section" 
          id="sambungkan-smartband"
          ref={showcaseRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="smartband-container">
            {/* Top Showcase Area: Watches & Floating Badges (Left/Center) + Description (Right) */}
            <div className="smartband-showcase">
              <div className="smartband-visual-stage">
                {/* Parallax Watch Wrapper */}
                <div 
                  className="smartband-watch-wrapper"
                  style={{
                    transform: `perspective(1000px) rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg) translate3d(${mousePos.x * 7}px, ${mousePos.y * 7 + scrollYOffset * 0.35}px, 0)`
                  }}
                >
                  <img 
                    src={smartBandImg} 
                    alt="Smart Wristband D18 & 116 Plus" 
                    className="smartband-image" 
                  />

                  {/* Floating Item 1: HRV 84ms (Top) */}
                  <div 
                    className="floating-badge badge-hrv"
                    style={{
                      transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -16 + scrollYOffset * 0.65}px, 20px)`
                    }}
                  >
                    <div className="floating-badge-content">
                      <HrvWaveIcon />
                      <span className="badge-text">HRV 84ms</span>
                    </div>
                  </div>

                  {/* Floating Item 2: Data Lebih Akurat (Left) */}
                  <div 
                    className="floating-badge badge-data"
                    style={{
                      transform: `translate3d(${mousePos.x * 16}px, ${mousePos.y * 14 + scrollYOffset * 0.3}px, 15px)`
                    }}
                  >
                    <div className="floating-badge-content">
                      <DataBarIcon />
                      <span className="badge-text">Data Lebih Akurat</span>
                    </div>
                  </div>

                  {/* Floating Item 3: Mendeteksi Detak Jantung (Bottom Right) */}
                  <div 
                    className="floating-badge badge-heart"
                    style={{
                      transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -14 + scrollYOffset * 0.5}px, 25px)`
                    }}
                  >
                    <div className="floating-badge-content">
                      <HeartPulse size={18} strokeWidth={2.2} color="#FF4848" className="badge-svg-icon" />
                      <span className="badge-text">Mendeteksi Detak Jantung</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Description */}
              <div className="smartband-desc-side">
                <p className="smartband-desc-text">
                  Smart Wristband D18 &amp; 116 Plus bekerja secara real-time membaca sinyal tubuh—mulai dari detak jantung hingga indikator stres. Tanpa proses rumit, gelang pintar ini langsung terhubung ke platform kami untuk membantumu merespons kecemasan sebelum mengganggu harimu
                </p>
              </div>
            </div>

            {/* Bottom Row: Title, Subtitle, & CTA Button */}
            <div className="smartband-footer">
              <div className="smartband-footer-text">
                <h2 className="smartband-footer-title">Sambungkan Smart Band-mu</h2>
                <p className="smartband-footer-subtitle">
                  Biarkan kami membantumu mengenali sinyal stres lebih awal dan menuntunmu kembali rileks kapan saja.
                </p>
              </div>
              <a 
                href="/sign-up" 
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate("/sign-up");
                  }
                }}
                className="smartband-cta-btn"
              >
                Coba Sekarang
              </a>
            </div>
          </div>
        </section>

        {/* Section 4: Panduan Singkat Penggunaan Smart Wristband */}
        <section className="guide-section" id="cara-kerja">
          <div className="guide-header">
            <h2 className="guide-title">Panduan Singkat Penggunaan Smart Wristband</h2>
            <p className="guide-subtitle">
              Cukup 4 langkah mudah untuk menghubungkan perangkatmu dengan Ruang Tenang.
            </p>
          </div>

          <div className="guide-grid">
            {guideSteps.map((item) => (
              <div key={item.step} className="guide-card">
                <span className="guide-step-number">{item.step}</span>
                <h3 className="guide-card-title">{item.title}</h3>
                <p className="guide-card-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Komitmen Kami */}
        <section className="commitment-section" id="tentang">
          <div className="commitment-container">
            {/* Kolom Kiri: Teks & Pelajari Komitmen Kami */}
            <div className="commitment-left">
              <span className="commitment-tag">Komitmen Kami</span>
              <h2 className="commitment-title">
                Dirancang untuk Masa<br />
                Depan Kesehatan Mental<br />
                yang <span className="commitment-highlight">Lebih Inklusif.</span>
              </h2>
              <p className="commitment-desc">
                Dari kondisi penuh tekanan menuju ketenangan yang terukur, kami siap menuntun setiap orang menemukan keseimbangan mental harian mereka
              </p>
              <a href="#tentang" className="commitment-link">
                Pelajari Komitmen Kami
              </a>
            </div>

            {/* Kolom Tengah: Foto */}
            <div className="commitment-middle">
              <img
                src={commitmentImg}
                alt="Dirancang untuk Masa Depan Kesehatan Mental yang Lebih Inklusif"
                className="commitment-image"
              />
            </div>

            {/* Kolom Kanan: 3 Kotak Statistik */}
            <div className="commitment-right">
              {/* Box 1: TARGET */}
              <div className="commitment-stat-card target-box">
                <div className="stat-card-text">
                  <span className="stat-card-label">TARGET</span>
                  <div className="stat-card-value">3.4</div>
                  <p className="stat-card-desc">Mendukung kesehatan mental dan kesejahteraan</p>
                </div>
                <div className="stat-card-icon">
                  <Target size={26} strokeWidth={2.2} />
                </div>
              </div>

              {/* Box 2: AKSES */}
              <div className="commitment-stat-card akses-box">
                <div className="stat-card-text">
                  <span className="stat-card-label">AKSES</span>
                  <div className="stat-card-value">100%</div>
                  <p className="stat-card-desc">Bisa diakses dimanapun kapanpun</p>
                </div>
                <div className="stat-card-icon">
                  <Clock size={26} strokeWidth={2.2} />
                </div>
              </div>

              {/* Box 3: DAMPAK */}
              <div className="commitment-stat-card dampak-box">
                <div className="stat-card-text">
                  <span className="stat-card-label">DAMPAK</span>
                  <div className="stat-card-value">Ribuan</div>
                  <p className="stat-card-desc">Jiwa lebih sadar dan terhubung dengan tubuhnya</p>
                </div>
                <div className="stat-card-icon">
                  <Users size={26} strokeWidth={2.2} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: CTA Banner (Mari Wujudkan Kesehatan Mental) */}
        <section className="cta-banner-section">
          <div className="cta-banner-container">
            <div className="cta-banner-content">
              <h2 className="cta-banner-title">
                Mari Wujudkan Kesehatan Mental yang<br />
                Lebih Inklusif.
              </h2>
              <p className="cta-banner-desc">
                Bergabunglah bersama ribuan orang yang telah menemukan ruang tenang harian mereka secara terjangkau
              </p>
            </div>
            <a 
              href="/sign-up"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("/sign-up");
                }
              }}
              className="cta-banner-btn"
            >
              Mulai Perjalananmu
            </a>
          </div>
        </section>

        {/* Site Footer */}
        <footer className="site-footer">
          <div className="footer-container">
            {/* Top Section: 4 Kolom */}
            <div className="footer-top">
              {/* Kolom 1: Heading & Social Media */}
              <div className="footer-col footer-col-brand">
                <h3 className="footer-brand-title">
                  Membantu Setiap Orang Menemukan Ketenangan Harian
                </h3>
                <div className="footer-social-links" aria-label="Media Sosial">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    aria-label="Facebook"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sultan-saladin-pahlevi-758824400"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    aria-label="LinkedIn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/tann_sultan17/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    aria-label="Instagram"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Kolom 2: Komitmen Kami */}
              <div className="footer-col footer-col-commitment">
                <h4 className="footer-col-title">Komitmen Kami</h4>
                <p className="footer-col-text">
                  Mengintegrasikan IoT Smart Band &amp; AI untuk mendukung SDGs 3 (Kehidupan Sehat &amp; Sejahtera).
                </p>
              </div>

              {/* Kolom 3: Fitur */}
              <div className="footer-col footer-col-features">
                <h4 className="footer-col-title">Fitur</h4>
                <ul className="footer-links-list">
                  <li>
                    <a href="#sambungkan-smartband" className="footer-nav-link">Fitur IoT</a>
                  </li>
                  <li>
                    <a href="#cara-kerja" className="footer-nav-link">Cara Kerja</a>
                  </li>
                  <li>
                    <a href="#dampak-stres" className="footer-nav-link">Dampak Stres</a>
                  </li>
                  <li>
                    <a href="#tentang" className="footer-nav-link">SDGs</a>
                  </li>
                </ul>
              </div>

              {/* Kolom 4: Email Support & Pusat Bantuan */}
              <div className="footer-col footer-col-contact">
                <div className="footer-contact-block">
                  <h4 className="footer-col-title">Email Support</h4>
                  <a href="mailto:halo@aurapulse.id" className="footer-contact-link">
                    halo@aurapulse.id
                  </a>
                </div>

                <div className="footer-contact-block footer-contact-block-secondary">
                  <h4 className="footer-col-title">Pusat Bantuan</h4>
                  <a href="tel:+6281234567890" className="footer-contact-link">
                    +62 812-3456-7890
                  </a>
                </div>
              </div>
            </div>

            {/* Garis Pembatas */}
            <hr className="footer-divider" />

            {/* Bottom Row: Hak Cipta & Link Kebijakan */}
            <div className="footer-bottom">
              <p className="footer-copyright">
                &copy; 2026 Aura Pulse. All rights reserved
              </p>
              <div className="footer-legal-links">
                <a href="#kebijakan-privasi" className="footer-legal-link">Kebijakan Privasi</a>
                <span className="footer-legal-separator">|</span>
                <a href="#syarat-ketentuan" className="footer-legal-link">Syarat &amp; Ketentuan</a>
                <span className="footer-legal-separator">|</span>
                <a href="#pengaturan-cookie" className="footer-legal-link">Pengaturan Cookie</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}