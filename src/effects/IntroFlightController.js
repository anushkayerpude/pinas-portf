import { soundFx } from './SoundFx.js';

/**
 * Cinematic Realistic F-22 Raptor Intro Flight & Nuking Engine
 * Animates the realistic F-22 flying from Top-Right diagonally across the entire screen
 * to Bottom-Left, emitting afterburners, dropping tactical nuclear strikes with sound/shockwaves,
 * and then revealing the 3D Asia Globe.
 */

export class IntroFlightController {
  constructor(canvas, onFlightComplete, onNukeDrop) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onFlightComplete = onFlightComplete;
    this.onNukeDrop = onNukeDrop;

    this.isPlaying = false;
    this.progress = 0;
    this.duration = 3.4; // 3.4 seconds flyby
    this.particles = [];
    this.nukesDetonated = new Set();

    this.jetImg = new Image();
    this.jetImg.src = '/assets/f22_realistic.png';

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  start() {
    this.isPlaying = true;
    this.progress = 0;
    this.particles = [];
    this.nukesDetonated.clear();
    this.startTime = performance.now();

    // Start jet engine roar sound
    soundFx.playJetFlyby();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  animate(now) {
    if (!this.isPlaying) return;

    const elapsed = (now - this.startTime) / 1000;
    this.progress = Math.min(1.0, elapsed / this.duration);

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Easing curve (accelerating supersonic sweep)
    const t = this.progress;
    // Cubic bezier style ease in out
    const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // Trajectory: From Top-Right (x: 1.15, y: -0.15) to Bottom-Left (x: -0.2, y: 1.2)
    const startX = this.width * 1.15;
    const startY = -this.height * 0.15;
    const endX = -this.width * 0.25;
    const endY = this.height * 1.25;

    const jetX = startX + (endX - startX) * easeT;
    const jetY = startY + (endY - startY) * easeT;

    // Scale increases as jet sweeps closer to camera
    const scale = 0.35 + Math.sin(t * Math.PI) * 0.55;

    // Nuking check points along flight path (at 22%, 48%, 72%)
    const nukeCheckpoints = [
      { p: 0.22, x: this.width * 0.75, y: this.height * 0.28 },
      { p: 0.48, x: this.width * 0.50, y: this.height * 0.52 },
      { p: 0.72, x: this.width * 0.26, y: this.height * 0.78 }
    ];

    nukeCheckpoints.forEach((checkpoint, index) => {
      if (t >= checkpoint.p && !this.nukesDetonated.has(index)) {
        this.nukesDetonated.add(index);
        if (this.onNukeDrop) {
          this.onNukeDrop(checkpoint.x, checkpoint.y);
        }
      }
    });

    // Draw Jet Afterburners & Wake Trail
    this.emitAfterburners(jetX, jetY, scale);
    this.drawParticles();

    // Draw Realistic F-22 Raptor Jet
    this.drawRealisticF22(jetX, jetY, scale);

    if (this.progress < 1.0) {
      requestAnimationFrame(this.animate);
    } else {
      this.isPlaying = false;
      this.ctx.clearRect(0, 0, this.width, this.height);
      if (this.onFlightComplete) {
        this.onFlightComplete();
      }
    }
  }

  emitAfterburners(jetX, jetY, scale) {
    // Twin engine exhaust positions offset backwards from jet center
    // Nose is pointing towards bottom-left (angle ~218 deg), so exhaust is at top-right
    const angle = Math.atan2(this.height * 1.4, -this.width * 1.4); // Flight angle
    const exhaustAngle = angle + Math.PI; // Backwards

    const exhaustDist = 80 * scale;
    const spreadOffset = 18 * scale;

    const baseExhaustX = jetX - Math.cos(angle) * exhaustDist;
    const baseExhaustY = jetY - Math.sin(angle) * exhaustDist;

    // Perpendicular vector for twin nozzles
    const perpAngle = angle + Math.PI / 2;
    const leftNozzleX = baseExhaustX + Math.cos(perpAngle) * spreadOffset;
    const leftNozzleY = baseExhaustY + Math.sin(perpAngle) * spreadOffset;
    const rightNozzleX = baseExhaustX - Math.cos(perpAngle) * spreadOffset;
    const rightNozzleY = baseExhaustY - Math.sin(perpAngle) * spreadOffset;

    for (let i = 0; i < 4; i++) {
      const speed = 4 + Math.random() * 8;
      const spread = (Math.random() - 0.5) * 0.4;
      const pAngle = exhaustAngle + spread;

      const col = Math.random() > 0.4 ? '#B2094D' : (Math.random() > 0.5 ? '#EDDBD8' : '#771450');

      this.particles.push({
        x: leftNozzleX,
        y: leftNozzleY,
        vx: Math.cos(pAngle) * speed,
        vy: Math.sin(pAngle) * speed,
        size: (6 + Math.random() * 8) * scale,
        life: 25,
        maxLife: 25,
        color: col
      });

      this.particles.push({
        x: rightNozzleX,
        y: rightNozzleY,
        vx: Math.cos(pAngle) * speed,
        vy: Math.sin(pAngle) * speed,
        size: (6 + Math.random() * 8) * scale,
        life: 25,
        maxLife: 25,
        color: col
      });
    }
  }

  drawParticles() {
    const ctx = this.ctx;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      const prog = p.life / p.maxLife;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = prog * 0.85;
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#B2094D';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * prog, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawRealisticF22(x, y, scale) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // Draw glowing supersonic shockwave cone around the jet
    ctx.strokeStyle = 'rgba(212, 180, 189, 0.4)';
    ctx.lineWidth = 2 * scale;
    ctx.shadowColor = '#B2094D';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(0, 0, 120 * scale, 0.2, 1.8);
    ctx.stroke();

    // Render high-res realistic F-22 image
    if (this.jetImg.complete && this.jetImg.naturalWidth > 0) {
      const w = this.jetImg.naturalWidth * scale * 0.55;
      const h = this.jetImg.naturalHeight * scale * 0.55;
      ctx.drawImage(this.jetImg, -w / 2, -h / 2, w, h);
    }

    ctx.restore();
  }
}
