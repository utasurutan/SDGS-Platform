import { useState } from "react";
import "./sign-up.css";
import signupPoster from "../Assets/Picture/Signup Poster.png";
import userPlusIcon from "../Assets/Icon/solar_user-plus-broken.png";
import googleIcon from "../Assets/Icon/devicon_google.png";

export default function SignIn({ onNavigate }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
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
    <main className="signup-container">
      {/* Sisi Kiri: Poster */}
      <section className="sign-up-left">
        <div className="sign-up-poster">
          <img src={signupPoster} alt="Sign In Poster" />
        </div>
      </section>

      {/* Sisi Kanan: Form */}
      <section className="sign-up-right">
        <div className="up-text">
          <img src={userPlusIcon} alt="Icon User" />
          <div className="header-content">
            <h1>Selamat Datang Kembali</h1>
            <p>Masuk ke akunmu untuk melanjutkan perjalanan ketenanganmu.</p>
          </div>
        </div>

        {/* Formulir Input */}
        <form onSubmit={handleSubmit}>
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <label htmlFor="password" style={{ marginBottom: 0 }}>
                Kata Sandi <span className="required">*</span>
              </label>
              <a href="#lupa-sandi" className="link-blue" style={{ fontSize: "12px" }}>
                Lupa kata sandi?
              </a>
            </div>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan kata sandi kamu disini"
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <label htmlFor="remember">Ingat saya di perangkat ini</label>
          </div>

          {/* Tombol & Aksi */}
          <button type="submit" className="btn-daftar">
            Masuk
          </button>

          <div className="divider">
            <span>Atau</span>
          </div>

          <button type="button" className="btn-google">
            <img src={googleIcon} alt="Google Icon" />
            <span>Masuk dengan Google</span>
          </button>

          <p className="login-redirect">
            Belum memiliki akun?{" "}
            <span className="highlight">
              <a
                href="/sign-up"
                onClick={(e) => handleLinkClick(e, "/sign-up")}
                className="link-blue"
              >
                Daftar sekarang
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
