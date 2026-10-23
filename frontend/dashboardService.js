/**
 * Dashboard Data Service - AuraSync IoT SDGs Platform
 * 
 * Modul ini menjadi jembatan antara tampilan Dashboard dengan sumber data.
 * Saat ini menggunakan data mock reaktif & LocalStorage.
 * 
 * Nanti saat Firebase terhubung:
 * Cukup ganti implementasi di dalam subscribeToDashboardData()
 * dengan Firebase Realtime Database (onValue) atau Cloud Firestore (onSnapshot).
 */

// Data default awal sesuai mockup Figma AuraSync
export const DEFAULT_DASHBOARD_DATA = {
  // 3 Box Atas
  bpm: 72,
  bpmChange: "-2.1% mulai rendah",
  hrv: 68,
  hrvStatus: "Aktivitas saraf parasimpatis dominan",
  stressScore: 32,
  stressChange: "+3.2% Pemulihan",

  // IoT Smart Watch Band
  device: {
    name: "D18 Smart Watch Band Active",
    signal: "-42 dBm (Sangat Baik)",
    status: "Terhubung Stabil",
    battery: 97,
    activeMode: "fokus", // 'fokus' | 'relaksasi' | 'tidur'
  },

  // Chart Korelasi Indeks Stres & Detak Nadi
  // Jam: 06:00, 08:00, 10:00, 12:00, 13:00, 14:00, 16:00, 18:00, 20:00, 22:00
  chartData: {
    labels: ["06:00", "08:00", "10:00", "12:00", "13:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
    stressIndex: [35, 45, 43, 62, 48, 58, 77, 65, 72, 60, 78, 62, 75],
    heartRate:   [22, 38, 30, 42, 32, 40, 52, 45, 60, 68, 55, 62, 72],
    peakPoint: {
      time: "13:00",
      stressValue: 77,
      heartRateValue: 52,
      label: "Puncak Stres: 77/100",
      sublabel: "Jam 13:00 (Selesai Ujian)",
    },
    note: "Stres turun drastis -42% setelah latihan pernafasan",
  },

  // Penyebab Stres
  causes: [
    { label: "Overthinking Akademik", percentage: 53, color: "#293F6C" },
    { label: "Kelelahan Fisik & Kurang Tidur", percentage: 41, color: "#1E6AFF" },
    { label: "Kecemasan Emosional", percentage: 26, color: "#3B82F6" },
    { label: "Faktor Lingkungan", percentage: 12, color: "#60A5FA" },
  ],
};

/**
 * Mengambil data dashboard untuk user tertentu
 */
export function getDashboardData(userEmail) {
  try {
    const key = userEmail ? `aurasync_dashboard_${userEmail}` : "aurasync_dashboard_default";
    const saved = localStorage.getItem(key);
    if (saved) {
      return { ...DEFAULT_DASHBOARD_DATA, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.warn("Gagal membaca dashboard data dari localStorage:", err);
  }
  return DEFAULT_DASHBOARD_DATA;
}

/**
 * Menyimpan pembaruan data dashboard
 */
export function saveDashboardData(userEmail, newData) {
  try {
    const key = userEmail ? `aurasync_dashboard_${userEmail}` : "aurasync_dashboard_default";
    localStorage.setItem(key, JSON.stringify(newData));
  } catch (err) {
    console.warn("Gagal menyimpan dashboard data ke localStorage:", err);
  }
}

/**
 * Listener data real-time.
 * Ketika Firebase aktif, fungsi ini tinggal disubscribe ke Firebase listener:
 * 
 * Contoh integrasi Firebase nanti:
 *   import { doc, onSnapshot } from 'firebase/firestore';
 *   import { db } from '../src/firebase';
 *   return onSnapshot(doc(db, "biomark_data", userId), (doc) => {
 *     callback(doc.data());
 *   });
 */
export function subscribeToDashboardData(userEmail, callback) {
  // Kirim data awal segera
  const initialData = getDashboardData(userEmail);
  callback(initialData);

  // Simulasi heartbeat real-time kecil (fluktuasi detak jantung realistis +- 1 bpm)
  const interval = setInterval(() => {
    callback((prev) => {
      const current = prev || initialData;
      const bpmJitter = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
      const newBpm = Math.min(85, Math.max(65, current.bpm + bpmJitter));
      return {
        ...current,
        bpm: newBpm,
      };
    });
  }, 4000);

  // Return function untuk unsubscribe / cleanup
  return () => clearInterval(interval);
}
