# AuraSync — Platform Web Pendamping "Biomark-Stress Tracker"
> **Proposal SDGs (Kesehatan Mental & Kesejahteraan - SDG 3)**  
> Dibuat untuk siswa SMK dengan arsitektur **HTML, CSS, dan JavaScript Murni (Vanilla)** tanpa build tool rumit, mudah dipahami pemula, dan siap dipresentasikan.

---

## 🌟 Tentang Proyek

**AuraSync** adalah dashboard web pendamping untuk perangkat gelang IoT cerdas **"Biomark-Stress Tracker"** yang dirancang untuk mendeteksi tanda-tanda awal *High-Functioning Anxiety* (kecemasan dengan fungsi tinggi) pada remaja dan pelajar.

### Alur Sistem IoT:
```
[Gelang Biomark (ESP32 + Pulse Sensor + GSR Sensor)]
                        │
                        ▼ (Kirim data biometrik via Wi-Fi)
       [Firebase Realtime Database]
                        │
                        ▼ (Real-time listener)
             [Platform Web AuraSync]
        ├── Dashboard "Vibe & Pulse" + Chart.js
        ├── Analisis Alami Google Gemini AI
        ├── Zero-Effort Mood Logger (Auto Pop-up)
        ├── Decompression Room (Binaural & Visual)
        ├── Weekly Bio-Insight (Story Card)
        ├── Curhat AI (Empati & Safety Guardrails)
        └── Emergency Mode (Override 2 Tombol)
```

> **Catatan Uji Coba Hardware:**  
> Karena gelang fisik ESP32 belum selesai dirakit saat pengembangan awal, sistem telah dilengkapi **ESP32 Simulator (`dummy-data-generator.js`)** yang menulis data ke Firebase dengan format persis sama. Ketika ESP32 nanti siap, ESP32 tinggal mengirim data ke node yang sama tanpa perlu mengubah 1 baris pun kode web!

---

## 📁 Struktur File & Folder

```
UIUX/
├── index.html                  # Halaman 1: Login & Registrasi
├── dashboard.html              # Halaman 2: Dashboard "Vibe & Pulse" (Utama)
├── decompression.html          # Halaman 3: Decompression Room (Terapi Instan)
├── weekly.html                 # Halaman 5: Weekly Bio-Insight (Story Cards)
├── chat.html                   # Halaman 7: Curhat Singkat AI Chatbot
│
├── css/
│   └── style.css               # Desain Calming Dark Mode, Glassmorphism, & Responsif
│
├── js/
│   ├── config.js               # ⭐ PUSAT KONFIGURASI (Firebase & Gemini API Key)
│   ├── firebase-service.js     # Inisialisasi Firebase & Mock Mode Otomatis
│   ├── dummy-data-generator.js # Simulator Sensor ESP32 (BPM & GSR)
│   ├── ai-service.js           # Pemanggilan Google Gemini API sisi client
│   ├── audio-service.js        # Generator Web Audio API (Binaural & White Noise)
│   ├── auth.js                 # Autentikasi Pengguna
│   ├── dashboard.js            # Grafik Realtime Chart.js & Status
│   ├── mood-logger.js          # Fitur 4: Pop-up Otomatis Zero-Effort Mood Logger
│   ├── decompression.js        # Kontrol Audio & Visual Grounding 4-7-8
│   ├── weekly.js               # Agregasi Data 7 Hari
│   ├── chat.js                 # Obrolan AI dengan Aturan Keselamatan
│   └── emergency-handler.js    # Fitur 6: Listener Darurat & Full Screen Override
│
└── README.md                   # Panduan ini
```

---

## 🚀 Cara Menjalankan Project Secara Lokal

Karena proyek ini menggunakan **HTML & JavaScript murni**, Anda tidak perlu menginstall `npm`, `vite`, atau bundler apapun!

### Cara 1: Menggunakan Ekstensi Live Server (Sangat Disarankan)
1. Buka folder ini di **VS Code**.
2. Install ekstensi **Live Server** (oleh Ritwick Dey) dari tab Extensions (Ctrl+Shift+X).
3. Klik kanan pada file `index.html`, lalu pilih **"Open with Live Server"**.
4. Browser akan terbuka otomatis di alamat `http://127.0.0.1:5500/index.html`.

### Cara 2: Membuka Langsung di Browser
- Klik dua kali (double click) file `index.html` pada File Explorer laptop Anda.

---

## 🔑 Mengisi Konfigurasi API (Firebase & Google Gemini)

Semua kunci hanya disimpan di **SATU FILE SAJA**, yaitu:  
📁 `js/config.js`

Buka file `js/config.js`, Anda akan menemukan bagian berikut:

```javascript
const AURASYNC_CONFIG = {
  // 1. GANTI DATA FIREBASE MILIK ANDA DI SINI
  firebase: {
    apiKey: "GANTI_DENGAN_FIREBASE_API_KEY",
    authDomain: "aurasync-biomark.firebaseapp.com",
    databaseURL: "https://aurasync-biomark-default-rtdb.firebaseio.com",
    projectId: "aurasync-biomark",
    storageBucket: "aurasync-biomark.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
  },

  // 2. GANTI KUNCI GEMINI API MILIK ANDA DI SINI
  gemini: {
    apiKey: "GANTI_DENGAN_GEMINI_API_KEY",
    model: "gemini-1.5-flash"
  }
};
```

### Langkah Mendapatkan Firebase Gratis:
1. Buka [Firebase Console](https://console.firebase.google.com/) dan login dengan akun Google.
2. Klik **Add project**, beri nama (contoh: `AuraSync-IoT`).
3. Di dashboard project, klik ikon Web (`</>`), daftarkan aplikasi, lalu salin objek `firebaseConfig` ke dalam `js/config.js`.
4. Di menu samping kiri:
   - Pilih **Build > Authentication**, klik **Get Started**, pilih metode **Email/Password**, lalu centang **Enable**.
   - Pilih **Build > Realtime Database**, klik **Create Database**, pilih lokasi default, lalu pada tab Rules atur mode baca-tulis:
     ```json
     {
       "rules": {
         ".read": true,
         ".write": true
       }
     }
     ```

### Langkah Mendapatkan Gemini API Key Gratis:
1. Buka [Google AI Studio](https://aistudio.google.com/).
2. Login dengan akun Google, klik tombol **"Get API key"**.
3. Klik **"Create API key in new project"**.
4. Salin string kunci dan tempelkan ke `gemini.apiKey` di `js/config.js`.

> **💡 Tips Presentasi:**  
> Jika belum sempat membuat akun Firebase atau kehabisan kuota Gemini, Anda tetap bisa mendemokan platform ini! Sistem otomatis mengaktifkan **Mock Mode & Smart Fallback** sehingga grafik, data lonjakan, dan chat tetap berjalan lancar tanpa pesan error merah!

---

## ⚡ Fitur Uji Coba Simulasi (IoT Tester)

Di pojok kanan bawah setiap halaman, terdapat tombol melayang **"⚡ Simulasi Gelang"**:
1. **Sensor Simulasi: Aktif/Berhenti**: Menghidupkan/mematikan simulasi pengiriman data periodik ESP32.
2. **Simulasi Lonjakan Stres**: Seketika menaikkan BPM (>105) dan GSR (>650) untuk menguji status menjadi **"Waspada"** dan memicu pop-up **Zero-Effort Mood Logger**.
3. **Pemicu Tombol Gelang Darurat**: Mensimulasikan tombol fisik darurat di gelang (`emergency.active = true`) untuk menguji **Emergency Mode** layar penuh.

---

## 🛡️ Etika & Keamanan Kesehatan Mental
Fitur AI pada AuraSync dilengkapi dengan *safety guardrails* ketat:
- AI **tidak pernah mendiagnosis** penyakit kejiwaan secara klinis.
- Mengingatkan pengguna bahwa AI adalah teman dengar dan bukan pengganti psikolog/dokter.
- Jika terdeteksi kata-kata berbahaya atau putus asa, sistem dengan lembut memandu pengguna untuk menghubungi orang terdekat atau nomor bantuan darurat.
