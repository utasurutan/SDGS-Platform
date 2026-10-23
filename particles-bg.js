/**
 * ==============================================================================
 * AuraSync - Interactive Particle Background (particles-bg.js)
 * ==============================================================================
 * Canvas-based animated particles yang melayang perlahan dengan efek:
 * - Floating particles dengan glow teal/blue
 * - Mouse interaction (partikel bereaksi terhadap gerakan mouse)
 * - Connection lines (garis constellation antar partikel berdekatan)
 * - Gradient pulse (breathing effect pada background)
 * - Performance optimized dengan requestAnimationFrame
 */

(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -9999, y: -9999, radius: 150 };
  let animationId;
  let gradientAngle = 0;

  // Konfigurasi partikel
  const CONFIG = {
    particleDensity: 0.00008, // partikel per px² (agar tidak terlalu banyak)
    minParticles: 30,
    maxParticles: 120,
    minRadius: 1,
    maxRadius: 3,
    minSpeed: 0.15,
    maxSpeed: 0.6,
    connectionDistance: 140,
    mouseRepelForce: 0.04,
    mouseAttractForce: 0.008,
    colors: [
      'rgba(20, 184, 166,',   // teal
      'rgba(45, 212, 191,',   // teal-light
      'rgba(56, 189, 248,',   // sky-blue
      'rgba(99, 102, 241,',   // indigo
      'rgba(139, 92, 246,',   // violet
    ]
  };

  // Resize handler
  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseRadius = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
      this.radius = this.baseRadius;
      this.vx = (Math.random() - 0.5) * CONFIG.maxSpeed;
      this.vy = (Math.random() - 0.5) * CONFIG.maxSpeed;
      this.colorBase = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.opacity = 0.2 + Math.random() * 0.5;
      this.targetOpacity = this.opacity;
      this.pulseSpeed = 0.005 + Math.random() * 0.015;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.life = 0;
    }

    update() {
      this.life += this.pulseSpeed;

      // Pulsating opacity
      this.opacity = this.targetOpacity + Math.sin(this.life + this.pulsePhase) * 0.15;

      // Mouse interaction
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        // Repel dari mouse (efek "gelombang")
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force * CONFIG.mouseRepelForce;
        this.vy += Math.sin(angle) * force * CONFIG.mouseRepelForce;

        // Glow up saat dekat mouse
        this.radius = this.baseRadius + force * 2;
        this.opacity = Math.min(this.opacity + force * 0.3, 0.9);
      } else {
        // Kembali ke ukuran normal secara perlahan
        this.radius += (this.baseRadius - this.radius) * 0.05;
      }

      // Pergerakan
      this.x += this.vx;
      this.y += this.vy;

      // Friction halus
      this.vx *= 0.998;
      this.vy *= 0.998;

      // Re-add minimal speed agar terus bergerak
      if (Math.abs(this.vx) < CONFIG.minSpeed * 0.5) {
        this.vx += (Math.random() - 0.5) * CONFIG.minSpeed;
      }
      if (Math.abs(this.vy) < CONFIG.minSpeed * 0.5) {
        this.vy += (Math.random() - 0.5) * CONFIG.minSpeed;
      }

      // Wrap around edges
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;
    }

    draw() {
      // Glow effect
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius * 4
      );
      gradient.addColorStop(0, this.colorBase + (this.opacity * 0.8) + ')');
      gradient.addColorStop(0.4, this.colorBase + (this.opacity * 0.3) + ')');
      gradient.addColorStop(1, this.colorBase + '0)');

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.colorBase + this.opacity + ')';
      ctx.fill();
    }
  }

  // Inisialisasi partikel
  function initParticles() {
    const area = width * height;
    let count = Math.floor(area * CONFIG.particleDensity);
    count = Math.max(CONFIG.minParticles, Math.min(count, CONFIG.maxParticles));

    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  // Gambar garis koneksi antar partikel berdekatan
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionDistance) {
          const opacity = (1 - dist / CONFIG.connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(45, 212, 191, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Animated gradient background (breathing effect)
  function drawGradientBackground() {
    gradientAngle += 0.002;

    const cx1 = width * (0.2 + Math.sin(gradientAngle) * 0.15);
    const cy1 = height * (0.2 + Math.cos(gradientAngle * 0.7) * 0.15);
    const cx2 = width * (0.8 + Math.sin(gradientAngle * 1.3) * 0.15);
    const cy2 = height * (0.8 + Math.cos(gradientAngle * 0.9) * 0.15);

    // Gradient orb 1 (teal)
    const grad1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, width * 0.5);
    grad1.addColorStop(0, 'rgba(20, 184, 166, 0.06)');
    grad1.addColorStop(1, 'rgba(20, 184, 166, 0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);

    // Gradient orb 2 (blue)
    const grad2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, width * 0.45);
    grad2.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
    grad2.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);

    // Gradient orb 3 (violet — subtle)
    const cx3 = width * (0.5 + Math.sin(gradientAngle * 0.5) * 0.3);
    const cy3 = height * (0.5 + Math.cos(gradientAngle * 0.6) * 0.3);
    const grad3 = ctx.createRadialGradient(cx3, cy3, 0, cx3, cy3, width * 0.35);
    grad3.addColorStop(0, 'rgba(139, 92, 246, 0.03)');
    grad3.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = grad3;
    ctx.fillRect(0, 0, width, height);
  }

  // Main animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Background gradient pulse
    drawGradientBackground();

    // Update dan draw partikel
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Connection lines
    drawConnections();

    animationId = requestAnimationFrame(animate);
  }

  // Mouse events
  function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function handleMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  // Touch support
  function handleTouchMove(e) {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }

  function handleTouchEnd() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  // Initialize
  function init() {
    resizeCanvas();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationId);
      resizeCanvas();
      animate();
    });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    animate();
  }

  // Visibility API — pause saat tab tidak aktif
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
