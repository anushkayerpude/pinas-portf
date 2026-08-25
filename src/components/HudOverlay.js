import { pilotProfile, sectorData } from '../data/portfolioData.js';
import { soundFx } from '../effects/SoundFx.js';

/**
 * Tactical HUD Overlay Component (Khroma Edition)
 * Controls top status bar, telemetry gauges, hover previews, and clean bottom guide.
 */

export class HudOverlay {
  constructor(container, onSectorSelect, onReplayFlyby) {
    this.container = container;
    this.onSectorSelect = onSectorSelect;
    this.onReplayFlyby = onReplayFlyby;
    this.activeSector = null;

    this.render();
    this.startTelemetryGauges();
  }

  render() {
    this.el = document.createElement('div');
    this.el.className = 'hud-overlay';

    this.el.innerHTML = `
      <!-- Top Tactical Header -->
      <header class="hud-header">
        <div class="hud-brand">
          <div class="pilot-callsign-box">
            <div class="pilot-callsign">
              <span class="status-dot"></span>
              ${pilotProfile.callsign} // ${pilotProfile.name}
            </div>
            <div class="pilot-title">${pilotProfile.title}</div>
          </div>
          <div class="hud-badge rose">COMBAT READY // ACTIVE</div>
        </div>

        <div class="hud-actions">
          <button id="scramble-jet-btn" class="hud-btn" title="Scramble F-22 Raptor Jet Flyby">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
            </svg>
            SCRAMBLE F-22
          </button>

          <button id="sound-toggle-btn" class="hud-btn rose" title="Toggle Tactical Audio">
            <svg id="sound-icon-on" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span id="sound-status-text">AUDIO ON</span>
          </button>
        </div>
      </header>

      <!-- Left Telemetry Readings -->
      <aside class="hud-telemetry-left">
        <div class="telemetry-row">
          <span class="telemetry-label">AVIONICS // SPEED</span>
          <span id="telemetry-mach" class="telemetry-val">MACH 2.25</span>
        </div>
        <div class="telemetry-row">
          <span class="telemetry-label">ALTITUDE</span>
          <span id="telemetry-alt" class="telemetry-val magenta">45,200 FT</span>
        </div>
        <div class="telemetry-row">
          <span class="telemetry-label">TARGET SECTOR</span>
          <span id="telemetry-sector" class="telemetry-val">ASIA GLOBE // PACIFIC</span>
        </div>
        <div class="telemetry-row">
          <span class="telemetry-label">WEAPONS STATUS</span>
          <span class="telemetry-val magenta">NUCLEAR // ARMED</span>
        </div>
      </aside>

      <!-- Center Dynamic Target Hover Preview Popover -->
      <div id="target-hover-preview" class="hud-target-preview">
        <div class="target-header">
          <span id="prev-code" class="target-code">IND-01</span>
          <span class="hud-badge">TARGET LOCKED</span>
        </div>
        <div id="prev-name" class="target-name">India</div>
        <div id="prev-section" class="target-section">Professional Journey</div>
        <div class="target-cta">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m10 15 5-3-5-3v6z"/></svg>
          CLICK COUNTRY ON GLOBE TO OPEN
        </div>
      </div>

      <!-- Bottom Tactical Prompt Guide -->
      <footer class="hud-footer">
        <div class="hud-instruction">
          <span style="color: var(--neon-magenta);">●</span>
          DRAG GLOBE TO ROTATE // CLICK COUNTRY ON GLOBE TO OPEN SECTION
        </div>
      </footer>
    `;

    this.container.appendChild(this.el);
    this.bindEvents();
  }

  bindEvents() {
    // Scramble Jet Button
    const scrambleBtn = this.el.querySelector('#scramble-jet-btn');
    scrambleBtn.addEventListener('click', () => {
      soundFx.playClick();
      if (this.onReplayFlyby) {
        this.onReplayFlyby();
      }
    });

    // Sound Toggle Button
    const soundBtn = this.el.querySelector('#sound-toggle-btn');
    const soundText = this.el.querySelector('#sound-status-text');
    soundBtn.addEventListener('click', () => {
      const isMuted = soundFx.toggleMute();
      if (isMuted) {
        soundBtn.classList.remove('rose');
        soundText.textContent = 'MUTED';
      } else {
        soundBtn.classList.add('rose');
        soundText.textContent = 'AUDIO ON';
        soundFx.playClick();
      }
    });
  }

  setActiveSector(sectorId) {
    this.activeSector = sectorId;
    const sector = sectorData[sectorId];
    const secTelemetry = this.el.querySelector('#telemetry-sector');
    if (secTelemetry && sector) {
      secTelemetry.textContent = `${sector.name.toUpperCase()} // ${sector.code}`;
    }
  }

  showHoverPreview(sector) {
    const prevEl = this.el.querySelector('#target-hover-preview');
    if (!sector) {
      prevEl.classList.remove('visible');
      return;
    }

    this.el.querySelector('#prev-code').textContent = sector.code;
    this.el.querySelector('#prev-name').textContent = sector.name;
    this.el.querySelector('#prev-section').textContent = sector.sectorTitle;

    prevEl.classList.add('visible');
  }

  startTelemetryGauges() {
    const machEl = this.el.querySelector('#telemetry-mach');
    const altEl = this.el.querySelector('#telemetry-alt');

    setInterval(() => {
      const mach = (2.20 + Math.random() * 0.25).toFixed(2);
      if (machEl) machEl.textContent = `MACH ${mach}`;

      const alt = Math.floor(44800 + Math.random() * 800);
      if (altEl) altEl.textContent = `${alt.toLocaleString()} FT`;
    }, 1200);
  }
}
