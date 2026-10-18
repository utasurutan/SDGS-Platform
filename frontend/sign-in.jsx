import { useState } from "react";
import "./sign-in.css";
import signinPoster from "../Assets/Picture/Group 26 (1).png";
import googleIcon from "../Assets/Icon/devicon_google.png";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

/**
 * Solar Login 2 Broken icon matching the reference design
 */
function SolarLoginIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="none" stroke="#1E6AFF" strokeLinecap="round" strokeWidth="2.1">
        <path
          strokeLinejoin="round"
          d="M2.001 12h14m-3.5 3 3.5-3-3.5-3"
        />
        <path d="M9.002 7c.012-2.175.109-3.353.877-4.121C10.758 2 12.172 2 15 2h1c2.828 0 4.243 0 5.121.879C22 3.757 22 5.172 22 8v8c0 2.828 0 4.243-.879 5.121C20.353 21.89 19.175 21.986 17 21.998M9.002 17c.012 2.175.109 3.353.877 4.121C10.52 21.763 11.447 21.936 13 21.983" />
      </g>
    </svg>
  );
}

export default function SignIn({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign in data:", formData);
  };

  const handleLinkClick = (e, path) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <div className="signin-wrapper">
      <main className="signin-container">
        {/* Sisi Kiri: Poster Visual Terbaru */}
        <section className="signin-left" aria-label="Visual Poster">
          <div className="signin-poster-box">
            <img
              src={signinPoster}
              alt="Mengenali Sinyal Tubuhmu Sebelum Rasa Cemas Mengambil Alih"
            />
          </div>
        </section>

        {/* Sisi Kanan: Form Masuk Ke Akunmu */}
        <section className="signin-right" aria-label="Formulir Masuk">
          {/* Header */}
          <div className="signin-header">
            <SolarLoginIcon className="signin-header-icon" />
            <div className="signin-header-text">
              <h1>Masuk Ke Akunmu</h1>
              <p>Masuk ke akun mu dan lihat keadaan dirimu sekarang</p>
            </div>
          </div>

          {/* Formulir Input */}
          <form onSubmit={handleSubmit}>
            {/* Field 1: Nama Lengkap */}
            <div className="signin-input-group">
              <label htmlFor="fullname">
                Nama Lengkap<span className="required">*</span>
              </label>
              <input
                type="text"
                id="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Masukan nama lengkap anda"
                required
              />
            </div>

            {/* Field 2: Alamat Email */}
            <div className="signin-input-group">
              <label htmlFor="email">
                Alamat Email<span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan alamat email kamu disini"
                required
              />
            </div>

            {/* Field 3: Kata Sandi */}
            <div className="signin-input-group">
              <label htmlFor="password">
                Kata Sandi<span className="required">*</span>
              </label>
              <div className="signin-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan kata sandi kamu disini"
                  required
                />
                <button
                  type="button"
                  className="signin-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="signin-forgot-row">
                <a href="#lupa-sandi" className="signin-forgot-link">
                  Lupa Kata Sandi?
                </a>
              </div>
            </div>

            {/* Tombol Masuk */}
            <button type="submit" className="signin-submit-btn">
              Masuk
            </button>

            {/* Divider */}
            <div className="signin-divider">
              <span>Atau</span>
            </div>

            {/* Tombol Google */}
            <button type="button" className="signin-google-btn">
              <img src={googleIcon} alt="" aria-hidden="true" />
              <span>Masuk dengan Google</span>
            </button>

            {/* Redirect ke Sign Up */}
            <p className="signin-redirect-text">
              Belum Punya Akun?{" "}
              <a
                href="/sign-up"
                onClick={(e) => handleLinkClick(e, "/sign-up")}
                className="signin-redirect-link"
              >
                Daftar Disini!
              </a>
            </p>

            {/* Kembali ke Beranda */}
            <div className="signin-back-home">
              <a
                href="/"
                onClick={(e) => handleLinkClick(e, "/")}
                className="signin-back-link"
              >
                <ArrowLeft size={14} />
                <span>Kembali ke Beranda</span>
              </a>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
