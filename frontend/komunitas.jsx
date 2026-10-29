import React, { useState, useRef, useEffect } from "react";
import "./komunitas.css";
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
  Calendar,
  Bell,
  Menu,
  X,
  Camera,
  Video,
  Image as ImageIcon,
  Send,
  ThumbsUp,
  MessageCircle,
  Share2,
  Check,
  Trash2,
  Edit3,
  Clock,
  ArrowRight,
  Globe,
} from "lucide-react";

// Assets
import avatar1 from "../Assets/Picture/Ellipse 31.png";
import avatar2 from "../Assets/Picture/Ellipse 32.png";
import avatar3 from "../Assets/Picture/Ellipse 33.png";
import avatar4 from "../Assets/Picture/Ellipse 34.png";
import avatar5 from "../Assets/Picture/Ellipse 35.png";
import newsImg1 from "../Assets/Picture/Desain tanpa judul - 2026-10-28T001814.503.png";
import newsImg2 from "../Assets/Picture/Desain tanpa judul - 2026-10-28T001204.807.png";
import newsImg3 from "../Assets/Picture/Desain tanpa judul - 2026-10-28T001525.307.png";
import newsImg4 from "../Assets/Picture/Rectangle 131 (1).png";

export default function KomunitasPage({ onNavigate }) {
  // Current user
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("aurasync_user");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Gagal parse aurasync_user:", e);
    }
    return {
      name: "Frenkie",
      email: "frenkie@aurasync.id",
      picture: null,
      ageCity: "18 Tahun, Bekasi",
    };
  });

  const [activeMenu, setActiveMenu] = useState("Komunitas");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form input post
  const [postText, setPostText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null); // { type: 'image' | 'video', url: string, name: string }
  const fileInputImageRef = useRef(null);
  const fileInputVideoRef = useRef(null);
  const fileInputGalleryRef = useRef(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState("");

  // Feed Posts state (initialized with 3 sample posts from screenshot)
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("aurasync_community_posts");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Gagal parse aurasync_community_posts:", e);
    }
    return [
      {
        id: "post-1",
        author: "Febrie Mulyadi",
        authorAvatar: avatar1,
        timeAgo: "5 Menit Lalu . Publik",
        content:
          "Aku tadi siang sempat panik banget pas presentasi tugas kelompok. Tiba-tiba ada notifikasi dari Aura Pulse kalau BPM aku melonjak naik ke 108! Langsung aku coba ke Ruang Relaksasi buat ikut latihan napas 4-7-8 selama 3 menit. Alhamdulillah pas dicek lagi detak jantung turun jadi 74 BPM dan dada kencang langsung plong. Ada yang sering kena panic attack mendadak pas presentasi juga ga?",
        media: null,
        likesCount: 5678,
        isLiked: false,
        commentsCount: 12,
        sharesCount: 64,
        commentsList: [
          {
            id: "c1",
            author: "Sarah Aulia",
            text: "Sama banget kak! Nafas 4-7-8 emang penyelamat pas deg-degan parah.",
            time: "3 mnt lalu",
          },
        ],
      },
      {
        id: "post-2",
        author: "Robert Zul",
        authorAvatar: avatar2,
        timeAgo: "30 Menit Lalu . Publik",
        content:
          "Pengalaman aku pas lagi tegang dikejar deadline, makin ditahan makin bikin dada sesak. Saran aku: begitu D18 dapat notifikasi stres, stop dulu ngetik 3 menit. Ambil napas dalam-dalam baru lanjut lagi. Efektif banget biar gak keburu burnout!",
        media: null,
        likesCount: 5668,
        isLiked: false,
        commentsCount: 5,
        sharesCount: 14,
        commentsList: [],
      },
      {
        id: "post-3",
        author: "Dwi Sartika",
        authorAvatar: avatar3,
        timeAgo: "30 Menit Lalu . Publik",
        content:
          "Buat yang sering maksain diri padahal tubuh udah capek: dengerin respon biometrik kamu. Pas Aura Pulse ngasih peringatan stres tinggi, itu tanda dari tubuh buat pause sebentar. Jangan merasa bersalah buat istirahat ya teman-teman",
        media: null,
        likesCount: 5678,
        isLiked: false,
        commentsCount: 12,
        sharesCount: 64,
        commentsList: [],
      },
    ];
  });

  // State untuk komentar yang sedang terbuka per post
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  const [commentInput, setCommentInput] = useState("");

  // Persist posts ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aurasync_community_posts", JSON.stringify(posts));
    } catch (e) {
      console.warn("Gagal simpan posts:", e);
    }
  }, [posts]);

  // Handler navigasi
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

  // Upload Media handler
  const handleFileChange = (e, forcedType = null) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const isVideo = forcedType === "video" || file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedMedia({
        type: isVideo ? "video" : "image",
        url: reader.result,
        name: file.name,
      });
      showToast(`Media ${isVideo ? "video" : "foto"} berhasil dilampirkan`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Kirim Post Baru
  const handleSendPost = (e) => {
    e.preventDefault();
    if (!postText.trim() && !selectedMedia) {
      showToast("Tulis cerita atau lampirkan foto/video terlebih dahulu!");
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      author: user.name || "Frenkie",
      authorAvatar: user.picture || avatar4,
      timeAgo: "Baru Saja . Publik",
      content: postText.trim(),
      media: selectedMedia,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      sharesCount: 0,
      commentsList: [],
    };

    setPosts([newPost, ...posts]);
    setPostText("");
    setSelectedMedia(null);
    showToast("Postingan kamu berhasil dibagikan ke Komunitas!");
  };

  // Like Toggle
  const handleToggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          const likesCount = isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
          return { ...p, isLiked, likesCount };
        }
        return p;
      })
    );
  };

  // Kirim Komentar
  const handleSendComment = (postId) => {
    if (!commentInput.trim()) return;

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: user.name || "Frenkie",
            text: commentInput.trim(),
            time: "Baru saja",
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            commentsList: [...p.commentsList, newComment],
          };
        }
        return p;
      })
    );
    setCommentInput("");
    showToast("Komentar terkirim!");
  };

  // Share link
  const handleShare = (post) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/komunitas#${post.id}`);
      showToast("Tautan postingan berhasil disalin!");
    } else {
      showToast("Tautan postingan dibagikan!");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3200);
  };

  return (
    <div className="komunitas-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="komunitas-toast" role="status" aria-live="polite">
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
          2. MAIN CONTENT AREA (KOMUNITAS & BERITA WIDGET)
          ============================================================ */}
      <main className="komunitas-main">
        {/* Top Header Bar: Greeting + Actions + User Profile */}
        <header className="komunitas-header">
          <div className="header-greeting">
            <h1 className="greeting-title">Halo {user.name || "Frenkie"}</h1>
            <p className="greeting-desc">
              Selamat datang di komunitas disini kamu bisa berkomunikasi dan meminta saran kepada
              sesama teman lainnya!
            </p>
          </div>

          <div className="header-user-actions">
            <button
              type="button"
              className="header-icon-btn"
              title="Kalender"
              aria-label="Buka Kalender"
            >
              <Calendar size={18} />
            </button>
            <button
              type="button"
              className="header-icon-btn bell-btn"
              title="Notifikasi"
              aria-label="Lihat Notifikasi"
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </button>

            {/* User Profile Pill */}
            <div className="header-profile-card">
              <div className="header-avatar-circle">
                {user.picture ? (
                  <img src={user.picture} alt="Profil" className="header-avatar-img" />
                ) : (
                  <img src={avatar4} alt="Profil" className="header-avatar-img" />
                )}
              </div>
              <div className="header-profile-text">
                <span className="profile-name">{user.name || "Frenkie"}</span>
                <span className="profile-meta">{user.ageCity || "18 Tahun , Bekasi"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* ============================================================
            CREATE POST CARD
            ============================================================ */}
        <section className="create-post-card" aria-label="Buat Postingan">
          <h2 className="create-post-title">Buat postingan atau pengalaman mu!</h2>

          <form onSubmit={handleSendPost} className="create-post-form">
            <div className="post-input-box">
              <textarea
                className="post-textarea"
                rows={3}
                placeholder="Berikan pengalaman mu atau ceritakan keluhan mu!"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />
              <Edit3 size={18} className="post-pencil-icon" />
            </div>

            {/* Media Attachment Preview if selected */}
            {selectedMedia && (
              <div className="media-preview-container">
                {selectedMedia.type === "image" ? (
                  <img
                    src={selectedMedia.url}
                    alt="Lampiran Postingan"
                    className="media-preview-item"
                  />
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="media-preview-item video"
                  />
                )}
                <button
                  type="button"
                  className="btn-remove-media"
                  onClick={() => setSelectedMedia(null)}
                  title="Hapus Lampiran"
                >
                  <Trash2 size={14} />
                  <span>Hapus Media</span>
                </button>
              </div>
            )}

            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={fileInputImageRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
            />
            <input
              type="file"
              ref={fileInputVideoRef}
              style={{ display: "none" }}
              accept="video/*"
              onChange={(e) => handleFileChange(e, "video")}
            />
            <input
              type="file"
              ref={fileInputGalleryRef}
              style={{ display: "none" }}
              accept="image/*,video/*"
              onChange={(e) => handleFileChange(e)}
            />

            {/* Bottom Actions Row */}
            <div className="create-post-actions-row">
              <div className="media-buttons-group">
                <button
                  type="button"
                  className="btn-media-action"
                  onClick={() => fileInputImageRef.current && fileInputImageRef.current.click()}
                >
                  <Camera size={18} />
                  <span>Foto</span>
                </button>
                <button
                  type="button"
                  className="btn-media-action"
                  onClick={() => fileInputVideoRef.current && fileInputVideoRef.current.click()}
                >
                  <Video size={18} />
                  <span>Video</span>
                </button>
                <button
                  type="button"
                  className="btn-media-action"
                  onClick={() => fileInputGalleryRef.current && fileInputGalleryRef.current.click()}
                >
                  <ImageIcon size={18} />
                  <span>Galery</span>
                </button>
              </div>

              <button type="submit" className="btn-send-post">
                <Send size={16} />
                <span>Kirim</span>
              </button>
            </div>
          </form>
        </section>

        {/* ============================================================
            MAIN GRID: FEED (LEFT) + EDUKASI & BERITA (RIGHT)
            ============================================================ */}
        <div className="komunitas-grid-layout">
          {/* LEFT COLUMN: Feed Posts */}
          <div className="komunitas-feed-col">
            {posts.map((post) => (
              <article key={post.id} id={post.id} className="post-card">
                {/* Post Author Header */}
                <div className="post-author-header">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="post-author-avatar"
                  />
                  <div className="post-author-info">
                    <h3 className="post-author-name">{post.author}</h3>
                    <p className="post-meta-time">{post.timeAgo}</p>
                  </div>
                </div>

                {/* Post Bubble Content */}
                <div className="post-bubble-content">
                  <p className="post-text-body">{post.content}</p>

                  {/* Optional Media (Image or Video) */}
                  {post.media && (
                    <div className="post-attached-media">
                      {post.media.type === "image" ? (
                        <img
                          src={post.media.url}
                          alt="Foto postingan"
                          className="post-media-element"
                        />
                      ) : (
                        <video
                          src={post.media.url}
                          controls
                          className="post-media-element video"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Reaction Actions Bar */}
                <div className="post-reaction-bar">
                  <button
                    type="button"
                    className={`reaction-btn ${post.isLiked ? "liked" : ""}`}
                    onClick={() => handleToggleLike(post.id)}
                  >
                    <ThumbsUp size={16} />
                    <span>{post.likesCount.toLocaleString("id-ID")} Suka</span>
                  </button>

                  <button
                    type="button"
                    className={`reaction-btn ${openCommentPostId === post.id ? "active" : ""}`}
                    onClick={() =>
                      setOpenCommentPostId(openCommentPostId === post.id ? null : post.id)
                    }
                  >
                    <MessageCircle size={16} />
                    <span>{post.commentsCount} Komentar</span>
                  </button>

                  <button
                    type="button"
                    className="reaction-btn"
                    onClick={() => handleShare(post)}
                  >
                    <Share2 size={16} />
                    <span>{post.sharesCount} Dibagikan</span>
                  </button>
                </div>

                {/* Expandable Comments Drawer */}
                {openCommentPostId === post.id && (
                  <div className="post-comments-drawer">
                    <div className="comments-list">
                      {post.commentsList && post.commentsList.length > 0 ? (
                        post.commentsList.map((comm) => (
                          <div key={comm.id} className="comment-item">
                            <div className="comment-bubble">
                              <span className="comment-author">{comm.author}</span>
                              <p className="comment-text">{comm.text}</p>
                            </div>
                            <span className="comment-time">{comm.time}</span>
                          </div>
                        ))
                      ) : (
                        <p className="empty-comments-hint">
                          Belum ada komentar. Jadilah yang pertama berkomentar!
                        </p>
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <div className="comment-input-row">
                      <input
                        type="text"
                        placeholder="Tulis balasanmu..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendComment(post.id);
                          }
                        }}
                        className="comment-field"
                      />
                      <button
                        type="button"
                        className="btn-submit-comment"
                        onClick={() => handleSendComment(post.id)}
                      >
                        Kirim
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* RIGHT COLUMN: Edukasi & Berita Sidebar Widget */}
          <aside className="komunitas-news-col" aria-label="Edukasi dan Berita">
            <div className="news-widget-card">
              <div className="news-widget-header">
                <div>
                  <h2 className="news-widget-title">Edukasi & Berita</h2>
                  <p className="news-widget-subtitle">Caritahu dan baca berita dibawah ini</p>
                </div>
                <button
                  type="button"
                  className="btn-all-news-link"
                  onClick={() => {
                    if (onNavigate) onNavigate("/berita");
                  }}
                >
                  <span>Lihat Semua</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* News Item 1 */}
              <article
                className="news-mini-card"
                onClick={() => {
                  if (onNavigate) onNavigate("/berita/tekanan-akademis-screen-time");
                }}
              >
                <div className="news-img-wrap">
                  <img
                    src={newsImg1}
                    alt="Kelelahan Mental Gen Z"
                    className="news-thumb-img"
                  />
                </div>
                <div className="news-card-body">
                  <h3 className="news-card-title">
                    Mengurai Pemicu Kelelahan Mental: Bagaimana Tekanan Akademis dan Screen Time
                    Memengaruhi Kesehatan Mental Gen Z
                  </h3>
                  <div className="news-card-meta">
                    <Clock size={12} />
                    <span>14 Oktober 2026</span>
                    <span className="meta-bullet">•</span>
                    <span>10 Menit</span>
                  </div>
                </div>
              </article>

              {/* News Item 2 */}
              <article
                className="news-mini-card"
                onClick={() => {
                  if (onNavigate) onNavigate("/berita/deadline-ketat-paparan-digital");
                }}
              >
                <div className="news-img-wrap">
                  <img
                    src={newsImg2}
                    alt="Deadline dan Paparan Digital"
                    className="news-thumb-img"
                  />
                </div>
                <div className="news-card-body">
                  <h3 className="news-card-title">
                    Dibalik Layar Gadget: Bagaimana Deadline Ketat dan Paparan Digital Memicu Gangguan
                    Kecemasan (Anxiety) pada Gen Z
                  </h3>
                  <div className="news-card-meta">
                    <Clock size={12} />
                    <span>14 Oktober 2026</span>
                    <span className="meta-bullet">•</span>
                    <span>10 Menit</span>
                  </div>
                </div>
              </article>

              {/* News Item 3 */}
              <article
                className="news-mini-card"
                onClick={() => {
                  if (onNavigate) onNavigate("/berita/overworking-mindfulness");
                }}
              >
                <div className="news-img-wrap">
                  <img
                    src={newsImg3}
                    alt="Overworking Menuju Mindfulness"
                    className="news-thumb-img"
                  />
                </div>
                <div className="news-card-body">
                  <h3 className="news-card-title">
                    Dari Overworking Menuju Mindfulness: Langkah Praktis Mengelola Stres Akademis di
                    Tengah Era Digital
                  </h3>
                  <div className="news-card-meta">
                    <Clock size={12} />
                    <span>20 Oktober 2026</span>
                    <span className="meta-bullet">•</span>
                    <span>12 Menit</span>
                  </div>
                </div>
              </article>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
