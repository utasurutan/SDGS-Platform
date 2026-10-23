/**
 * ==============================================================================
 * AuraSync - Audio Service (audio-service.js)
 * ==============================================================================
 * Menggunakan Web Audio API bawaan browser untuk menghasilkan suara relaksasi:
 * 1. Binaural Beats: Nada stereo frekuensi ganda (200Hz kiri, 210Hz kanan -> gelombang Alpha 10Hz)
 * 2. White Noise: Derau putih lembut yang disaring (low-pass filter) seperti desau angin/ombak
 * Bebas hak cipta (royalty-free), tanpa perlu download MP3 eksternal!
 */

const AuraSyncAudio = {
  audioCtx: null,
  activeType: null,
  isPlaying: false,
  volumeNode: null,
  currentVolume: 0.5,

  // Node khusus
  oscLeft: null,
  oscRight: null,
  noiseNode: null,

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.volumeNode = this.audioCtx.createGain();
      this.volumeNode.gain.setValueAtTime(this.currentVolume, this.audioCtx.currentTime);
      this.volumeNode.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  },

  setVolume(val) {
    this.currentVolume = Math.max(0, Math.min(1, val));
    if (this.volumeNode && this.audioCtx) {
      this.volumeNode.gain.setValueAtTime(this.currentVolume, this.audioCtx.currentTime);
    }
  },

  // 1. BINAURAL BEATS (Alfa Waves ~10 Hz Beat)
  startBinauralBeats() {
    this.stopAll();
    this.initContext();

    // Buat stereo merger
    const merger = this.audioCtx.createChannelMerger(2);

    // Saluran Telinga Kiri: 200 Hz
    this.oscLeft = this.audioCtx.createOscillator();
    this.oscLeft.type = "sine";
    this.oscLeft.frequency.setValueAtTime(200, this.audioCtx.currentTime);

    // Saluran Telinga Kanan: 210 Hz (Selisih 10 Hz adalah gelombang Alpha relaksasi)
    this.oscRight = this.audioCtx.createOscillator();
    this.oscRight.type = "sine";
    this.oscRight.frequency.setValueAtTime(210, this.audioCtx.currentTime);

    // Hubungkan ke merger
    this.oscLeft.connect(merger, 0, 0);  // Output kiri
    this.oscRight.connect(merger, 0, 1); // Output kanan

    // Hubungkan ke pengatur volume
    merger.connect(this.volumeNode);

    this.oscLeft.start();
    this.oscRight.start();

    this.isPlaying = true;
    this.activeType = "binaural";
  },

  // 2. WHITE / PINK NOISE (Disaring lembut)
  startWhiteNoise() {
    this.stopAll();
    this.initContext();

    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Hasilkan white noise dengan pelembutan pink noise
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2 + white * 0.1) * 0.11; // Volume aman
    }

    const whiteNoiseSource = this.audioCtx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    // Filter low-pass agar terdengar seperti deru ombak/angin malam yang tenang
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);

    whiteNoiseSource.connect(filter);
    filter.connect(this.volumeNode);

    whiteNoiseSource.start();
    this.noiseNode = whiteNoiseSource;

    this.isPlaying = true;
    this.activeType = "whitenoise";
  },

  stopAll() {
    try {
      if (this.oscLeft) {
        this.oscLeft.stop();
        this.oscLeft.disconnect();
        this.oscLeft = null;
      }
      if (this.oscRight) {
        this.oscRight.stop();
        this.oscRight.disconnect();
        this.oscRight = null;
      }
      if (this.noiseNode) {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
    } catch (e) {
      // Abaikan jika sudah dihentikan
    }
    this.isPlaying = false;
    this.activeType = null;
  }
};

window.AuraSyncAudio = AuraSyncAudio;
