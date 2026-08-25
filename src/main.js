import './styles/main.css';
import './styles/hud.css';
import './styles/modal.css';
import './styles/effects.css';

import { SceneManager } from './three/SceneManager.js';
import { JetCursor } from './effects/JetCursor.js';
import { NukeDetonation } from './effects/NukeDetonation.js';
import { HudOverlay } from './components/HudOverlay.js';
import { ModalDossier } from './components/ModalDossier.js';

class PortfolioApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.canvasContainer = document.getElementById('canvas-container');

    this.init();
  }

  init() {
    // 1. Initialize Custom F-22 Raptor Jet Cursor
    this.jetCursor = new JetCursor();

    // 2. Initialize Nuclear Detonation Click Effect Engine
    this.nukeDetonation = new NukeDetonation();

    // 3. Initialize Mission Dossier Modal
    this.modalDossier = new ModalDossier(
      this.appContainer,
      () => this.onModalClose()
    );

    // 4. Initialize HUD Overlay
    this.hudOverlay = new HudOverlay(
      this.appContainer,
      (sectorId) => this.handleSectorSelect(sectorId),
      () => this.handleReplayFlyby()
    );

    // 5. Initialize Three.js 3D Master Scene (Globe + F-22 Raptor)
    this.sceneManager = new SceneManager(
      this.canvasContainer,
      (sectorId) => this.handleGlobeSectorClick(sectorId),
      (sector) => this.handleGlobeSectorHover(sector)
    );

    console.log("🚀 [VIPER-01] Tactical Systems Online // F-22 Ready // Defense Level 1");
  }

  handleGlobeSectorClick(sectorId) {
    this.hudOverlay.setActiveSector(sectorId);
    this.modalDossier.open(sectorId);
  }

  handleGlobeSectorHover(sector) {
    this.hudOverlay.showHoverPreview(sector);
  }

  handleSectorSelect(sectorId) {
    this.sceneManager.handleSectorSelected(sectorId);
    this.modalDossier.open(sectorId);
  }

  handleReplayFlyby() {
    this.sceneManager.triggerIntroFlyby();
  }

  onModalClose() {
    // Optional cleanup on modal close
  }
}

// Bootstrap once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
