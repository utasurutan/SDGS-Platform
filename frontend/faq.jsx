import React, { useState } from "react";
import "./faq.css";
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
  Plus,
  Minus,
  Menu,
  X,
} from "lucide-react";

export default function FaqPage({ onNavigate }) {
  // Sidebar active menu
  const [activeMenu, setActiveMenu] = useState("Faq");

  // State menu drawer versi mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State accordion yang sedang terbuka (default item 0 terbuka sesuai screenshot 1)
  const [openIndex, setOpenIndex] = useState(0);

  // Data Pertanyaan & Jawaban sesuai screenshot mockup AuraSync
  const faqData = [
    {
      id: 1,
      question: "Apa fungsi utama platform ini",
      answer:
        "Aura Pulse adalah platform SaaS kesehatan mental terintegrasi IoT (SDGs Goal 3) yang membantu pengguna mendeteksi stres secara real-time via smart band, meredakan ketegangan fisik melalui latihan relaksasi instan, menganalisis pemicu emosi dengan AI, serta menyediakan ruang komunitas aman",
    },
    {
      id: 2,
      question: "Bagaimana cara menghubungkan Smart Brand?",
      answer:
        'Setelah kamu melakukan Sign Up atau Sign In, sistem akan otomatis menampilkan panduan hubungkan perangkat. Pastikan Bluetooth pada perangkatmu sudah aktif, lalu klik "Cari Perangkat" dan pilih nama smart band kamu (seperti D18 atau 116 Plus) untuk langsung menyinkronkan data detak jantung secara otomatis.',
    },
    {
      id: 3,
      question: "Apa data biometrik dan jurnal harian saya aman?",
      answer:
        "Sangat aman. Seluruh data detak jantung (BPM/HRV) dan catatan emosi di Jurnal AI dilindungi dengan Enkripsi End-to-End. Data pribadi kamu tidak akan pernah dijual atau dibagikan ke pihak ketiga tanpa izin, dan kamu memegang kendali penuh untuk mengunduh atau menghapus riwayat datamu kapan saja",
    },
    {
      id: 4,
      question: "Apakah aplikasi ini bisa digunakan tanpa Smart Brand?",
      answer:
        "Bisa. Kamu tetap dapat menggunakan fitur Jurnal AI, mengikuti panduan latihan napas (breathwork) dan audio penenang di Ruang Relaksasi, serta berdiskusi di Komunitas. Hanya saja, tanpa smart band, fitur pemantauan detak jantung otomatis dan notifikasi lonjakan stres real-time tidak dapat aktif.",
    },
    {
      id: 5,
      question: "Bagaimana AI bisa mengetahui presentase strees atau kecemasan?",
      answer:
        "AI mengorelasikan dua sumber data: data fisik (lonjakan detak jantung/BPM dari smart band) dan data emosional (kata kunci/cerita yang kamu tulis di Jurnal AI). Dengan mencocokkan waktu terjadinya stres fisik dan topik catatanmu, AI memetakan estimasi persentase pemicu stres secara terukur (misal: Tugas/Akademik 53%, Kelelahan Fisik 41%).",
    },
    {
      id: 6,
      question: "Seberapa akurat pembacaan tingkat stres dari Smart Band",
      answer:
        "Smart Band menggunakan sensor fotopletismografi (PPG) optik untuk memantau variabilitas detak jantung (HRV) dan denyut nadi secara berkala. Algoritma AuraSync mengolah data tersebut untuk mendeteksi respons sistem saraf otonom dengan akurasi estimasi tren harian mencapai 85-90% untuk pemantauan gaya hidup dan pencegahan burnout.",
    },
  ];

  // Toggle buka/tutup accordion
  const handleToggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Handler Navigasi Sidebar
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

  return (
    <div className="faq-layout">
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
          2. MAIN CONTENT AREA (FAQ ACCORDION)
          ============================================================ */}
      <main className="faq-main">
        {/* Header: Frequently asked question */}
        <header className="faq-header">
          <h1 className="faq-title">Frequently asked question</h1>
          <p className="faq-subtitle">
            Berikut panduan lengkap tentang Smart Brand serta website ini
          </p>
        </header>

        {/* Accordion FAQ List */}
        <div className="faq-accordion-list" role="region" aria-label="Daftar Pertanyaan">
          {faqData.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id}
                className={`faq-accordion-card ${isOpen ? "open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-accordion-header"
                  onClick={() => handleToggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span className="faq-question-text">{item.question}</span>
                  <div className="faq-icon-wrap" aria-hidden="true">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>

                <div
                  id={`faq-answer-${item.id}`}
                  className={`faq-accordion-content ${isOpen ? "expanded" : ""}`}
                >
                  <div className="faq-content-inner">
                    <p className="faq-answer-text">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
