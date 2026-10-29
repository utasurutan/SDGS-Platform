import React, { useState } from "react";
import "./berita.css";
import Sidebar from "./Sidebar.jsx";
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
  Clock,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
} from "lucide-react";

// Assets
import newsImg1 from "../Assets/Picture/Desain tanpa judul - 2026-10-28T001814.503.png";
import newsImg2 from "../Assets/Picture/Desain tanpa judul - 2026-10-28T001204.807.png";
import newsImg3 from "../Assets/Picture/Desain tanpa judul - 2026-10-28T001525.307.png";
import newsImg4 from "../Assets/Picture/Rectangle 131 (1).png";

export const ARTICLES_DATA = [
  {
    id: "tekanan-akademis-screen-time",
    title:
      "Mengurai Pemicu Kelelahan Mental: Bagaimana Tekanan Akademis dan Screen Time Memengaruhi Kesehatan Mental Gen Z",
    date: "14 Oktober 2026",
    readTime: "10 Menit",
    coverImage: newsImg1,
    summary:
      "Kombinasi antara tumpukan deadline yang ketat serta tingginya durasi waktu layar harian disinyalir menjadi pemicu utama di balik meningkatnya tekanan emosional pada usia produktif.",
    content: (
      <>
        <p className="article-intro-lead">
          Berikut adalah draft artikel berita edukatif yang lengkap, terstruktur, dan siap kamu
          gunakan untuk portal berita, blog platform, atau modul edukasi Aura Pulse:
        </p>

        <p className="article-paragraph">
          <strong>JAKARTA —</strong> Di tengah percepatan arus digital dan tuntutan akademis yang
          kian tinggi, generasi muda (Gen Z) kini berhadapan dengan tantangan kesehatan mental yang
          semakin kompleks. Fenomena kelelahan mental (<em>burnout</em>) dan gangguan kecemasan (
          <em>anxiety</em>) tidak lagi menjadi isu asing bagi pelajar hingga pekerja muda. Kombinasi
          antara tumpukan deadline yang ketat serta tingginya durasi waktu layar (<em>screen time</em>)
          harian disinyalir menjadi pemicu utama di balik meningkatnya tekanan emosional pada usia
          produktif.
        </p>

        <h3 className="article-section-heading">Tekanan Akademis dan Budaya Overworking</h3>
        <p className="article-paragraph">
          Bagi mayoritas pelajar dan mahasiswa, ekspektasi prestasi akademis serta dinamika tugas
          yang terus berdatangan kerap memicu stres kronis. Pola kerja atau belajar hingga larut malam
          (<em>overworking</em>) demi mengejar deadline tanpa diimbangi waktu istirahat yang cukup
          dapat memicu respons stres pada tubuh.
        </p>
        <p className="article-paragraph">
          Secara biologis, saat seseorang berada dalam tekanan terus-menerus, sistem saraf simpatik
          akan mengaktifkan pelepasan hormon kortisol dan adrenalin. Akibatnya, tubuh berada dalam
          kondisi siaga berlebih (<em>fight-or-flight</em>), yang ditandai dengan meningkatnya detak
          jantung (<em>Heart Rate/BPM</em>), otot tegang, hingga sulit fokus.
        </p>

        <h3 className="article-section-heading">Kerja Screen Time dan Information Overload</h3>
        <p className="article-paragraph">
          Di sisi lain, kebiasaan menatap layar gadget—baik untuk keperluan belajar, bekerja, maupun
          mengakses media sosial—turut memperberat beban kerja otak. Paparan cahaya biru (
          <em>blue light</em>) dan arus informasi tak terbatas (<em>information overload</em>) secara
          konstan memicu kelelahan sensorik.
        </p>
        <p className="article-paragraph">
          Tingginya screen time menjelang tidur juga terbukti mengganggu sekresi hormon melatonin,
          sehingga menurunkan kualitas tidur harian. Kualitas tidur yang buruk secara langsung
          berdampak pada penurunan ketahanan mental, membuat seseorang lebih rentan mengalami
          overthinking, krisis percaya diri, dan lonjakan kecemasan mendadak (<em>anxiety spike</em>).
        </p>

        <h3 className="article-section-heading">Sinyal Biometrik: Ketika Tubuh Memberi Peringatan</h3>
        <p className="article-paragraph">
          Sering kali, gejala kelelahan mental muncul terlebih dahulu melalui sinyal-sinyal
          biometrik tubuh sebelum disadari secara emosional. Beberapa indikator fisik yang kerap
          menyertai burnout meliputi:
        </p>
        <ul className="article-bullet-list">
          <li>
            <strong>Detak Jantung Meningkat (High Resting BPM):</strong> Frekuensi detak jantung dalam
            kondisi istirahat cenderung lebih tinggi dari batas normal.
          </li>
          <li>
            <strong>Variabilitas Detak Jantung Menurun (Low HRV):</strong> Menandakan bahwa sistem
            saraf tubuh berada dalam tingkat stres yang tinggi dan membutuhkan pemulihan.
          </li>
          <li>
            <strong>Kelelahan Fisik dan Sakit Kepala:</strong> Akibat ketegangan saraf dan
            berkurangnya fleksibilitas pembuluh darah akibat stres kronis.
          </li>
        </ul>

        <h3 className="article-section-heading">Langkah Mitigasi dan Regulasi Mandiri</h3>
        <p className="article-paragraph">
          Para ahli kesehatan mental menyarankan pentingnya menerapkan strategi penanganan mandiri (
          <em>self-monitoring</em>) serta regulasi sistem saraf secara berkala:
        </p>
        <ol className="article-numbered-list">
          <li>
            <strong>Penerapan Digital Detox Terjadwal:</strong> Memberikan jeda 30–60 menit bebas dari
            layar sebelum tidur untuk mengembalikan siklus alaminya.
          </li>
          <li>
            <strong>Latihan Pernapasan Parasimpatik:</strong> Menggunakan teknik pernapasan lambat
            (seperti teknik 4-7-8) untuk merangsang saraf vagus guna menurunkan detak jantung yang
            melonjak secara alami.
          </li>
          <li>
            <strong>Pencatatan Emosi & Pemantauan Biometrik:</strong> Mengenali pemicu stres (
            <em>stress triggers</em>) melalui jurnal harian dan pemantauan sinyal tubuh agar
            intervensi relaksasi dapat dilakukan lebih awal sebelum terjadi burnout total.
          </li>
        </ol>

        <p className="article-conclusion">
          Memahami bahwa kelelahan mental adalah respons fisik yang nyata—bukan sekadar bentuk
          kelemahan emosional—merupakan langkah awal yang penting bagi generasi muda untuk mulai
          membangun pola hidup yang lebih sehat dan seimbang di era digital.
        </p>
      </>
    ),
  },
  {
    id: "deadline-ketat-paparan-digital",
    title:
      "Dibalik Layar Gadget: Bagaimana Deadline Ketat dan Paparan Digital Memicu Gangguan Kecemasan (Anxiety) pada Gen Z",
    date: "14 Oktober 2026",
    readTime: "10 Menit",
    coverImage: newsImg2,
    summary:
      "Tidur dengan kepala di atas laptop menjadi simbol kelelahan generasi muda era digital. Bagaimana paparan layar berlebih mengubah ritme tidur dan pemicu kecemasan?",
    content: (
      <>
        <p className="article-paragraph">
          <strong>JAKARTA —</strong> Fenomena ketiduran di depan laptop bukan lagi pemandangan asing
          di kalangan mahasiswa dan profesional muda. Ritme serbacepat dan tuntutan serba instan
          sering kali memaksa otak bekerja melampaui kapasitas fisiologisnya.
        </p>
        <h3 className="article-section-heading">Dampak Paparan Digital Tanpa Batas</h3>
        <p className="article-paragraph">
          Otak manusia tidak dirancang untuk menerima stimulasi audio-visual tanpa henti selama lebih
          dari 10 jam per hari. Saat kita terus terpapar notifikasi, tugas yang belum selesai, dan
          pesan instan, amigdala (pusat pemrosesan rasa takut dan cemas) akan terus aktif dalam mode
          waspada.
        </p>
        <h3 className="article-section-heading">Mengembalikan Kendali Diri</h3>
        <p className="article-paragraph">
          Penting bagi kita untuk menetapkan batas tegas antara ruang kerja digital dan ruang istirahat
          pribadi. Melalui sinkronisasi smart band Aura Pulse, deteksi dini kenaikan denyut nadi saat
          mengetik dapat menjadi alarm ramah untuk segera beristirahat.
        </p>
      </>
    ),
  },
  {
    id: "overworking-mindfulness",
    title:
      "Dari Overworking Menuju Mindfulness: Langkah Praktis Mengelola Stres Akademis di Tengah Era Digital",
    date: "20 Oktober 2026",
    readTime: "12 Menit",
    coverImage: newsImg3,
    summary:
      "Panduan praktis mindfulness harian bagi mahasiswa dan profesional muda untuk menghentikan siklus overworking yang merusak konsentrasi.",
    content: (
      <>
        <p className="article-paragraph">
          <strong>JAKARTA —</strong> Mindfulness bukan sekadar tren meditasi, melainkan metode
          berbasis sains untuk melatih kesadaran penuh terhadap kondisi fisik dan emosional saat ini.
        </p>
        <h3 className="article-section-heading">Mengapa Overworking Menjadi Perangkap?</h3>
        <p className="article-paragraph">
          Banyak orang mengira bekerja lebih lama selalu berarti lebih produktif. Riset menunjukkan
          bahwa setelah jam ke-6 kerja tanpa istirahat, efisiensi kognitif menurun drastis hingga 40%,
          sementara tingkat error meningkat tajam.
        </p>
        <h3 className="article-section-heading">Latihan 3 Menit Menenangkan Saraf</h3>
        <p className="article-paragraph">
          Cukup dengan jeda 3 menit setiap 90 menit kerja: letakkan tangan di perut, pejamkan mata,
          dan lakukan tarikan nafas 4 hitungan, tahan 7 hitungan, hembuskan 8 hitungan. Ritme ini
          terbukti menurunkan detak jantung dan merilekskan otot leher yang kaku.
        </p>
      </>
    ),
  },
  {
    id: "deadline-tanpa-anxiety",
    title:
      "Menghadapi Deadline Tanpa Anxiety: Menerapkan Regulasi Saraf dan Digital Detox untuk Gen Z",
    date: "10 Oktober 2026",
    readTime: "10 Menit",
    coverImage: newsImg4,
    summary:
      "Trik psikologis dan fisiologis menyelesaikan tugas akhir tanpa memicu kepanikan jantung berdebar kencang.",
    content: (
      <>
        <p className="article-paragraph">
          <strong>JAKARTA —</strong> Kalender yang dilingkari tanggal merah deadline sering kali
          menjadi pemicu lonjakan BPM secara tiba-tiba. Namun, kepanikan tidak menyelesaikan tugas;
          ketenangan sistem syaraf-lah yang mengembalikan kejernihan berpikir.
        </p>
        <h3 className="article-section-heading">Memecah Beban Kognitif</h3>
        <p className="article-paragraph">
          Alih-alih memikirkan seluruh proyek sekaligus, pecah pekerjaan menjadi blok fokus 25 menit
          (metode Pomodoro). Gunakan smart band untuk memantau apakah tingkat stres kamu tetap di zona
          hijau selama sesi fokus.
        </p>
      </>
    ),
  },
];

export default function BeritaPage({ onNavigate, currentSlug = null }) {
  const [activeMenu, setActiveMenu] = useState("Komunitas");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Temukan artikel yang aktif berdasarkan slug atau artikel pertama sebagai default
  const [activeArticleId, setActiveArticleId] = useState(() => {
    if (currentSlug) {
      const match = ARTICLES_DATA.find((a) => a.id === currentSlug);
      if (match) return match.id;
    }
    return ARTICLES_DATA[0].id;
  });

  const currentArticle =
    ARTICLES_DATA.find((a) => a.id === activeArticleId) || ARTICLES_DATA[0];

  // Daftar artikel sidebar (artikel lain selain yang sedang aktif)
  const sidebarArticles = ARTICLES_DATA.filter((a) => a.id !== currentArticle.id);

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

  const handleSelectArticle = (id) => {
    setActiveArticleId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShareArticle = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage("Tautan artikel berhasil disalin!");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  return (
    <div className="berita-layout">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="berita-toast" role="status">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

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
      />

      {/* ============================================================
          2. MAIN ARTICLE VIEW (LEFT) + RELATED ARTICLES (RIGHT)
          ============================================================ */}
      <main className="berita-main">
        {/* Navigation Breadcrumb */}
        <div className="berita-breadcrumb-row">
          <button
            type="button"
            className="btn-back-breadcrumb"
            onClick={() => {
              if (onNavigate) onNavigate("/komunitas");
            }}
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Komunitas</span>
          </button>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">Edukasi & Berita</span>
        </div>

        {/* 2-Column Article Grid */}
        <div className="berita-grid-layout">
          {/* Main Article Body Column */}
          <article className="main-article-wrapper">
            {/* Big Featured Cover Image */}
            <div className="article-cover-box">
              <img
                src={currentArticle.coverImage}
                alt={currentArticle.title}
                className="article-cover-image"
              />
            </div>

            {/* Article Header & Meta */}
            <header className="article-headline-block">
              <h1 className="article-main-title">{currentArticle.title}</h1>
              <div className="article-meta-row">
                <div className="article-meta-left">
                  <span className="article-meta-item">
                    <Calendar size={14} />
                    <span>{currentArticle.date}</span>
                  </span>
                  <span className="meta-bullet">•</span>
                  <span className="article-meta-item">
                    <Clock size={14} />
                    <span>{currentArticle.readTime}</span>
                  </span>
                </div>

                <div className="article-actions-right">
                  <button
                    type="button"
                    className="article-action-btn"
                    onClick={handleShareArticle}
                    title="Bagikan Artikel"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    type="button"
                    className="article-action-btn"
                    title="Simpan Artikel"
                  >
                    <Bookmark size={16} />
                  </button>
                </div>
              </div>
            </header>

            {/* Render Article Body Content */}
            <div className="article-content-body">{currentArticle.content}</div>
          </article>

          {/* Right Sidebar: Related Articles */}
          <aside className="berita-sidebar-col" aria-label="Artikel Lainnya">
            <div className="sidebar-articles-box">
              <div className="sidebar-box-header">
                <h2 className="sidebar-box-title">Berita & Edukasi</h2>
                <button
                  type="button"
                  className="btn-see-all"
                  onClick={() => handleSelectArticle(ARTICLES_DATA[0].id)}
                >
                  Lihat Semua
                </button>
              </div>

              {/* List of sidebar articles */}
              <div className="sidebar-cards-list">
                {sidebarArticles.map((art) => (
                  <article
                    key={art.id}
                    className="related-article-card"
                    onClick={() => handleSelectArticle(art.id)}
                  >
                    <div className="related-img-wrap">
                      <img
                        src={art.coverImage}
                        alt={art.title}
                        className="related-thumb-img"
                      />
                    </div>
                    <div className="related-body">
                      <h3 className="related-title">{art.title}</h3>
                      <div className="related-meta">
                        <span>{art.date}</span>
                        <span className="meta-bullet">•</span>
                        <span>{art.readTime}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
