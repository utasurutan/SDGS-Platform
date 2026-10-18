import { useState } from "react";
import "./sign-up.css";
import signupPoster from "../Assets/Picture/Signup Poster.png";
import userPlusIcon from "../Assets/Icon/solar_user-plus-broken.png";
import googleIcon from "../Assets/Icon/devicon_google.png";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function SignUp({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "confirm-password" ? "confirmPassword" : id]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign up data:", formData);
  };

  const handleLinkClick = (e, path) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <div className="signup-wrapper">
      <main className="signup-container">
        {/* Sisi Kiri: Poster */}
        <section className="sign-up-left" aria-label="Visual Poster">
          <div className="sign-up-poster">
            <img src={signupPoster} alt="Visual pendukung perjalanan ketenangan pikiran" />
          </div>
        </section>

        {/* Sisi Kanan: Form */}
        <section className="sign-up-right" aria-label="Formulir Pendaftaran">
          <div className="up-text">
            <img src={userPlusIcon} alt="" aria-hidden="true" className="up-icon" />
            <div className="header-content">
              <h1>Mulai Perjalananmu</h1>
              <p>Buat akun untuk mulai memahami dan mengelola kecemasanmu.</p>
            </div>
          </div>

          {/* Formulir Input */}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="fullname">
                Nama Lengkap <span className="required">*</span>
              </label>
              <input
                type="text"
                id="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap anda"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">
                Alamat Email <span className="required">*</span>
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

            <div className="input-group">
              <label htmlFor="password">
                Kata Sandi <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
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
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirm-password">
                Konfirmasi Kata Sandi <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Konfirmasi kata sandi kamu"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                checked={formData.terms}
                onChange={handleChange}
                required
              />
              <label htmlFor="terms">
                Saya setuju dengan{" "}
                <a href="#kebijakan" className="link-blue">
                  Ketentuan &amp; Kebijakan Privasi
                </a>
              </label>
            </div>

            {/* Tombol & Aksi */}
            <button type="submit" className="btn-daftar">
              Daftar
            </button>

            <div className="divider">
              <span>Atau</span>
            </div>

            <button type="button" className="btn-google">
              <img src={googleIcon} alt="" aria-hidden="true" />
              <span>Masuk dengan Google</span>
            </button>

            <p className="login-redirect">
              Sudah memiliki akun?{" "}
              <span className="highlight">
                <a
                  href="/sign-in"
                  onClick={(e) => handleLinkClick(e, "/sign-in")}
                  className="link-blue"
                >
                  Masuk di sini
                </a>
              </span>
            </p>

            <div className="back-home">
              <a
                href="/"
                onClick={(e) => handleLinkClick(e, "/")}
                className="back-home-link"
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
