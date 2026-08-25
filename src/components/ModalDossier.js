import { pilotProfile, sectorData } from '../data/portfolioData.js';
import { soundFx } from '../effects/SoundFx.js';

/**
 * Tactical Mission Dossier Modal Component
 * Renders glassmorphic tactical slide-out dossier cards for each sector.
 */

export class ModalDossier {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.activeSectorId = null;

    this.render();
  }

  render() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'dossier-modal-overlay';
    this.overlay.id = 'dossier-overlay';

    this.overlay.innerHTML = `
      <div class="dossier-modal" id="dossier-modal">
        <div class="modal-corner-tl"></div>
        <div class="modal-corner-bl"></div>

        <div class="modal-header">
          <div class="modal-title-group">
            <div class="modal-sector-code">
              <span class="status-dot"></span>
              <span id="modal-sec-code">IND-01</span> // <span id="modal-sec-name">INDIA</span>
            </div>
            <div id="modal-title" class="modal-title">Professional Journey</div>
            <div id="modal-subtitle" class="modal-subtitle">Career Trajectory & Operational Milestones</div>
          </div>

          <button id="modal-close-btn" class="modal-close-btn clickable" title="Close Dossier (ESC)">
            ✕
          </button>
        </div>

        <div id="modal-content" class="modal-body">
          <!-- Dynamic Sector Body Injected Here -->
        </div>
      </div>
    `;

    this.container.appendChild(this.overlay);
    this.bindEvents();
  }

  bindEvents() {
    // Close button
    const closeBtn = this.overlay.querySelector('#modal-close-btn');
    closeBtn.addEventListener('click', () => this.close());

    // Click outside modal to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Keyboard ESC to close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(sectorId) {
    const sector = sectorData[sectorId];
    if (!sector) return;

    this.activeSectorId = sectorId;

    // Set Header
    this.overlay.querySelector('#modal-sec-code').textContent = sector.code;
    this.overlay.querySelector('#modal-sec-name').textContent = sector.name.toUpperCase();
    this.overlay.querySelector('#modal-title').textContent = sector.sectorTitle;
    this.overlay.querySelector('#modal-subtitle').textContent = sector.subtitle;

    // Populate Body
    const contentEl = this.overlay.querySelector('#modal-content');
    contentEl.innerHTML = this.generateSectorContent(sector);

    this.overlay.classList.add('active');
  }

  close() {
    soundFx.playClick();
    this.overlay.classList.remove('active');
    this.activeSectorId = null;
    if (this.onClose) {
      this.onClose();
    }
  }

  generateSectorContent(sector) {
    switch (sector.id) {
      case 'india':
        return this.renderIndiaExperience(sector);
      case 'china':
        return this.renderChinaHobbies(sector);
      case 'japan':
        return this.renderJapanProjects(sector);
      case 'singapore':
        return this.renderSingaporeSkills(sector);
      case 'uae':
        return this.renderUaeDossier(sector);
      default:
        return `<div class="dossier-summary-card">${sector.summary}</div>`;
    }
  }

  // 🇮🇳 INDIA: Professional Journey & Timeline
  renderIndiaExperience(sector) {
    return `
      <div class="dossier-summary-card">
        ${sector.summary}
      </div>

      <div class="tactical-stats-grid">
        ${sector.tacticalStats.map(st => `
          <div class="stat-box">
            <span class="stat-label">${st.label}</span>
            <span class="stat-value">${st.value}</span>
          </div>
        `).join('')}
      </div>

      <div class="timeline-list">
        ${sector.timeline.map(item => `
          <div class="timeline-item">
            <div class="timeline-period">${item.period}</div>
            <div class="timeline-role">${item.role}</div>
            <div class="timeline-org">${item.organization} // ${item.location}</div>
            <p class="timeline-desc">${item.description}</p>
            <ul class="timeline-highlights">
              ${item.highlights.map(hl => `<li>${hl}</li>`).join('')}
            </ul>
            <div class="tag-cloud">
              ${item.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 🇨🇳 CHINA: Hobbies & Passions
  renderChinaHobbies(sector) {
    return `
      <div class="dossier-summary-card">
        ${sector.summary}
      </div>

      <div class="hobbies-grid">
        ${sector.hobbies.map(hobby => `
          <div class="hobby-card">
            <div class="hobby-header">
              <span class="hobby-title">
                <span style="color: var(--neon-pink);">✦</span>
                ${hobby.title}
              </span>
              <span class="hobby-level">${hobby.level}</span>
            </div>
            <p class="hobby-desc">${hobby.description}</p>
            <div class="hobby-quote">"${hobby.quote}"</div>
          </div>
        `).join('')}
      </div>

      <div class="dossier-summary-card" style="border-left-color: var(--neon-amber); margin-top: 8px;">
        <span style="color: var(--neon-amber); font-weight: 700; font-family: var(--font-hud);">TACTICAL PHILOSOPHY:</span>
        <p style="margin-top: 4px; font-style: italic;">"${sector.quote}"</p>
      </div>
    `;
  }

  // 🇯🇵 JAPAN: Tactical Projects
  renderJapanProjects(sector) {
    return `
      <div class="dossier-summary-card">
        ${sector.summary}
      </div>

      <div class="projects-grid">
        ${sector.projects.map(proj => `
          <div class="project-card">
            <div class="project-header">
              <div class="project-name">${proj.name}</div>
              <div class="hud-badge cyan">${proj.status}</div>
            </div>
            <div class="project-type">${proj.type}</div>
            <p class="project-desc">${proj.description}</p>
            <div class="tag-cloud">
              ${proj.tech.map(t => `<span class="tag-pill">${t}</span>`).join('')}
            </div>
            <div class="project-links">
              <a href="${proj.repoUrl}" target="_blank" rel="noreferrer" class="project-btn clickable">
                SOURCE ARTIFACT ↗
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 🇸🇬 SINGAPORE: Tech Arsenal
  renderSingaporeSkills(sector) {
    return `
      <div class="dossier-summary-card">
        ${sector.summary}
      </div>

      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${sector.categories.map(cat => `
          <div class="skill-category">
            <div class="skill-category-title">
              <span style="color: var(--neon-magenta);">▸</span>
              ${cat.category}
            </div>
            <div class="skills-pill-group">
              ${cat.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 🇦🇪 UAE: Pilot Dossier & Comms
  renderUaeDossier(sector) {
    return `
      <div class="dossier-summary-card">
        ${sector.summary}
      </div>

      <div class="comms-terminal">
        <div class="terminal-status-row">
          <span>CALLSIGN: ${pilotProfile.callsign}</span>
          <span style="color: var(--neon-amber);">${pilotProfile.status}</span>
        </div>
        <div class="terminal-status-row">
          <span>SECURITY CLEARANCE:</span>
          <span>${pilotProfile.clearance}</span>
        </div>
        <div class="terminal-status-row">
          <span>BASE OF OPERATIONS:</span>
          <span>${pilotProfile.location}</span>
        </div>
      </div>

      <div class="direct-email-box">
        <div style="font-size: 10px; color: var(--neon-cyan); margin-bottom: 4px;">SECURE COMMS FREQUENCY:</div>
        <div>${sector.contactInfo.email}</div>
      </div>

      <a href="mailto:${sector.contactInfo.email}" class="action-cta-btn clickable">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        TRANSMIT INQUIRY // HIRE ME
      </a>
    `;
  }
}
