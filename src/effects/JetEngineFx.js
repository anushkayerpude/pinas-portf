/**
 * Jet Engine Afterburner & Shock Diamond Canvas Effect
 * Spawns thrust particles and Mach shock diamonds behind jet engines
 */

export class JetEngineFx {
  constructor() {
    this.particles = [];
    this.activeJets = new Map(); // jetId -> { canvas, ctx, x, y, angle, active }
    this.animationId = null;
    this.init();
  }

  init() {
    // Loop
    const loop = () => {
      this.update();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  registerJet(id, canvasElement, options = {}) {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    this.activeJets.set(id, {
      id,
      canvas: canvasElement,
      ctx,
      side: options.side || 'left', // 'left' (jet faces right) or 'right' (jet faces left)
      throttle: 0.2, // idle
      targetThrottle: 0.2,
      boost: false
    });
  }

  setJetThrottle(id, active, boost = false) {
    const jet = this.activeJets.get(id);
    if (jet) {
      jet.targetThrottle = boost ? 1.0 : (active ? 0.7 : 0.2);
      jet.boost = boost;
    }
  }

  update() {
    for (let [id, jet] of this.activeJets) {
      const { canvas, ctx, side } = jet;
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;

      // Lerp throttle
      jet.throttle += (jet.targetThrottle - jet.throttle) * 0.1;

      ctx.clearRect(0, 0, w, h);

      if (jet.throttle < 0.05) continue;

      // Exhaust location based on orientation
      // Left side jet: flies towards right, exhaust is on the left
      // Right side jet: flies towards left, exhaust is on the right
      const isLeft = side === 'left';
      const exhaustX = isLeft ? w * 0.15 : w * 0.85;
      const exhaustY = h * 0.52;
      const dir = isLeft ? -1 : 1; // particles fly backward

      // 1. Draw Shockwave Core Glow
      const glowGrad = ctx.createRadialGradient(
        exhaustX, exhaustY, 2,
        exhaustX, exhaustY, 25 * jet.throttle
      );
      glowGrad.addColorStop(0, jet.boost ? '#ffffff' : 'rgba(0, 240, 255, 0.9)');
      glowGrad.addColorStop(0.3, 'rgba(255, 100, 200, 0.8)');
      glowGrad.addColorStop(0.7, 'rgba(212, 122, 158, 0.4)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(exhaustX, exhaustY, 30 * jet.throttle, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Shock Diamond Mach Discs
      const diamonds = jet.boost ? 5 : (jet.throttle > 0.4 ? 3 : 1);
      for (let i = 1; i <= diamonds; i++) {
        const dx = exhaustX + dir * (i * 14 * jet.throttle);
        const dy = exhaustY + (Math.random() - 0.5) * 1.5;
        const dSize = (8 - i * 1.2) * jet.throttle;

        ctx.strokeStyle = i === 1 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(242, 184, 204, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(dx - dSize, dy);
        ctx.lineTo(dx, dy - dSize * 0.6);
        ctx.lineTo(dx + dSize, dy);
        ctx.lineTo(dx, dy + dSize * 0.6);
        ctx.closePath();
        ctx.stroke();
      }

      // 3. Emit Exhaust Thrust Particles
      if (Math.random() < jet.throttle * 0.9) {
        const count = jet.boost ? 4 : (jet.throttle > 0.5 ? 2 : 1);
        for (let c = 0; c < count; c++) {
          this.particles.push({
            canvas,
            ctx,
            x: exhaustX,
            y: exhaustY + (Math.random() - 0.5) * 6,
            vx: dir * (Math.random() * 4 + 2) * jet.throttle,
            vy: (Math.random() - 0.5) * 1.8,
            size: Math.random() * 4 + 2,
            life: 1.0,
            decay: Math.random() * 0.04 + 0.03,
            color: Math.random() > 0.4 ? '#ff66b2' : (Math.random() > 0.5 ? '#00f0ff' : '#ffffff')
          });
        }
      }
    }

    // Render & update free particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      const { ctx } = p;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.7;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }
}
