import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

export function useGoogleAuth({ onNavigate }) {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const clientId = rawClientId.trim().replace(/\/$/, "");

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setAuthError(null);
        // Ambil data profil dari Google OAuth UserInfo endpoint
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        if (!res.ok) throw new Error("Gagal mengambil data akun Google");
        const profile = await res.json();

        // Simpan sesi user di localStorage
        const userData = {
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          loginMethod: "google",
          loggedInAt: new Date().toISOString(),
        };
        localStorage.setItem("aurasync_user", JSON.stringify(userData));

        if (onNavigate) {
          onNavigate("/connect-device");
        }
      } catch (err) {
        console.error("Google userinfo error:", err);
        setAuthError(err.message || "Gagal memproses data akun Google");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      setIsLoading(false);
      setAuthError("Gagal menghubungkan ke akun Google.");
    },
  });

  const handleGoogleClick = () => {
    if (!clientId || clientId === "temp-client-id" || clientId.trim() === "") {
      const confirmDemo = window.confirm(
        "Google Client ID belum diatur di file .env.\n\n" +
        "Untuk menghubungkan ke akun Google asli, isi VITE_GOOGLE_CLIENT_ID di file .env dengan Client ID dari Google Cloud Console.\n\n" +
        "Apakah kamu ingin masuk menggunakan Mode Uji Coba (Demo Akun Google) sekarang?"
      );
      if (confirmDemo) {
        localStorage.setItem(
          "aurasync_user",
          JSON.stringify({
            name: "Siswa AuraSync (Demo)",
            email: "demo.student@aurasync.id",
            loginMethod: "google-demo",
            loggedInAt: new Date().toISOString(),
          })
        );
        if (onNavigate) onNavigate("/connect-device");
      }
      return;
    }

    try {
      setIsLoading(true);
      triggerGoogleLogin();
    } catch (err) {
      console.error("Trigger Google Login error:", err);
      setIsLoading(false);
    }
  };

  return {
    handleGoogleClick,
    isLoading,
    authError,
  };
}
