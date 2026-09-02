/**
 * Category Dossier Tactical Modal Component
 * Displays comprehensive details for each fighter jet category
 */

import { tacticalAudio } from '../effects/TacticalAudio.js';
import { jetCategories, pilotProfile } from '../data/portfolioData.js';

export class CategoryDossierModal {
  constructor(containerElement) {
    this.container = containerElement;
    this.modal = null;
    this.activeCategory = null;
    this.init();
  }

  init() {
    // Create modal element
    this.modal = document.createElement('dialog');
    this.modal.id = 'category-dossier-modal';
    this.modal.className = 'dossier-dialog';
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('aria-label', 'Tactical Category Dossier');

    this.container.appendChild(this.modal);

    // Event listeners
    this.modal.addEventListener('click', (e) => {
      // Close when clicking outside modal box
      const rect = this.modal.getBoundingClientRect();
      const isInDialog = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      if (!isInDialog) {
        this.close();
      }
    });

    this.modal.addEventListener('cancel', () => {
      tacticalAudio.playDossierClose();
    });
  }

  open(categoryId) {
    const category = jetCategories.find(c => c.id === categoryId);
    if (!category) return;

    this.activeCategory = category;
    tacticalAudio.playDossierOpen();

    this.renderContent(category);
    this.modal.showModal();
    document.body.classList.add('modal-open');
  }

  close() {
    tacticalAudio.playDossierClose();
    this.modal.close();
    document.body.classList.remove('modal-open');
  }

  renderContent(cat) {
    let bodyHtml = '';

    if (cat.id === 'f22-career') {
      bodyHtml = this.renderCareerContent(cat);
    } else if (cat.id === 'rafale-hobbies') {
      bodyHtml = this.renderHobbiesContent(cat);
    } else if (cat.id === 'su57-projects') {
      bodyHtml = this.renderProjectsContent(cat);
    } else if (cat.id === 'typhoon-skills') {
      bodyHtml = this.renderSkillsContent(cat);
    } else if (cat.id === 'f35-comms') {
      bodyHtml = this.renderCommsContent(cat);
    }

    this.modal.innerHTML = `
      <div class="dossier-card">
        <!-- Modal Tactical Header -->
        <div class="dossier-header">
          <div class="dossier-meta">
            <div class="dossier-badge-row">
              <span class="dossier-code">${cat.categoryCode}</span>
              <span class="dossier-jet-tag">${cat.jetName}</span>
              <span class="dossier-speed-tag">${cat.jetSpeed}</span>
            </div>
            <h2 class="dossier-title">${cat.categoryTitle}</h2>
            <p class="dossier-subtitle">${cat.categorySubtitle}</p>
          </div>
          <button class="dossier-close-btn" id="dossier-close-btn" aria-label="Close Dossier">
            <span class="close-icon">✕</span>
            <span class="close-text">ESC // CLOSE</span>
          </button>
        </div>

        <!-- Jet Preview Banner -->
        <div class="dossier-jet-banner">
          <img src="${cat.jetImage}" alt="${cat.jetName}" class="dossier-banner-img ${cat.side === 'left' ? 'face-right' : 'face-left'}" />
          <div class="dossier-banner-text">
            <span class="jet-designation">${cat.jetDesignation}</span>
            <p class="jet-summary">${cat.summary}</p>
          </div>
        </div>

        <!-- Modal Dynamic Body -->
        <div class="dossier-body">
          ${bodyHtml}
        </div>

        <!-- Modal Tactical Footer -->
        <div class="dossier-footer">
          <div class="footer-telemetry">
            <span>TACTICAL DOSSIER // SECURE CHANNEL</span>
            <span>CLEARANCE: LEVEL 5 TOP SECRET</span>
          </div>
          <div class="footer-actions">
            <button class="dossier-btn-secondary" id="dossier-dismiss-btn">CLOSE DOSSIER</button>
          </div>
        </div>
      </div>
    `;

    // Attach listeners
    this.modal.querySelector('#dossier-close-btn')?.addEventListener('click', () => this.close());
    this.modal.querySelector('#dossier-dismiss-btn')?.addEventListener('click', () => this.close());

    // Attach custom category listeners
    if (cat.id === 'f35-comms') {
      this.attachCommsListeners();
    }
  }

  // --- Category 1: Career Timeline Renderer ---
  renderCareerContent(cat) {
    const { timeline, stats } = cat.content;

    const statsHtml = stats.map(s => `
      <div class="stat-pill">
        <span class="stat-val">${s.value}</span>
        <span class="stat-lbl">${s.label}</span>
      </div>
    `).join('');

    const timelineHtml = timeline.map(item => `
      <div class="timeline-entry">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-period">${item.period}</span>
            <span class="timeline-location">${item.location}</span>
          </div>
          <h3 class="timeline-role">${item.role}</h3>
          <h4 class="timeline-org">${item.organization}</h4>
          <p class="timeline-desc">${item.description}</p>
          <ul class="timeline-highlights">
            ${item.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
          <div class="tech-tag-list">
            ${item.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="stats-bar-grid">${statsHtml}</div>
      <div class="section-divider"><span>MISSION LOG // CHRONOLOGY</span></div>
      <div class="timeline-container">${timelineHtml}</div>
    `;
  }

  // --- Category 2: Hobbies Renderer ---
  renderHobbiesContent(cat) {
    const { hobbies } = cat.content;
    const hobbyCards = hobbies.map(h => `
      <div class="hobby-card">
        <div class="hobby-top">
          <span class="hobby-badge">${h.level}</span>
        </div>
        <h3 class="hobby-title">${h.title}</h3>
        <p class="hobby-desc">${h.description}</p>
        <div class="hobby-quote">
          <span class="quote-mark">“</span>
          <em>${h.quote}</em>
        </div>
      </div>
    `).join('');

    return `
      <div class="hobbies-grid">
        ${hobbyCards}
      </div>
    `;
  }

  // --- Category 3: Projects Renderer ---
  renderProjectsContent(cat) {
    const { projects } = cat.content;
    const projectCards = projects.map(p => `
      <div class="project-card">
        <div class="project-header">
          <div class="project-meta">
            <span class="project-type">${p.type}</span>
            <span class="project-status">${p.status}</span>
          </div>
          <h3 class="project-name">${p.name}</h3>
        </div>
        <p class="project-desc">${p.description}</p>
        <ul class="project-highlights">
          ${p.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
        <div class="tech-tag-list">
          ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-actions">
          <a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" class="dossier-btn-outline">
            <span>GITHUB CODE</span> ↗
          </a>
        </div>
      </div>
    `).join('');

    return `
      <div class="projects-grid">
        ${projectCards}
      </div>
    `;
  }

  // --- Category 4: Skills Loadout Renderer ---
  renderSkillsContent(cat) {
    const { skillCategories } = cat.content;
    const categorySections = skillCategories.map(group => `
      <div class="skill-group-card">
        <h3 class="skill-group-title">${group.title}</h3>
        <div class="skills-list">
          ${group.skills.map(s => `
            <div class="skill-bar-row">
              <div class="skill-label-row">
                <span class="skill-name">${s.name}</span>
                <span class="skill-level">${s.level}%</span>
              </div>
              <div class="skill-track">
                <div class="skill-fill" style="width: ${s.level}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    return `
      <div class="skills-grid">
        ${categorySections}
      </div>
    `;
  }

  // --- Category 5: Pilot Comms Terminal Renderer ---
  renderCommsContent(cat) {
    const { profile } = cat.content;

    return `
      <div class="comms-grid">
        <!-- Left Column: Pilot ID Card -->
        <div class="pilot-id-card">
          <div class="pilot-id-header">
            <span class="pilot-callsign">${pilotProfile.callsign}</span>
            <span class="pilot-status-live">● ACTIVE</span>
          </div>
          <h3 class="pilot-full-name">${pilotProfile.name}</h3>
          <span class="pilot-designation">${pilotProfile.title}</span>
          <p class="pilot-bio">${pilotProfile.bio}</p>

          <div class="pilot-meta-list">
            <div class="meta-row">
              <span class="meta-label">COORDINATES</span>
              <span class="meta-val">${pilotProfile.coordinates}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">CLEARANCE</span>
              <span class="meta-val">${profile.clearance}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">STATUS</span>
              <span class="meta-val">${profile.availability}</span>
            </div>
          </div>

          <div class="comms-copy-box">
            <span class="email-display">${profile.email}</span>
            <button class="copy-email-btn" id="copy-email-btn">
              <span>COPY EMAIL</span>
            </button>
          </div>
          <div id="copy-status" class="copy-status"></div>

          <div class="pilot-social-links">
            <a href="${pilotProfile.socials.github}" target="_blank" rel="noopener" class="social-btn">GITHUB</a>
            <a href="${pilotProfile.socials.linkedin}" target="_blank" rel="noopener" class="social-btn">LINKEDIN</a>
            <a href="${pilotProfile.socials.twitter}" target="_blank" rel="noopener" class="social-btn">TWITTER</a>
          </div>
        </div>

        <!-- Right Column: Direct Comms Transmission Form -->
        <div class="transmission-terminal">
          <div class="terminal-header">
            <span class="terminal-title">TRANSMIT DIRECT DISPATCH</span>
            <span class="terminal-freq">FREQ: 142.85 MHz</span>
          </div>
          <form id="transmission-form" class="transmission-form">
            <div class="form-group">
              <label for="pilot-sender-callsign">SENDER CALLSIGN / NAME</label>
              <input type="text" id="pilot-sender-callsign" placeholder="e.g. Commander Smith // Tech Vanguard" required />
            </div>
            <div class="form-group">
              <label for="pilot-sender-email">FREQUENCY / RETURN EMAIL</label>
              <input type="email" id="pilot-sender-email" placeholder="e.g. commander@orbit.io" required />
            </div>
            <div class="form-group">
              <label for="pilot-transmission-body">TACTICAL MISSION BRIEF</label>
              <textarea id="pilot-transmission-body" rows="4" placeholder="Describe the mission parameters, project timeline, or role specifications..." required></textarea>
            </div>
            <button type="submit" class="transmit-btn" id="transmit-btn">
              <span>TRANSMIT PARAMETERS</span> ⚡
            </button>
            <div id="transmission-feedback" class="transmission-feedback"></div>
          </form>
        </div>
      </div>
    `;
  }

  attachCommsListeners() {
    const copyBtn = this.modal.querySelector('#copy-email-btn');
    const copyStatus = this.modal.querySelector('#copy-status');
    if (copyBtn && copyStatus) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(pilotProfile.socials.email);
          copyStatus.textContent = '✓ FREQUENCY COPIED TO CLIPBOARD';
          copyStatus.classList.add('active');
          tacticalAudio.playLineHover();
          setTimeout(() => {
            copyStatus.classList.remove('active');
          }, 3000);
        } catch (e) {
          copyStatus.textContent = `Email: ${pilotProfile.socials.email}`;
          copyStatus.classList.add('active');
        }
      });
    }

    const form = this.modal.querySelector('#transmission-form');
    const feedback = this.modal.querySelector('#transmission-feedback');
    if (form && feedback) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
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
}
