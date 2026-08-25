/**
 * Realistic F-22 Raptor Jet Cursor Engine
 * Renders the authentic stealth fighter jet tracking mouse movements, dynamically
 * banking in the direction of velocity, and ejecting glowing Khroma magenta afterburner flames.
 */

export class JetCursor {
  constructor() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.targetX = this.x;
    this.targetY = this.y;
    this.angle = -Math.PI / 2; // Facing up
    this.targetAngle = this.angle;
    this.speed = 0;
    this.particles = [];
    this.isHoveringClickable = false;
    this.visible = false;

    this.jetImg = new Image();
    this.jetImg.src = '/assets/f22_upright.png';

    this.init();
  }

  init() {
    document.body.classList.add('custom-cursor-active');

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
      if (e.target.closest('button, a, .clickable, [role="button"], input, textarea')) {
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
    const count = Math.min(3, Math.max(1, Math.floor(this.speed * 0.2) + 1));
    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 0.35;
      const speed = 2 + Math.random() * 4 + this.speed * 0.15;
      const life = 18 + Math.random() * 12;
      const pAngle = backwardAngle + spread;

      const colors = ['#B2094D', '#EDDBD8', '#771450', '#D4B4BD'];
      const colorL = colors[Math.floor(Math.random() * colors.length)];
      const colorR = colors[Math.floor(Math.random() * colors.length)];

      this.particles.push({
        x: leftX + (Math.random() - 0.5) * 2,
        y: leftY + (Math.random() - 0.5) * 2,
        vx: Math.cos(pAngle) * speed,
        vy: Math.sin(pAngle) * speed,
        life: life,
        maxLife: life,
        size: 3 + Math.random() * 3,
        color: colorL
      });

      this.particles.push({
        x: rightX + (Math.random() - 0.5) * 2,
        y: rightY + (Math.random() - 0.5) * 2,
        vx: Math.cos(pAngle) * speed,
        vy: Math.sin(pAngle) * speed,
        life: life,
        maxLife: life,
        size: 3 + Math.random() * 3,
        color: colorR
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.speed = Math.sqrt(dx * dx + dy * dy);

    this.x += dx * 0.35;
    this.y += dy * 0.35;

    if (this.speed > 0.5) {
      this.targetAngle = Math.atan2(dy, dx) + Math.PI / 2;
    }

    let angleDiff = this.targetAngle - this.angle;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    this.angle += angleDiff * 0.25;

    // Draw afterburner particles
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
      this.ctx.shadowColor = '#B2094D';
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

    const scale = this.isHoveringClickable ? 0.085 : 0.065;
    ctx.scale(scale, scale);

    const backwardAngle = this.angle + Math.PI / 2;
    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    // Twin nozzle origins in local coordinates
    const leftLocalX = -75 * scale;
    const leftLocalY = 220 * scale;
    const rightLocalX = 75 * scale;
    const rightLocalY = 220 * scale;

    const leftWorldX = this.x + (leftLocalX * cosA - leftLocalY * sinA);
    const leftWorldY = this.y + (leftLocalX * sinA + leftLocalY * cosA);
    const rightWorldX = this.x + (rightLocalX * cosA - rightLocalY * sinA);
    const rightWorldY = this.y + (rightLocalX * sinA + rightLocalY * cosA);

    this.emitAfterburners(leftWorldX, leftWorldY, rightWorldX, rightWorldY, backwardAngle);

    // Hover targeting reticle
    if (this.isHoveringClickable) {
      ctx.strokeStyle = '#D4B4BD';
      ctx.lineWidth = 18;
      ctx.shadowColor = '#B2094D';
      ctx.shadowBlur = 40;

      ctx.beginPath();
      ctx.arc(0, 0, 480, -0.4, 0.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 480, Math.PI - 0.4, Math.PI + 0.4);
      ctx.stroke();
    }

    // Draw realistic F-22 sprite
    if (this.jetImg.complete && this.jetImg.naturalWidth > 0) {
      ctx.shadowColor = '#B2094D';
      ctx.shadowBlur = 25;
      const w = this.jetImg.naturalWidth;
      const h = this.jetImg.naturalHeight;
      ctx.drawImage(this.jetImg, -w / 2, -h / 2, w, h);
    } else {
      // Vector fallback
      ctx.fillStyle = '#4D3C53';
      ctx.strokeStyle = '#B2094D';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -200);
      ctx.lineTo(160, 120);
      ctx.lineTo(0, 80);
      ctx.lineTo(-160, 120);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}
