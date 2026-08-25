import { soundFx } from './SoundFx.js';

/**
 * Nuclear Detonation Effect Engine (Khroma Palette Edition)
 * Triggers thermal whiteout flash, multi-axis camera shake, expanding distortion rings,
 * rising mushroom cloud fireball particles, and heavy sub-bass explosion audio on click.
 */

export class NukeDetonation {
  constructor() {
    this.explosions = [];
    this.init();
  }

  init() {
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

    this.flashEl = document.createElement('div');
    this.flashEl.className = 'nuke-thermal-flash';
    document.body.appendChild(this.flashEl);

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());

    // Trigger nuclear detonation on pointer click anywhere
    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('#sound-toggle-btn, #scramble-jet-btn')) {
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
    soundFx.playNukeDetonation();
    this.triggerFlash();
    this.triggerScreenShake();

    const explosion = {
      x,
      y,
      age: 0,
      maxAge: 80,
      shockwaves: [
        { radius: 0, maxRadius: 320, speed: 15, width: 8, color: '#EDDBD8' },
        { radius: 0, maxRadius: 420, speed: 11, width: 16, color: '#B2094D' },
        { radius: 0, maxRadius: 520, speed: 7, width: 8, color: '#771450' }
      ],
      fireball: {
        radius: 4,
        maxRadius: 75,
        alpha: 1.0
      },
      particles: []
    };

    const particleCount = 75;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 11;
      const isMushroomCap = Math.random() > 0.35;
      const life = 40 + Math.random() * 45;

      explosion.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isMushroomCap ? (2.5 + Math.random() * 3.5) : 0),
        size: 6 + Math.random() * 11,
        growth: 0.35 + Math.random() * 0.45,
        life: life,
        maxLife: life,
        type: isMushroomCap ? 'cloud' : 'spark',
        color: this.getRandomKhromaColor()
      });
    }

    this.explosions.push(explosion);
  }

  getRandomKhromaColor() {
    const khromaPalette = [
      '#EDDBD8', '#D7C1D1', '#D4B4BD', '#C4809F',
      '#B2094D', '#7C0645', '#771450', '#810D1E',
      '#66021B', '#5B2662', '#5E1B42', '#371E4D'
    ];
    return khromaPalette[Math.floor(Math.random() * khromaPalette.length)];
  }

  triggerFlash() {
    this.flashEl.classList.remove('active');
    void this.flashEl.offsetWidth;
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

      // Draw Shockwaves
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
          ctx.globalAlpha = alpha * 0.88;
          ctx.shadowColor = sw.color;
          ctx.shadowBlur = 22;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Draw Fireball Core
      if (exp.fireball.radius < exp.fireball.maxRadius) {
        exp.fireball.radius += 4.0;
        exp.fireball.alpha = Math.max(0, 1 - (exp.fireball.radius / exp.fireball.maxRadius));

        ctx.save();
        const grad = ctx.createRadialGradient(
          exp.x, exp.y, 0,
          exp.x, exp.y, exp.fireball.radius
        );
        grad.addColorStop(0, '#EDDBD8');
        grad.addColorStop(0.3, 'rgba(240, 190, 200, 0.95)');
        grad.addColorStop(0.6, 'rgba(178, 9, 77, 0.75)');
        grad.addColorStop(1, 'rgba(55, 30, 77, 0)');

        ctx.fillStyle = grad;
        ctx.globalAlpha = exp.fireball.alpha;
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, exp.fireball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Embers & Mushroom Smoke Billows
      for (let pIdx = exp.particles.length - 1; pIdx >= 0; pIdx--) {
        const p = exp.particles[pIdx];
        p.x += p.vx;
        p.y += p.vy;
        p.size += p.growth;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life--;

        const pProgress = p.life / p.maxLife;
        if (p.life <= 0) {
          exp.particles.splice(pIdx, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, pProgress * 0.9);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.type === 'spark' ? 14 : 7;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.type === 'spark' ? pProgress : 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    requestAnimationFrame(this.animate);
  }
}
