import { useState } from "react";
import "./reset-password.css";
import lockVisual from "../Assets/Picture/Frame 24 (1).png";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ResetPassword({ onNavigate }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password) {
      setErrorMsg("Silakan masukkan kata sandi baru.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal terdiri dari 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.");
      return;
    }

    setErrorMsg("");
    console.log("Password successfully updated");
    setIsSuccess(true);
  };

  const handleLinkClick = (e, path) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="reset-wrapper">
      <main className="reset-container">
        {/* Sisi Kiri: Visual Gembok 3D Biru Logam */}
        <section className="reset-left" aria-label="Visual Kata Sandi Baru">
          <div className="reset-visual-box">
            <img
              src={lockVisual}
              alt="Ilustrasi Gembok Kata Sandi Baru"
              className="reset-visual-img"
            />
          </div>
        </section>

        {/* Sisi Kanan: Formulir Pembaruan Kata Sandi */}
        <section className="reset-right" aria-label="Formulir Kata Sandi Baru">
          <h1 className="reset-title">Kata Sandi Baru</h1>
          <p className="reset-desc">
            Buat kata sandi baru yang aman tapi mudah diingat
          </p>

          {errorMsg && (
            <div className="reset-error-banner" role="alert">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Field 1: Kata Sandi */}
            <div className="reset-input-group">
              <label htmlFor="password">
                Kata Sandi<span className="required">*</span>
              </label>
              <div className="reset-password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="Masukkan kata sandi kamu disini"
                  required
                />
                <button
                  type="button"
                  className="reset-eye-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Field 2: Konfirmasi Kata Sandi */}
            <div className="reset-input-group">
              <label htmlFor="confirmPassword">
                Konfirmasi Kata Sandi<span className="required">*</span>
              </label>
              <div className="reset-password-wrap">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="Konfirmasi kata sandi kamu"
                  required
                />
                <button
                  type="button"
                  className="reset-eye-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan konfirmasi kata sandi"
                      : "Tampilkan konfirmasi kata sandi"
                  }
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Aksi: Tombol Kembali & Konfirmasi */}
            <div className="reset-actions-row">
              <button
                type="button"
                className="reset-back-btn"
                onClick={(e) => handleLinkClick(e, "/forgot-password")}
              >
                Kembali
              </button>

              <button type="submit" className="reset-submit-btn">
                Konfirmasi
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Success Modal Pop-up */}
      {isSuccess && (
        <div className="reset-modal-backdrop" role="dialog" aria-modal="true">
          <div className="reset-modal-card">
            <div className="reset-modal-icon-wrap">
              <CheckCircle2 size={42} className="reset-modal-check" />
            </div>
            <h2>Kata Sandi Berhasil Diperbarui!</h2>
            <p>
              Kata sandi akunmu telah berhasil diubah. Silakan masuk kembali menggunakan
              kata sandi yang baru.
            </p>
            <div className="reset-modal-actions">
              <button
                type="button"
                className="reset-modal-btn"
                onClick={(e) => handleLinkClick(e, "/sign-in")}
              >
                Masuk ke Akunmu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
