import './styles/main.css';
import './styles/wireframe-jets.css';
import './styles/modal.css';

import { SpaceDoodleCanvas } from './effects/SpaceDoodleCanvas.js';
import { JetEngineFx } from './effects/JetEngineFx.js';
import { tacticalAudio } from './effects/TacticalAudio.js';
import { CategoryDossierModal } from './components/CategoryDossierModal.js';
import { jetCategories } from './data/portfolioData.js';

class TacticalPortfolioApp {
  constructor() {
    this.doodleCanvasEl = document.getElementById('doodle-canvas');
    this.runwayContainer = document.getElementById('runway-container');
    this.modalPortal = document.getElementById('modal-portal');
    this.audioToggleBtn = document.getElementById('audio-toggle-btn');
    this.audioLabel = document.getElementById('audio-btn-label');
    this.telemetryEl = document.getElementById('telemetry-data');

    this.spaceCanvas = null;
    this.engineFx = null;
    this.modal = null;

    this.init();
  }

  init() {
    // 1. Initialize Space & Nude Magenta Doodles Canvas
    this.spaceCanvas = new SpaceDoodleCanvas(this.doodleCanvasEl);

    // 2. Initialize Jet Engine Afterburner FX
    this.engineFx = new JetEngineFx();

    // 3. Initialize Tactical Category Dossier Modal
    this.modal = new CategoryDossierModal(this.modalPortal);

    // 4. Render Runway Rows matching wireframe
    this.renderRunway();

    // 5. Setup Audio & Telemetry Listeners
    this.setupControls();
    this.startTelemetryLoop();

    console.log("🚀 [VIPER-01] Tactical Systems Online // 5th-Gen Jets Deployed // Space Canvas Ready");
  }

  renderRunway() {
    this.runwayContainer.innerHTML = '';

    jetCategories.forEach((cat) => {
      const isLeft = cat.side === 'left';
      const row = document.createElement('div');
      row.className = `runway-row ${isLeft ? 'row-left' : 'row-right'}`;
      row.id = `row-${cat.id}`;

      // Jet HTML
      const jetHtml = `
        <div class="jet-entity" id="jet-${cat.id}" data-category-id="${cat.id}" title="Click to engage supersonic flyby & open dossier">
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

      // Category Line HTML (extends in front of jet)
      const lineHtml = `
        <div class="category-line-unit" id="line-${cat.id}" data-category-id="${cat.id}">
          <div class="cat-line-meta">
            <span class="cat-code-badge">${cat.categoryCode}</span>
            <span class="cat-assigned-jet">${cat.jetName}</span>
            <span class="cat-lock-status">TARGET LOCK READY</span>
          </div>
          <h2 class="cat-title">${cat.categoryTitle}</h2>
          <p class="cat-subtitle">${cat.categorySubtitle}</p>
          <div class="cat-vector-line"></div>
          <div class="cat-action-chip">
            <span>ACCESS DOSSIER</span> ➔
          </div>
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

      // Attach Interactions
      const jetEl = row.querySelector(`#jet-${cat.id}`);
      const lineEl = row.querySelector(`#line-${cat.id}`);

      // Hover Jet
      jetEl?.addEventListener('mouseenter', () => {
        this.engineFx.setJetThrottle(cat.id, true, false);
        tacticalAudio.playJetThrust();
        lineEl?.classList.add('hover-synced');
      });

      jetEl?.addEventListener('mouseleave', () => {
        this.engineFx.setJetThrottle(cat.id, false, false);
        lineEl?.classList.remove('hover-synced');
      });

      // Click Jet -> Supersonic Boost Animation + Sound + Open Modal
      jetEl?.addEventListener('click', () => {
        jetEl.classList.add('supersonic-fly');
        this.engineFx.setJetThrottle(cat.id, true, true);
        tacticalAudio.playSupersonicBoom();
        setTimeout(() => {
          jetEl.classList.remove('supersonic-fly');
          this.engineFx.setJetThrottle(cat.id, false, false);
          this.modal.open(cat.id);
        }, 500);
      });

      // Hover Line
      lineEl?.addEventListener('mouseenter', () => {
        this.engineFx.setJetThrottle(cat.id, true, false);
        tacticalAudio.playLineHover();
        jetEl?.classList.add('hover-synced');
      });

      lineEl?.addEventListener('mouseleave', () => {
        this.engineFx.setJetThrottle(cat.id, false, false);
        jetEl?.classList.remove('hover-synced');
      });

      // Click Line -> Open Modal
      lineEl?.addEventListener('click', () => {
        this.modal.open(cat.id);
      });
    });
  }

  setupControls() {
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

    // Audio unlock on first user gesture
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
