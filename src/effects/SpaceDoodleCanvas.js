/**
 * Space & Nude-Magenta Doodle Interactive Canvas
 * Renders deep cosmic space with stars, nebulae, and hand-drawn aviation & cosmic doodles
 */

export class SpaceDoodleCanvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.doodles = [];
    this.particles = [];
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.targetMouseX = this.mouseX;
    this.targetMouseY = this.mouseY;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.time = 0;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.resize();
    this.createStars();
    this.createDoodles();

    window.addEventListener('resize', () => {
      this.resize();
      this.createStars();
      this.createDoodles();
    });

    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX;
      this.targetMouseY = e.clientY;
    });

    window.addEventListener('click', (e) => {
      this.createClickBurst(e.clientX, e.clientY);
    });

    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  createStars() {
    this.stars = [];
    const count = Math.floor((this.width * this.height) / 3800);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.6 + 0.4,
        baseAlpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: Math.random() * 0.8 + 0.2, // for parallax depth
        color: Math.random() > 0.4 ? '#ffffff' : (Math.random() > 0.5 ? '#f2b8cc' : '#d47a9e')
      });
    }
  }

  createDoodles() {
    // Generate scattered hand-drawn doodle blueprints across the viewport
    this.doodles = [
      // 1. Constellation Top-Left (Near F-22)
      {
        type: 'constellation',
        relX: 0.12,
        relY: 0.07,
        label: 'RAPTOR-CYGNUS // α-9',
        points: [
          { x: 0, y: 0 }, { x: 35, y: -20 }, { x: 80, y: -10 },
          { x: 120, y: 25 }, { x: 60, y: 35 }, { x: 0, y: 0 },
          { x: 60, y: 35 }, { x: 75, y: 70 }
        ],
        floatOffset: 0
      },
      // 2. Mach Shockwave Doodle (Near Left Categories)
      {
        type: 'mach_cone',
        relX: 0.22,
        relY: 0.26,
        label: 'MACH 2.25 // SUPERCRUISE',
        floatOffset: 1.2
      },
      // 3. Ringed Planet / Celestial Orbit (Top-Right near Rafale)
      {
        type: 'planet_orbit',
        relX: 0.88,
        relY: 0.14,
        radius: 28,
        label: 'ORBITAL VECTOR // 432.8°',
        floatOffset: 2.1
      },
      // 4. Handwritten Pilot Annotation (Center-Left)
      {
        type: 'annotation',
        relX: 0.32,
        relY: 0.46,
        text: '✦ AFTERBURNER // FULL THRUST ✦',
        subtext: 'STEALTH ACTIVE // NO LOCK',
        floatOffset: 3.4
      },
      // 5. Tactical Radar Arc / Crosshair (Center)
      {
        type: 'radar_hud',
        relX: 0.50,
        relY: 0.50,
        floatOffset: 4.0
      },
      // 6. Flying Saucer / Whimsical Space Doodle (Mid-Right)
      {
        type: 'ufo_beam',
        relX: 0.72,
        relY: 0.42,
        label: 'CONTACT // UNKNOWN BOGEY',
        floatOffset: 1.8
      },
      // 7. Coder / Logic Waveform Doodle (Bottom-Right)
      {
        type: 'code_waveform',
        relX: 0.82,
        relY: 0.78,
        label: '<WebGL /> ⚡ 60 FPS // THREE.JS',
        floatOffset: 5.1
      },
      // 8. Flight Pitch Ladder Doodle (Bottom-Left near F-35)
      {
        type: 'pitch_ladder',
        relX: 0.15,
        relY: 0.82,
        label: 'AOA: +15° // 50,000 FT',
        floatOffset: 2.7
      },
      // 9. Hand-drawn Star Burst & Rocket (Top Center)
      {
        type: 'rocket_burst',
        relX: 0.48,
        relY: 0.12,
        label: 'MISSION STATUS: CLEAR',
        floatOffset: 0.8
      },
      // 10. Cosmic Crescent & Moon Phases (Lower-Mid)
      {
        type: 'crescent_moon',
        relX: 0.62,
        relY: 0.65,
        label: 'PHASE // WAXING GIBBOUS',
        floatOffset: 3.9
      }
    ];
  }

  createClickBurst(x, y) {
    const colors = ['#f2b8cc', '#d47a9e', '#ffb3cc', '#ffffff', '#e89bb5'];
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 / 16) * i + (Math.random() * 0.2);
      const speed = Math.random() * 3 + 1.5;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        size: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  animate() {
    this.time += 0.02;

    // Smooth mouse parallax lerping
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    const parallaxX = (this.mouseX - this.width / 2) * 0.03;
    const parallaxY = (this.mouseY - this.height / 2) * 0.03;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Deep Space Base & Subtle Nebula Gradients
    this.drawNebulae(parallaxX, parallaxY);

    // 2. Draw Stars
    this.drawStars(parallaxX, parallaxY);

    // 3. Draw Nude Magenta Doodles
    this.drawDoodles(parallaxX, parallaxY);

    // 4. Draw Interactive Particles
    this.drawParticles();

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  drawNebulae(px, py) {
    // Soft glowing magenta/rose deep space nebulae
    const g1 = this.ctx.createRadialGradient(
      this.width * 0.2 + px * 0.5, this.height * 0.25 + py * 0.5, 50,
      this.width * 0.2 + px * 0.5, this.height * 0.25 + py * 0.5, this.width * 0.45
    );
    g1.addColorStop(0, 'rgba(212, 122, 158, 0.07)');
    g1.addColorStop(0.5, 'rgba(158, 70, 107, 0.03)');
    g1.addColorStop(1, 'rgba(6, 5, 11, 0)');

    this.ctx.fillStyle = g1;
    this.ctx.fillRect(0, 0, this.width, this.height);

    const g2 = this.ctx.createRadialGradient(
      this.width * 0.8 - px * 0.5, this.height * 0.7 - py * 0.5, 40,
      this.width * 0.8 - px * 0.5, this.height * 0.7 - py * 0.5, this.width * 0.5
    );
    g2.addColorStop(0, 'rgba(242, 184, 204, 0.06)');
    g2.addColorStop(0.6, 'rgba(201, 101, 139, 0.025)');
    g2.addColorStop(1, 'rgba(6, 5, 11, 0)');

    this.ctx.fillStyle = g2;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawStars(px, py) {
    for (let s of this.stars) {
      const x = s.x + px * s.layer;
      const y = s.y + py * s.layer;
      const twinkle = Math.sin(this.time * s.twinkleSpeed * 10 + s.twinklePhase);
      const alpha = Math.max(0.1, Math.min(1, s.baseAlpha + twinkle * 0.3));

      this.ctx.beginPath();
      this.ctx.arc(x, y, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = alpha;
      this.ctx.fill();

      // Subtle 4-point sparkle for larger stars
      if (s.radius > 1.4 && alpha > 0.6) {
        this.ctx.strokeStyle = s.color;
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(x - s.radius * 2.2, y);
        this.ctx.lineTo(x + s.radius * 2.2, y);
        this.ctx.moveTo(x, y - s.radius * 2.2);
        this.ctx.lineTo(x, y + s.radius * 2.2);
        this.ctx.stroke();
      }
    }
    this.ctx.globalAlpha = 1.0;
  }

  drawDoodles(px, py) {
    const doodleColor = 'rgba(232, 155, 181, 0.65)';
    const doodleGlow = 'rgba(212, 122, 158, 0.4)';
    const textDoodleColor = 'rgba(242, 184, 204, 0.5)';

    this.ctx.save();
    this.ctx.strokeStyle = doodleColor;
    this.ctx.fillStyle = doodleColor;
    this.ctx.lineWidth = 1.2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    for (let d of this.doodles) {
      const floatY = Math.sin(this.time + d.floatOffset) * 6;
      const floatX = Math.cos(this.time * 0.8 + d.floatOffset) * 4;
      const x = d.relX * this.width + px * 1.2 + floatX;
      const y = d.relY * this.height + py * 1.2 + floatY;

      this.ctx.save();
      this.ctx.translate(x, y);

      switch (d.type) {
        case 'constellation':
          this.drawConstellation(d);
          break;
        case 'mach_cone':
          this.drawMachCone(d);
          break;
        case 'planet_orbit':
          this.drawPlanetOrbit(d);
          break;
        case 'annotation':
          this.drawAnnotation(d);
          break;
        case 'radar_hud':
          this.drawRadarHud(d);
          break;
        case 'ufo_beam':
          this.drawUfoBeam(d);
          break;
        case 'code_waveform':
          this.drawCodeWaveform(d);
          break;
        case 'pitch_ladder':
          this.drawPitchLadder(d);
          break;
        case 'rocket_burst':
          this.drawRocketBurst(d);
          break;
        case 'crescent_moon':
          this.drawCrescentMoon(d);
          break;
      }
      this.ctx.restore();
    }
    this.ctx.restore();
  }

  // --- Hand-drawn Doodle Renderers ---

  drawConstellation(d) {
    this.ctx.beginPath();
    this.ctx.setLineDash([4, 4]);
    for (let i = 0; i < d.points.length; i++) {
      const p = d.points[i];
      if (i === 0) this.ctx.moveTo(p.x, p.y);
      else this.ctx.lineTo(p.x, p.y);
    }
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Star nodes
    for (let p of d.points) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Label
    this.ctx.font = '10px "Space Mono", monospace, monospace';
    this.ctx.fillText(d.label, 0, 90);
  }

  drawMachCone(d) {
    // Hand-drawn Mach shockwave cone
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(-45, -25);
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(-45, 25);
    // Arc shockwave
    this.ctx.moveTo(-20, -12);
    this.ctx.quadraticCurveTo(-15, 0, -20, 12);
    this.ctx.moveTo(-38, -21);
    this.ctx.quadraticCurveTo(-30, 0, -38, 21);
    this.ctx.stroke();

    // Dotted streamlines
    this.ctx.beginPath();
    this.ctx.setLineDash([3, 5]);
    this.ctx.moveTo(-60, -15);
    this.ctx.lineTo(-5, -3);
    this.ctx.moveTo(-60, 15);
    this.ctx.lineTo(-5, 3);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    this.ctx.font = '9px "Space Mono", monospace';
    this.ctx.fillText(d.label, -55, 38);
  }

  drawPlanetOrbit(d) {
    // Planet body
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 18, 0, Math.PI * 2);
    this.ctx.stroke();

    // Planet texture rings
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, 36, 10, Math.PI / -6, 0, Math.PI * 2);
    this.ctx.stroke();

    // Moonlet
    this.ctx.beginPath();
    this.ctx.arc(32, -15, 3.5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.font = '9px "Space Mono", monospace';
    this.ctx.fillText(d.label, -40, 32);
  }

  drawAnnotation(d) {
    this.ctx.font = '11px "Space Mono", monospace';
    this.ctx.fillText(d.text, 0, 0);
    this.ctx.font = '9px "Space Mono", monospace';
    this.ctx.fillText(d.subtext, 0, 14);

    // Decorative arrow underline
    this.ctx.beginPath();
    this.ctx.moveTo(0, 20);
    this.ctx.lineTo(130, 20);
    this.ctx.lineTo(125, 17);
    this.ctx.moveTo(130, 20);
    this.ctx.lineTo(125, 23);
    this.ctx.stroke();
  }

  drawRadarHud(d) {
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 35, 0, Math.PI * 2);
    this.ctx.setLineDash([5, 5]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Crosshair ticks
    this.ctx.beginPath();
    this.ctx.moveTo(-45, 0);
    this.ctx.lineTo(-35, 0);
    this.ctx.moveTo(35, 0);
    this.ctx.lineTo(45, 0);
    this.ctx.moveTo(0, -45);
    this.ctx.lineTo(0, -35);
    this.ctx.moveTo(0, 35);
    this.ctx.lineTo(0, 45);
    this.ctx.stroke();

    // Rotating radar sweep line
    const sweepAngle = this.time * 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(Math.cos(sweepAngle) * 35, Math.sin(sweepAngle) * 35);
    this.ctx.stroke();

    this.ctx.font = '9px "Space Mono", monospace';
    this.ctx.fillText('RADAR 360° // SCAN', -38, 55);
  }

  drawUfoBeam(d) {
    // Whimsical doodle UFO
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, 20, 7, 0, 0, Math.PI * 2);
    this.ctx.stroke();

    // Cockpit dome
    this.ctx.beginPath();
    this.ctx.arc(0, -2, 8, Math.PI, 0);
    this.ctx.stroke();

    // Tractor beam (dashed)
    this.ctx.beginPath();
    this.ctx.setLineDash([4, 3]);
    this.ctx.moveTo(-10, 5);
    this.ctx.lineTo(-25, 38);
    this.ctx.moveTo(10, 5);
    this.ctx.lineTo(25, 38);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    this.ctx.font = '9px "Space Mono", monospace';
    this.ctx.fillText(d.label, -40, 52);
  }

  drawCodeWaveform(d) {
    // Sine wave signal
    this.ctx.beginPath();
    for (let i = -40; i <= 40; i += 4) {
      const waveY = Math.sin((i + this.time * 20) * 0.15) * 8;
      if (i === -40) this.ctx.moveTo(i, waveY);
      else this.ctx.lineTo(i, waveY);
    }
    this.ctx.stroke();

    // Box bounds
    this.ctx.strokeRect(-50, -16, 100, 32);

    this.ctx.font = '9px "Space Mono", monospace';
    this.ctx.fillText(d.label, -50, 28);
  }

  drawPitchLadder(d) {
    // HUD Pitch ladder rungs
    for (let i = -1; i <= 1; i++) {
      const ry = i * 18;
      this.ctx.beginPath();
      this.ctx.moveTo(-25, ry);
      this.ctx.lineTo(-10, ry);
      this.ctx.lineTo(-10, ry + 4);
      this.ctx.moveTo(25, ry);
      this.ctx.lineTo(10, ry);
      this.ctx.lineTo(10, ry + 4);
      this.ctx.stroke();
    }

    this.ctx.font = '9px "Space Mono", monospace';
    this.ctx.fillText(d.label, -35, 36);
  }

  drawRocketBurst(d) {
    // Little rocket doodle
    this.ctx.beginPath();
    this.ctx.moveTo(0, -18);
    this.ctx.lineTo(6, 4);
    this.ctx.lineTo(-6, 4);
    this.ctx.closePath();
    this.ctx.stroke();

    // Rocket fins
    this.ctx.beginPath();
    this.ctx.moveTo(-6, 0);
    this.ctx.lineTo(-11, 7);
    this.ctx.lineTo(-6, 4);
    this.ctx.moveTo(6, 0);
    this.ctx.lineTo(11, 7);
    this.ctx.lineTo(6, 4);
    this.ctx.stroke();

    // Flame exhaust
    this.ctx.beginPath();
    this.ctx.moveTo(-4, 6);
    this.ctx.lineTo(0, 14 + Math.sin(this.time * 8) * 3);
    this.ctx.lineTo(4, 6);
    this.ctx.stroke();

    // 4 sparkles around
    this.drawSparkle(16, -10, 4);
    this.drawSparkle(-18, 2, 5);

    this.ctx.font = '9px "Space Mono", monospace';
    this.ctx.fillText(d.label, -45, 26);
  }

  drawCrescentMoon(d) {
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 16, Math.PI * 0.2, Math.PI * 1.8);
    this.ctx.quadraticCurveTo(8, 0, 0, 16);
    this.ctx.stroke();

    this.drawSparkle(20, -12, 4);
    this.ctx.font = '9px "Space Mono", monospace';
    this.ctx.fillText(d.label, -35, 32);
  }

  drawSparkle(x, y, size) {
    this.ctx.beginPath();
    this.ctx.moveTo(x - size, y);
    this.ctx.lineTo(x + size, y);
    this.ctx.moveTo(x, y - size);
    this.ctx.lineTo(x, y + size);
    this.ctx.stroke();
  }

  drawParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;
  }
}
