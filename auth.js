/**
 * ==============================================================================
 * AuraSync - Autentikasi Pengguna (auth.js)
 * ==============================================================================
 * Menangani Login, Pendaftaran Akun, dan Logout menggunakan Firebase Auth.
 * Menghubungkan user dengan profil spesifik di node users/{userId}/profile.
 */

document.addEventListener("DOMContentLoaded", () => {
  const auth = window.AuraSyncAuth;
  const db = window.AuraSyncDB;

  // Elemen DOM
  const formLogin = document.getElementById("formLogin");
  const formRegister = document.getElementById("formRegister");
  const linkToRegister = document.getElementById("linkToRegister");
  const linkToLogin = document.getElementById("linkToLogin");
  const loginSection = document.getElementById("loginSection");
  const registerSection = document.getElementById("registerSection");
  const authErrorMsg = document.getElementById("authErrorMsg");

  // Alihkan form antara Login dan Register
  if (linkToRegister && linkToLogin) {
    linkToRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginSection.style.display = "none";
      registerSection.style.display = "block";
      clearError();
    });

    linkToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      registerSection.style.display = "none";
      loginSection.style.display = "block";
      clearError();
    });
  }

  function showError(msg) {
    if (authErrorMsg) {
      authErrorMsg.innerText = msg;
      authErrorMsg.style.display = "block";
    } else {
      alert(msg);
    }
  }

  function clearError() {
    if (authErrorMsg) {
      authErrorMsg.innerText = "";
      authErrorMsg.style.display = "none";
    }
  }

  // 1. PROSES LOGIN
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearError();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const submitBtn = formLogin.querySelector("button[type='submit']");

      if (!email || !password) {
        showError("Harap isi email dan kata sandi.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerText = "Memverifikasi...";

      try {
        await auth.signInWithEmailAndPassword(email, password);
        console.log("✅ Berhasil login!");
        window.location.href = "dashboard.html";
      } catch (err) {
        console.error("Gagal login:", err);
        showError("Email atau kata sandi tidak cocok. Silakan coba lagi.");
        submitBtn.disabled = false;
        submitBtn.innerText = "Masuk";
      }
    });
  }

  // 2. PROSES DAFTAR (REGISTRASI)
  if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearError();

      const nama = document.getElementById("regNama").value.trim();
      const umur = parseInt(document.getElementById("regUmur").value) || 17;
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value;
      const submitBtn = formRegister.querySelector("button[type='submit']");

      if (!nama || !email || !password) {
        showError("Semua kolom registrasi wajib diisi.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerText = "Membuat Akun...";

      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const userId = userCredential.user.uid;

        // Simpan data profil ke Firebase Realtime Database
        // users/{userId}/profile: { nama, umur, kontak_darurat }
        if (db) {
          await db.ref(`users/${userId}/profile`).set({
            nama: nama,
            umur: umur,
            kontak_darurat: "+6281234567890",
            nama_kontak: "Orang Tua / Wali"
          });
        }

        console.log("✅ Berhasil membuat akun!");
        window.location.href = "dashboard.html";
      } catch (err) {
        console.error("Gagal register:", err);
        showError(err.message || "Gagal mendaftar. Pastikan email valid dan password minimal 6 karakter.");
        submitBtn.disabled = false;
        submitBtn.innerText = "Daftar Sekarang";
      }
    });
  }

  // Pengecekan otomatis: Jika sudah login, langsung ke dashboard
  if (auth && auth.onAuthStateChanged) {
    auth.onAuthStateChanged((user) => {
      if (user && window.location.pathname.endsWith("index.html")) {
        // Opsional: aktifkan redirect jika ingin langsung masuk
      }
    });
  }
});
