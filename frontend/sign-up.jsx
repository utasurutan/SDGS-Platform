import { useState } from "react";
import "./sign-up.css";
import signupPoster from "../Assets/Picture/Signup Poster.png";
import userPlusIcon from "../Assets/Icon/solar_user-plus-broken.png";
import googleIcon from "../Assets/Icon/devicon_google.png";

export default function SignUp({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

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
    // Handle signup logic
    console.log("Sign up data:", formData);
  };

  const handleLinkClick = (e, path) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <main className="signup-container">
      {/* Sisi Kiri: Poster */}
      <section className="sign-up-left">
        <div className="sign-up-poster">
          <img src={signupPoster} alt="Signup Poster" />
        </div>
      </section>

      {/* Sisi Kanan: Form */}
      <section className="sign-up-right">
        <div className="up-text">
          <img src={userPlusIcon} alt="Icon User" />
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
              Alamat email <span className="required">*</span>
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
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan kata sandi kamu disini"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">
              Konfirmasi Kata Sandi <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirm-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Konfirmasi kata sandi kamu"
              required
            />
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
              <span className="hi">
                <a href="#kebijakan" className="link-blue">
                  Ketentuan &amp; Kebijakan Privasi
                </a>
              </span>
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
            <img src={googleIcon} alt="Google Icon" />
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

          <p className="login-redirect" style={{ marginTop: "12px" }}>
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, "/")}
              className="link-blue"
            >
              &larr; Kembali ke Beranda
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}
