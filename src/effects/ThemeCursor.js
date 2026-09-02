/**
 * Custom Theme-Matching Tactical Aerospace Cursor
 * Nude-magenta HUD crosshair + trailing micro-jet/reticle + lock-on dynamics
 */

export class ThemeCursor {
  constructor() {
    this.cursorDot = null;
    this.cursorRing = null;
    this.mouse = { x: -100, y: -100 };
    this.pos = { x: -100, y: -100 };
    this.isHovering = false;
    this.isClicking = false;
    this.init();
  }

  init() {
    // Only init if pointer is fine (desktop / mouse)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Create cursor DOM elements
    this.cursorDot = document.createElement('div');
    this.cursorDot.className = 'theme-cursor-dot';

    this.cursorRing = document.createElement('div');
    this.cursorRing.className = 'theme-cursor-ring';
    this.cursorRing.innerHTML = `
      <div class="reticle-top"></div>
      <div class="reticle-bottom"></div>
      <div class="reticle-left"></div>
      <div class="reticle-right"></div>
    `;

    document.body.appendChild(this.cursorDot);
    document.body.appendChild(this.cursorRing);

    // Track mouse
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.cursorDot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
    });

    window.addEventListener('mousedown', () => {
      this.isClicking = true;
      this.cursorRing.classList.add('cursor-clicking');
    });

    window.addEventListener('mouseup', () => {
      this.isClicking = false;
      this.cursorRing.classList.remove('cursor-clicking');
    });

    // Handle interactive hover targets
    const updateInteractiveListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, textarea, .category-line-unit, .jet-entity, .dossier-inline-card, .hobby-card, .project-card, .skill-group-card');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
          this.cursorRing.classList.add('cursor-hover');
          this.cursorDot.classList.add('cursor-hover-dot');
        });
        el.addEventListener('mouseleave', () => {
          this.cursorRing.classList.remove('cursor-hover');
          this.cursorDot.classList.remove('cursor-hover-dot');
        });
      });
    };

    // Initial and observer for dynamic elements
    updateInteractiveListeners();
    const observer = new MutationObserver(() => updateInteractiveListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    // Smooth lerp loop for the outer reticle ring
    const render = () => {
      this.pos.x += (this.mouse.x - this.pos.x) * 0.22;
      this.pos.y += (this.mouse.y - this.pos.y) * 0.22;
      this.cursorRing.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
      requestAnimationFrame(render);
    };
    render();
  }
}
