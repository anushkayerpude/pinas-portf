import { soundFx } from './SoundFx.js';

/**
 * Nuclear Detonation Effect Engine
 * Triggers thermal white flash, screen shake, expanding shockwave rings,
 * mushroom cloud fireball particles, and heavy sub-bass explosion audio on click.
 */

export class NukeDetonation {
  constructor() {
    this.explosions = [];
    this.init();
  }

  init() {
    // Overlay canvas for shockwaves & explosion particles
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'nuke-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99990';
    document.body.appendChild(this.canvas);

    // Thermal flash div
    this.flashEl = document.createElement('div');
    this.flashEl.className = 'nuke-thermal-flash';
    document.body.appendChild(this.flashEl);

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());

    // Trigger nuclear explosion on click anywhere
    window.addEventListener('pointerdown', (e) => {
      // Ignore if clicking sound mute button to avoid sound loop before unmuting
      if (e.target.closest('#sound-toggle-btn')) {
        return;
      }
      this.detonate(e.clientX, e.clientY);
    });

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  detonate(x, y) {
    // 1. Play procedural nuclear explosion sub-bass and sonic boom
    soundFx.playNukeDetonation();

    // 2. Thermal flash pulse
    this.triggerFlash();

    // 3. Screen shake
    this.triggerScreenShake();

    // 4. Spawn explosion entity with shockwaves and particle cloud
    const explosion = {
      x,
      y,
      age: 0,
      maxAge: 75,
      shockwaves: [
        { radius: 0, maxRadius: 280, speed: 14, width: 8, color: '#ffffff' },
        { radius: 0, maxRadius: 360, speed: 10, width: 14, color: '#ff007f' },
        { radius: 0, maxRadius: 440, speed: 7, width: 6, color: '#00f0ff' }
      ],
      fireball: {
        radius: 4,
        maxRadius: 65,
        alpha: 1.0
      },
      particles: []
    };

    // Create radial fireball embers and rising mushroom cloud billows
    const particleCount = 65;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 9;
      const isMushroomCap = Math.random() > 0.4;
      const life = 35 + Math.random() * 40;

      explosion.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        // Mushroom billow bias upward
        vy: Math.sin(angle) * speed - (isMushroomCap ? (2 + Math.random() * 3) : 0),
        size: 5 + Math.random() * 9,
        growth: 0.35 + Math.random() * 0.4,
        life: life,
        maxLife: life,
        type: isMushroomCap ? 'cloud' : 'spark',
        color: this.getRandomExplosionColor()
      });
    }

    this.explosions.push(explosion);
  }

  getRandomExplosionColor() {
    const palette = ['#ffffff', '#fff275', '#ff9f1c', '#ff007f', '#ff2a8d', '#e0115f', '#8338ec'];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  triggerFlash() {
    this.flashEl.classList.remove('active');
    void this.flashEl.offsetWidth; // Trigger DOM reflow
    this.flashEl.classList.add('active');
  }

  triggerScreenShake() {
    const appEl = document.getElementById('app') || document.body;
    appEl.classList.remove('screen-shake');
    void appEl.offsetWidth;
    appEl.classList.add('screen-shake');

    setTimeout(() => {
      appEl.classList.remove('screen-shake');
    }, 450);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let eIdx = this.explosions.length - 1; eIdx >= 0; eIdx--) {
      const exp = this.explosions[eIdx];
      exp.age++;

      const progress = exp.age / exp.maxAge;
      if (progress >= 1) {
        this.explosions.splice(eIdx, 1);
        continue;
      }

      const ctx = this.ctx;

      // Draw Expanding Shockwave Rings
      for (const sw of exp.shockwaves) {
        sw.radius += sw.speed;
        const swProgress = Math.min(1, sw.radius / sw.maxRadius);
        const alpha = Math.max(0, 1 - swProgress);

        if (alpha > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(exp.x, exp.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = sw.color;
          ctx.lineWidth = sw.width * (1 - swProgress * 0.7);
          ctx.globalAlpha = alpha * 0.85;
          ctx.shadowColor = sw.color;
          ctx.shadowBlur = 18;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Draw Expanding Fireball Core
      if (exp.fireball.radius < exp.fireball.maxRadius) {
        exp.fireball.radius += 3.5;
        exp.fireball.alpha = Math.max(0, 1 - (exp.fireball.radius / exp.fireball.maxRadius));

        ctx.save();
        const grad = ctx.createRadialGradient(
          exp.x, exp.y, 0,
          exp.x, exp.y, exp.fireball.radius
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, 'rgba(255, 240, 100, 0.9)');
        grad.addColorStop(0.6, 'rgba(255, 0, 127, 0.7)');
        grad.addColorStop(1, 'rgba(131, 56, 236, 0)');

        ctx.fillStyle = grad;
        ctx.globalAlpha = exp.fireball.alpha;
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, exp.fireball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Explosion Embers & Mushroom Cloud Particles
      for (let pIdx = exp.particles.length - 1; pIdx >= 0; pIdx--) {
        const p = exp.particles[pIdx];
        p.x += p.vx;
        p.y += p.vy;
        p.size += p.growth;
        p.vx *= 0.94; // Air resistance
        p.vy *= 0.94;
        p.life--;

        const pProgress = p.life / p.maxLife;
        if (p.life <= 0) {
          exp.particles.splice(pIdx, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, pProgress * 0.85);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.type === 'spark' ? 12 : 6;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.type === 'spark' ? pProgress : 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    requestAnimationFrame(this.animate);
  }
}
