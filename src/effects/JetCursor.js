/**
 * F-22 Raptor Jet Cursor Engine
 * Renders a stealth fighter jet cursor that dynamically rotates/banks in the direction
 * of mouse movement and ejects glowing neon magenta afterburner particles.
 */

export class JetCursor {
  constructor() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.targetX = this.x;
    this.targetY = this.y;
    this.angle = -Math.PI / 2; // Default facing up
    this.targetAngle = this.angle;
    this.speed = 0;
    this.particles = [];
    this.isHoveringClickable = false;
    this.visible = false;

    this.init();
  }

  init() {
    // Hide default cursor
    document.body.classList.add('custom-cursor-active');

    // Create cursor canvas for high-performance rendering & trails
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'jet-cursor-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseenter', () => { this.visible = true; });
    window.addEventListener('mouseleave', () => { this.visible = false; });

    // Track clickable hover states
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('button, a, .clickable, .sector-btn, [role="button"], input, textarea')) {
        this.isHoveringClickable = true;
      } else {
        this.isHoveringClickable = false;
      }
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

  onMouseMove(e) {
    this.visible = true;
    this.targetX = e.clientX;
    this.targetY = e.clientY;
  }

  emitAfterburners(leftX, leftY, rightX, rightY, backwardAngle) {
    // Spawn particle flames from both twin engine nozzles
    const count = Math.min(3, Math.max(1, Math.floor(this.speed * 0.2) + 1));
    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 0.35;
      const speed = 2 + Math.random() * 4 + this.speed * 0.15;
      const life = 18 + Math.random() * 12;
      const pAngle = backwardAngle + spread;

      // Left engine particle
      this.particles.push({
        x: leftX + (Math.random() - 0.5) * 2,
        y: leftY + (Math.random() - 0.5) * 2,
        vx: Math.cos(pAngle) * speed,
        vy: Math.sin(pAngle) * speed,
        life: life,
        maxLife: life,
        size: 3 + Math.random() * 3,
        color: Math.random() > 0.3 ? '#ff007f' : '#ff9900' // Magenta core & amber glow
      });

      // Right engine particle
      this.particles.push({
        x: rightX + (Math.random() - 0.5) * 2,
        y: rightY + (Math.random() - 0.5) * 2,
        vx: Math.cos(pAngle) * speed,
        vy: Math.sin(pAngle) * speed,
        life: life,
        maxLife: life,
        size: 3 + Math.random() * 3,
        color: Math.random() > 0.3 ? '#ff00a0' : '#ffd700'
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Calculate movement inertia
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.speed = Math.sqrt(dx * dx + dy * dy);

    this.x += dx * 0.35;
    this.y += dy * 0.35;

    // Calculate target angle based on direction of movement
    if (this.speed > 0.5) {
      this.targetAngle = Math.atan2(dy, dx) + Math.PI / 2; // Orient nose along movement
    }

    // Smooth angle interpolation
    let angleDiff = this.targetAngle - this.angle;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    this.angle += angleDiff * 0.25;

    // Update & draw afterburner particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      const progress = p.life / p.maxLife;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = progress * 0.9;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = '#ff007f';
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * progress, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.visible) {
      this.drawJet();
    }

    requestAnimationFrame(this.animate);
  }

  drawJet() {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const scale = this.isHoveringClickable ? 1.25 : 1.0;
    ctx.scale(scale, scale);

    // Engine exhaust coordinates in local space
    const backwardAngle = this.angle + Math.PI / 2;
    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    // Left nozzle: (-6, 16), Right nozzle: (6, 16)
    const leftLocalX = -5.5 * scale;
    const leftLocalY = 16 * scale;
    const rightLocalX = 5.5 * scale;
    const rightLocalY = 16 * scale;

    const leftWorldX = this.x + (leftLocalX * cosA - leftLocalY * sinA);
    const leftWorldY = this.y + (leftLocalX * sinA + leftLocalY * cosA);
    const rightWorldX = this.x + (rightLocalX * cosA - rightLocalY * sinA);
    const rightWorldY = this.y + (rightLocalX * sinA + rightLocalY * cosA);

    this.emitAfterburners(leftWorldX, leftWorldY, rightWorldX, rightWorldY, backwardAngle);

    // Target lock reticle when hovering clickable elements
    if (this.isHoveringClickable) {
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;

      // Outer targeting brackets
      const r = 24;
      ctx.beginPath();
      ctx.arc(0, 0, r, -0.4, 0.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI - 0.4, Math.PI + 0.4);
      ctx.stroke();

      // Crosshair pips
      ctx.beginPath();
      ctx.moveTo(0, -r - 4); ctx.lineTo(0, -r + 2);
      ctx.moveTo(0, r - 2); ctx.lineTo(0, r + 4);
      ctx.moveTo(-r - 4, 0); ctx.lineTo(-r + 2, 0);
      ctx.moveTo(r - 2, 0); ctx.lineTo(r + 4, 0);
      ctx.stroke();
    }

    // Stealth F-22 Body Geometry
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = this.isHoveringClickable ? 14 : 8;

    // Diamond Delta Main Fuselage & Wings
    ctx.beginPath();
    ctx.moveTo(0, -22);          // Nose cone tip
    ctx.lineTo(4, -10);          // Forebody chine
    ctx.lineTo(19, 6);           // Right main wingtip
    ctx.lineTo(17, 10);          // Wing trailing edge
    ctx.lineTo(8, 9);            // Wing root
    ctx.lineTo(10, 18);          // Right canted horizontal stabilizer
    ctx.lineTo(5, 17);           // Right engine nozzle outer
    ctx.lineTo(4, 15);           // Right nozzle inner
    ctx.lineTo(1.5, 16);         // Central beavertail
    ctx.lineTo(0, 14);           // Center spine
    ctx.lineTo(-1.5, 16);        // Central beavertail
    ctx.lineTo(-4, 15);          // Left nozzle inner
    ctx.lineTo(-5, 17);          // Left engine nozzle outer
    ctx.lineTo(-10, 18);         // Left canted horizontal stabilizer
    ctx.lineTo(-8, 9);           // Left wing root
    ctx.lineTo(-17, 10);         // Left wing trailing edge
    ctx.lineTo(-19, 6);          // Left main wingtip
    ctx.lineTo(-4, -10);         // Left forebody chine
    ctx.closePath();

    // Stealth Fuselage Gradient
    const gradient = ctx.createLinearGradient(0, -22, 0, 18);
    gradient.addColorStop(0, '#ff007f');
    gradient.addColorStop(0.5, '#2b053d');
    gradient.addColorStop(1, '#0e0114');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Laser Edge Stroke
    ctx.strokeStyle = this.isHoveringClickable ? '#00f0ff' : '#ff007f';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Stealth Chime Facets & Wing Panel Lines
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -20); ctx.lineTo(0, 10); // Center spine
    ctx.moveTo(0, -5); ctx.lineTo(15, 6);   // Right wing sweep line
    ctx.moveTo(0, -5); ctx.lineTo(-15, 6);  // Left wing sweep line
    ctx.stroke();

    // Twin Canted Vertical Stabilizers (F-22 iconic twin tails)
    ctx.fillStyle = '#ff2a8d';
    ctx.beginPath();
    ctx.moveTo(3.5, 6); ctx.lineTo(6.5, 17); ctx.lineTo(5, 16); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-3.5, 6); ctx.lineTo(-6.5, 17); ctx.lineTo(-5, 16); ctx.closePath();
    ctx.fill();

    // Gold/Cyan Tinted Stealth Cockpit Canopy
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(0, -8, 2.2, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
