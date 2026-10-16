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
} from "lucide-react";
import reviewImg from "../Assets/Picture/Group 21.png";
import heroVisualImg from "../Assets/Picture/Group 26 (1).svg";
import smartBandImg from "../Assets/Picture/download__36_-removebg-preview 2.png";

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
      </main>
    </>
  );
}