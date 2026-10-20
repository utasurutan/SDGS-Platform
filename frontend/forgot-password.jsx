import { useState } from "react";
import "./forgot-password.css";
import padlockVisual from "../Assets/Picture/Frame 24.png";
import { CheckCircle2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Silakan masukkan alamat email yang valid.");
      return;
    }
    setErrorMsg("");
    console.log("Reset password requested for email:", email);
    // Navigate to the Kata Sandi Baru page
    if (onNavigate) {
      onNavigate("/reset-password");
    }
  };

  const handleLinkClick = (e, path) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="forgot-wrapper">
      <main className="forgot-container">
        {/* Sisi Kiri: Visual Gembok 3D */}
        <section className="forgot-left" aria-label="Visual Lupa Kata Sandi">
          <div className="forgot-visual-box">
            <img
              src={padlockVisual}
              alt="Ilustrasi Keamanan Kata Sandi"
              className="forgot-visual-img"
            />
          </div>
        </section>

        {/* Sisi Kanan: Formulir Reset Password */}
        <section className="forgot-right" aria-label="Formulir Lupa Kata Sandi">
          <h1 className="forgot-title">Lupa Kata Sandi?</h1>
          <p className="forgot-desc">
            Jangan khawatir  kami akan membantu reset password  kamu dan
            <br />
            Kami ingin kamu masukkan email sesuai yang kamu isi
          </p>

          {errorMsg && (
            <div className="forgot-error-banner" role="alert">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="forgot-input-wrap">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder="Email Kamu"
                autoComplete="email"
                required
              />
            </div>

            {/* Aksi: Tombol Kembali & Reset Sandi */}
            <div className="forgot-actions-row">
              <button
                type="button"
                className="forgot-back-btn"
                onClick={(e) => handleLinkClick(e, "/sign-in")}
              >
                Kembali
              </button>

              <button type="submit" className="forgot-submit-btn">
                Reset Sandi
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Success Modal Pop-up */}
      {isSuccess && (
        <div className="forgot-modal-backdrop" role="dialog" aria-modal="true">
          <div className="forgot-modal-card">
            <div className="forgot-modal-icon-wrap">
              <CheckCircle2 size={42} className="forgot-modal-check" />
            </div>
            <h2>Tautan Terkirim!</h2>
            <p>
              Kami telah mengirimkan instruksi pemulihan kata sandi ke{" "}
              <strong>{email}</strong>. Silakan periksa kotak masuk atau folder spam kamu.
            </p>
            <div className="forgot-modal-actions">
              <button
                type="button"
                className="forgot-modal-btn"
                onClick={(e) => handleLinkClick(e, "/sign-in")}
              >
                Kembali ke Halaman Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
