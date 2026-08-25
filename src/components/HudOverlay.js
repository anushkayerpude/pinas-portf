import { pilotProfile, sectorData } from '../data/portfolioData.js';
import { soundFx } from '../effects/SoundFx.js';

/**
 * Tactical HUD Overlay Component
 * Controls top status bar, telemetry gauges, hover previews, and quick sector dock.
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
          <div class="hud-badge cyan">DEFCON 1 // ACTIVE</div>
        </div>

        <div class="hud-actions">
          <button id="scramble-jet-btn" class="hud-btn" title="Scramble F-22 Raptor Jet Flyby">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
            </svg>
            SCRAMBLE JET
          </button>

          <button id="sound-toggle-btn" class="hud-btn cyan" title="Toggle Tactical Audio">
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
          <span id="telemetry-alt" class="telemetry-val cyan">45,200 FT</span>
        </div>
        <div class="telemetry-row">
          <span class="telemetry-label">TARGET SECTOR</span>
          <span id="telemetry-sector" class="telemetry-val">ASIA // PACIFIC</span>
        </div>
        <div class="telemetry-row">
          <span class="telemetry-label">WEAPONS LOAD</span>
          <span class="telemetry-val">NUCLEAR // ARMED</span>
        </div>
      </aside>

      <!-- Center Dynamic Target Hover Preview Card -->
      <div id="target-hover-preview" class="hud-target-preview">
        <div class="target-header">
          <span id="prev-code" class="target-code">IND-01</span>
          <span class="hud-badge">LOCKED</span>
        </div>
        <div id="prev-name" class="target-name">India</div>
        <div id="prev-section" class="target-section">Professional Journey</div>
        <div class="target-cta">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m10 15 5-3-5-3v6z"/></svg>
          CLICK COUNTRY TO OPEN DOSSIER
        </div>
      </div>

      <!-- Bottom Sector Dock -->
      <footer class="hud-footer">
        <div class="hud-instruction">
          <span style="color: var(--neon-magenta);">●</span>
          DRAG GLOBE TO ROTATE // CLICK COUNTRY OR SECTOR TO ENGAGE
        </div>

        <nav class="hud-sector-dock" aria-label="Tactical Sector Navigation">
          ${Object.values(sectorData).map(sec => `
            <button class="sector-nav-btn clickable" data-sector="${sec.id}" id="btn-sec-${sec.id}">
              <span class="sec-code">[${sec.code}]</span>
              <span class="sec-title">${sec.name}</span>
            </button>
          `).join('')}
        </nav>
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
        soundBtn.classList.remove('cyan');
        soundText.textContent = 'MUTED';
      } else {
        soundBtn.classList.add('cyan');
        soundText.textContent = 'AUDIO ON';
        soundFx.playClick();
      }
    });

    // Sector Dock Buttons
    const sectorBtns = this.el.querySelectorAll('.sector-nav-btn');
    sectorBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sectorId = btn.getAttribute('data-sector');
        soundFx.playTargetLock();
        this.setActiveSector(sectorId);
        if (this.onSectorSelect) {
          this.onSectorSelect(sectorId);
        }
      });
    });
  }

  setActiveSector(sectorId) {
    this.activeSector = sectorId;
    const sectorBtns = this.el.querySelectorAll('.sector-nav-btn');
    sectorBtns.forEach(btn => {
      if (btn.getAttribute('data-sector') === sectorId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

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
      // Dynamic Mach fluctuation (2.20 - 2.45)
      const mach = (2.20 + Math.random() * 0.25).toFixed(2);
      if (machEl) machEl.textContent = `MACH ${mach}`;

      // Dynamic Altitude fluctuation (44,800 - 45,600 FT)
      const alt = Math.floor(44800 + Math.random() * 800);
      if (altEl) altEl.textContent = `${alt.toLocaleString()} FT`;
    }, 1200);
  }
}
