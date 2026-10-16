import { useState } from "react";
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
} from "lucide-react";
import reviewImg from "../Assets/Picture/Group 21.png";
import heroVisualImg from "../Assets/Picture/Group 26 (1).svg";

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
      </main>
    </>
  );
}