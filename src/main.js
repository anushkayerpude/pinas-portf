import './styles/main.css';
import './styles/hud.css';
import './styles/modal.css';
import './styles/effects.css';

import { SceneManager } from './three/SceneManager.js';
import { JetCursor } from './effects/JetCursor.js';
import { NukeDetonation } from './effects/NukeDetonation.js';
import { IntroFlightController } from './effects/IntroFlightController.js';
import { HudOverlay } from './components/HudOverlay.js';
import { ModalDossier } from './components/ModalDossier.js';

class PortfolioApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.canvasContainer = document.getElementById('canvas-container');
    this.flybyCanvas = document.getElementById('flyby-canvas');

    this.init();
  }

  init() {
    // 1. Initialize Custom Realistic F-22 Raptor Jet Cursor
    this.jetCursor = new JetCursor();

    // 2. Initialize Nuclear Detonation Click Effect Engine
    this.nukeDetonation = new NukeDetonation();

    // 3. Initialize Mission Dossier Modal
    this.modalDossier = new ModalDossier(
      this.appContainer,
      () => this.onModalClose()
    );

    // 4. Initialize HUD Overlay (Without bottom buttons; on-globe interaction)
    this.hudOverlay = new HudOverlay(
      this.appContainer,
      (sectorId) => this.handleSectorSelect(sectorId),
      () => this.handleReplayFlyby()
    );

    // 5. Initialize Three.js 3D Master Scene (Asia Globe)
    this.sceneManager = new SceneManager(
      this.canvasContainer,
      (sectorId) => this.handleGlobeSectorClick(sectorId),
      (sector) => this.handleGlobeSectorHover(sector)
    );

    // 6. Initialize Realistic F-22 Intro Flyby & Nuking Controller
    this.introFlight = new IntroFlightController(
      this.flybyCanvas,
      () => this.onIntroFlightComplete(),
      (x, y) => this.onIntroNukeDrop(x, y)
    );

    // Start Intro Sequence
    this.introFlight.start();

    console.log("🚀 [VIPER-01] Tactical Systems Online // F-22 Raptor Ready // Defcon 1");
  }

  onIntroNukeDrop(x, y) {
    // Drop nuclear strike along the F-22 flight path
    this.nukeDetonation.detonate(x, y);
  }

  onIntroFlightComplete() {
    // Reveal 3D Asia Globe once the F-22 exits at bottom-left
    this.sceneManager.revealGlobe();
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
    // Hide globe slightly, re-run supersonic F-22 flyby & nuking, then reveal globe again
    this.introFlight.start();
  }

  onModalClose() {
    // Cleanup if needed
  }
}

// Bootstrap once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
