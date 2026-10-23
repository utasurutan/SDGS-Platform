import { useState } from "react";
import "./sign-up.css";
import signupPoster from "../Assets/Picture/Signup Poster.png";
import userPlusIcon from "../Assets/Icon/solar_user-plus-broken.png";
import googleIcon from "../Assets/Icon/devicon_google.png";
import { Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";

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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (data) => {
    const errs = {};
    if (!data.fullname.trim()) errs.fullname = "Nama lengkap wajib diisi.";
    if (!data.email.trim()) {
      errs.email = "Alamat email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = "Format email tidak valid.";
    }
    if (!data.password) {
      errs.password = "Kata sandi wajib diisi.";
    } else if (data.password.length < 8) {
      errs.password = "Kata sandi minimal 8 karakter.";
    }
    if (!data.confirmPassword) {
      errs.confirmPassword = "Konfirmasi kata sandi wajib diisi.";
    } else if (data.password !== data.confirmPassword) {
      errs.confirmPassword = "Kata sandi tidak cocok.";
    }
    if (!data.terms) errs.terms = "Kamu harus menyetujui ketentuan.";
    return errs;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const key = id === "confirm-password" ? "confirmPassword" : id;
    const newData = {
      ...formData,
      [key]: type === "checkbox" ? checked : value,
    };
    setFormData(newData);
    // Re-validate field yang sudah disentuh
    if (touched[key]) {
      const errs = validate(newData);
      setErrors((prev) => ({ ...prev, [key]: errs[key] }));
    }
  };

  const handleBlur = (e) => {
    const key = e.target.id === "confirm-password" ? "confirmPassword" : e.target.id;
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validate(formData);
    setErrors((prev) => ({ ...prev, [key]: errs[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(formData);
    setErrors(errs);
    // Mark semua field sebagai touched
    setTouched({ fullname: true, email: true, password: true, confirmPassword: true, terms: true });
    if (Object.keys(errs).length > 0) return;
    console.log("Sign up data:", formData);
    if (onNavigate) onNavigate("/connect-device");
  };

  const handleLinkClick = (e, path) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const inputClass = (key) => {
    if (!touched[key]) return "";
    return errors[key] ? "input-error" : "input-success";
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

          <form onSubmit={handleSubmit} noValidate>
            {/* Nama Lengkap */}
            <div className="input-group">
              <label htmlFor="fullname">
                Nama Lengkap <span className="required">*</span>
              </label>
              <input
                type="text"
                id="fullname"
                value={formData.fullname}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan nama lengkap anda"
                className={inputClass("fullname")}
              />
              {touched.fullname && errors.fullname && (
                <span className="field-error">
                  <AlertCircle size={13} />
                  {errors.fullname}
                </span>
              )}
            </div>

            {/* Alamat Email */}
            <div className="input-group">
              <label htmlFor="email">
                Alamat Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan alamat email kamu disini"
                className={inputClass("email")}
              />
              {touched.email && errors.email && (
                <span className="field-error">
                  <AlertCircle size={13} />
                  {errors.email}
                </span>
              )}
            </div>

            {/* Kata Sandi */}
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
                  onBlur={handleBlur}
                  placeholder="Minimal 8 karakter"
                  className={inputClass("password")}
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
              {touched.password && errors.password && (
                <span className="field-error">
                  <AlertCircle size={13} />
                  {errors.password}
                </span>
              )}
            </div>

            {/* Konfirmasi Kata Sandi */}
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
                  onBlur={handleBlur}
                  placeholder="Ulangi kata sandi kamu"
                  className={inputClass("confirmPassword")}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Sembunyikan" : "Tampilkan"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="field-error">
                  <AlertCircle size={13} />
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Checkbox Terms */}
            <div className={`checkbox-group${touched.terms && errors.terms ? " checkbox-error" : ""}`}>
              <input
                type="checkbox"
                id="terms"
                checked={formData.terms}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label htmlFor="terms">
                Saya setuju dengan{" "}
                <a href="#kebijakan" className="link-blue">
                  Ketentuan &amp; Kebijakan Privasi
                </a>
              </label>
            </div>
            {touched.terms && errors.terms && (
              <span className="field-error field-error-terms">
                <AlertCircle size={13} />
                {errors.terms}
              </span>
            )}

            {/* Tombol Daftar */}
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
              <a
                href="/sign-in"
                onClick={(e) => handleLinkClick(e, "/sign-in")}
                className="link-blue"
              >
                Masuk di sini
              </a>
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
