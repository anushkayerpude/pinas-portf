import './styles/main.css';
import './styles/wireframe-jets.css';

import { SpaceDoodleCanvas } from './effects/SpaceDoodleCanvas.js';
import { JetEngineFx } from './effects/JetEngineFx.js';
import { tacticalAudio } from './effects/TacticalAudio.js';
import { ThemeCursor } from './effects/ThemeCursor.js';
import { InlineCategoryDrawer } from './components/InlineCategoryDrawer.js';
import { jetCategories, pilotProfile } from './data/portfolioData.js';

class TacticalPortfolioApp {
  constructor() {
    this.doodleCanvasEl = document.getElementById('doodle-canvas');
    this.runwayContainer = document.getElementById('runway-container');
    this.audioToggleBtn = document.getElementById('audio-toggle-btn');
    this.audioLabel = document.getElementById('audio-btn-label');
    this.flowToggleBtn = document.getElementById('flow-toggle-btn');
    this.flowLabel = document.getElementById('flow-btn-label');
    this.telemetryEl = document.getElementById('telemetry-data');

    this.spaceCanvas = null;
    this.engineFx = null;
    this.cursor = null;
    this.allFlowOpen = false;

    this.init();
  }

  init() {
    // 1. Initialize Theme Matching Tactical Cursor
    this.cursor = new ThemeCursor();

    // 2. Initialize Space & Nude Magenta Doodles Canvas
    this.spaceCanvas = new SpaceDoodleCanvas(this.doodleCanvasEl);

    // 3. Initialize Jet Engine Afterburner FX
    this.engineFx = new JetEngineFx();

    // 4. Render Runway Rows matching wireframe with inline expandable drawers
    this.renderRunway();

    // 5. Setup Controls & Telemetry
    this.setupControls();
    this.startTelemetryLoop();

    console.log("🚀 [VIPER-01] Continuous Flow Systems Online // 20% Scaled Jets // Theme Cursor Active");
  }

  renderRunway() {
    this.runwayContainer.innerHTML = '';

    jetCategories.forEach((cat) => {
      const isLeft = cat.side === 'left';
      const row = document.createElement('div');
      row.className = `runway-row ${isLeft ? 'row-left' : 'row-right'}`;
      row.id = `row-${cat.id}`;

      // 20% Scaled Jet HTML
      const jetHtml = `
        <div class="jet-entity" id="jet-${cat.id}" data-category-id="${cat.id}" title="Click to engage supersonic thrust & expand section">
          <div class="jet-visual-wrap">
            <canvas class="jet-afterburner-canvas" id="canvas-${cat.id}"></canvas>
            <img 
              src="${cat.jetImage}" 
              alt="${cat.jetName}" 
              class="jet-img ${isLeft ? 'face-right' : 'face-left'}" 
              loading="eager"
            />
            <div class="jet-hud-bracket"></div>
            <div class="jet-hud-label">${cat.jetSpeed} // ${cat.jetName}</div>
          </div>
        </div>
      `;

      // Category Line Unit with Integrated In-Place Flow Drawer
      const drawerHtml = InlineCategoryDrawer.renderDrawer(cat);
      const lineHtml = `
        <div class="category-line-unit" id="line-${cat.id}" data-category-id="${cat.id}">
          <div class="cat-line-header-row" id="header-${cat.id}">
            <div class="cat-line-meta">
              <span class="cat-code-badge">${cat.categoryCode}</span>
              <span class="cat-assigned-jet">${cat.jetName}</span>
              <span class="cat-lock-status">ACTIVE VECTOR</span>
            </div>
            <div class="cat-title-row">
              <h2 class="cat-title">${cat.categoryTitle}</h2>
              <span class="cat-toggle-indicator" id="indicator-${cat.id}">EXPAND / READ ▾</span>
            </div>
            <p class="cat-subtitle">${cat.categorySubtitle}</p>
            <div class="cat-vector-line"></div>
          </div>
          ${drawerHtml}
        </div>
      `;

      // Assemble row based on wireframe orientation
      if (isLeft) {
        // Left side: Jet on Left -> Line on Right
        row.innerHTML = jetHtml + lineHtml;
      } else {
        // Right side: Line on Left <- Jet on Right
        row.innerHTML = lineHtml + jetHtml;
      }

      this.runwayContainer.appendChild(row);

      // Register Jet Canvas to Engine FX
      setTimeout(() => {
        const jetCanvas = document.getElementById(`canvas-${cat.id}`);
        if (jetCanvas) {
          this.engineFx.registerJet(cat.id, jetCanvas, { side: cat.side });
        }
      }, 50);

      // Attach High Sensitivity Interactions
      const jetEl = row.querySelector(`#jet-${cat.id}`);
      const lineEl = row.querySelector(`#line-${cat.id}`);
      const headerEl = row.querySelector(`#header-${cat.id}`);
      const indicatorEl = row.querySelector(`#indicator-${cat.id}`);

      const toggleExpand = (forceState = null) => {
        const shouldExpand = forceState !== null ? forceState : !lineEl.classList.contains('is-expanded');
        if (shouldExpand) {
          lineEl.classList.add('is-expanded');
          indicatorEl.textContent = 'COLLAPSE ▴';
          tacticalAudio.playDossierOpen();
        } else {
          lineEl.classList.remove('is-expanded');
          indicatorEl.textContent = 'EXPAND / READ ▾';
          tacticalAudio.playDossierClose();
        }
      };

      // Hover Jet -> Increase Afterburner + Instant Hover Sensitivity
      jetEl?.addEventListener('mouseenter', () => {
        this.engineFx.setJetThrottle(cat.id, true, false);
        tacticalAudio.playJetThrust();
        lineEl.classList.add('hover-expanded');
      });

      jetEl?.addEventListener('mouseleave', () => {
        this.engineFx.setJetThrottle(cat.id, false, false);
        lineEl.classList.remove('hover-expanded');
      });

      // Click Jet -> Supersonic Boost Animation + Pin Section Open
      jetEl?.addEventListener('click', () => {
        jetEl.classList.add('supersonic-fly');
        this.engineFx.setJetThrottle(cat.id, true, true);
        tacticalAudio.playSupersonicBoom();
        toggleExpand(true);
        setTimeout(() => {
          jetEl.classList.remove('supersonic-fly');
          this.engineFx.setJetThrottle(cat.id, false, false);
        }, 600);
      });

      // Hover Line -> Sound + Throttle
      lineEl?.addEventListener('mouseenter', () => {
        this.engineFx.setJetThrottle(cat.id, true, false);
        tacticalAudio.playLineHover();
      });

      lineEl?.addEventListener('mouseleave', () => {
        this.engineFx.setJetThrottle(cat.id, false, false);
      });

      // Click Header / Line to Pin/Toggle Section in Flow
      headerEl?.addEventListener('click', (e) => {
        toggleExpand();
      });

      // Attach Comms Specific Handlers if this is the comms drawer
      if (cat.id === 'f35-comms') {
        this.attachInlineCommsListeners(row);
      }
    });
  }

  attachInlineCommsListeners(container) {
    const copyBtn = container.querySelector('#inline-copy-email-btn');
    const copyStatus = container.querySelector('#inline-copy-status');
    if (copyBtn && copyStatus) {
      copyBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(pilotProfile.socials.email);
          copyStatus.textContent = '✓ FREQUENCY COPIED TO CLIPBOARD';
          copyStatus.classList.add('active');
          tacticalAudio.playLineHover();
          setTimeout(() => {
            copyStatus.classList.remove('active');
          }, 3000);
        } catch (err) {
          copyStatus.textContent = `Email: ${pilotProfile.socials.email}`;
          copyStatus.classList.add('active');
        }
      });
    }

    const form = container.querySelector('#inline-transmission-form');
    const feedback = container.querySelector('#inline-transmission-feedback');
    if (form && feedback) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        tacticalAudio.playSupersonicBoom();
        feedback.innerHTML = `
          <div class="transmission-success">
            <strong>✓ DISPATCH ENCRYPTED & TRANSMITTED</strong><br>
            <span>Coordinates received. VIPER-01 will establish contact shortly.</span>
          </div>
        `;
        form.reset();
      });
    }
  }

  setupControls() {
    // Flow Mode Toggle: Expands all categories at once so the user can scroll down naturally
    this.flowToggleBtn?.addEventListener('click', () => {
      this.allFlowOpen = !this.allFlowOpen;
      const allLines = document.querySelectorAll('.category-line-unit');
      const allIndicators = document.querySelectorAll('.cat-toggle-indicator');

      if (this.allFlowOpen) {
        this.flowToggleBtn.classList.add('active');
        this.flowLabel.textContent = 'FLOW: FOCUSED';
        allLines.forEach(l => l.classList.add('is-expanded'));
        allIndicators.forEach(i => i.textContent = 'COLLAPSE ▴');
        tacticalAudio.playDossierOpen();
      } else {
        this.flowToggleBtn.classList.remove('active');
        this.flowLabel.textContent = 'FLOW: ALL OPEN';
        allLines.forEach(l => l.classList.remove('is-expanded'));
        allIndicators.forEach(i => i.textContent = 'EXPAND / READ ▾');
        tacticalAudio.playDossierClose();
      }
    });

    // Audio Mute/Unmute Toggle
    this.audioToggleBtn?.addEventListener('click', () => {
      const isMuted = tacticalAudio.toggleMute();
      if (isMuted) {
        this.audioToggleBtn.classList.add('muted');
        this.audioLabel.textContent = 'SFX: MUTED';
      } else {
        this.audioToggleBtn.classList.remove('muted');
        this.audioLabel.textContent = 'SFX: ON';
        tacticalAudio.playLineHover();
      }
    });

    // Audio Context Unlock on first user interaction
    const unlockAudio = () => {
      tacticalAudio.ensureContext();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
  }

  startTelemetryLoop() {
    let tick = 0;
    setInterval(() => {
      tick++;
      const mach = (2.22 + Math.sin(tick * 0.2) * 0.08).toFixed(2);
      const alt = (52000 + Math.floor(Math.sin(tick * 0.3) * 650)).toLocaleString();
      if (this.telemetryEl) {
        this.telemetryEl.textContent = `MACH ${mach} // ALT ${alt} FT // DEFCON 1`;
      }
    }, 1500);
  }
}

// Bootstrap once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new TacticalPortfolioApp();
});
