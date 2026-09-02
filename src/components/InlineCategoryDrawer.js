/**
 * Inline Category Drawer Content Renderer
 * Generates rich in-place content for each fighter jet category without popup modals
 */

import { pilotProfile } from '../data/portfolioData.js';

export class InlineCategoryDrawer {
  static renderDrawer(cat) {
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

    return `
      <div class="inline-drawer-wrapper">
        <div class="inline-drawer-inner">
          <div class="inline-drawer-header">
            <div class="drawer-header-left">
              <span class="drawer-code">${cat.categoryCode}</span>
              <span class="drawer-jet-name">${cat.jetName}</span>
              <span class="drawer-speed">${cat.jetSpeed}</span>
            </div>
            <div class="drawer-header-right">
              <span class="drawer-status-pill">● LIVE IN-FLOW</span>
            </div>
          </div>
          <div class="inline-drawer-body">
            ${bodyHtml}
          </div>
        </div>
      </div>
    `;
  }

  // --- Category 1: Career Timeline ---
  static renderCareerContent(cat) {
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

  // --- Category 2: Hobbies & Passions ---
  static renderHobbiesContent(cat) {
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

  // --- Category 3: Projects Showcase ---
  static renderProjectsContent(cat) {
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

  // --- Category 4: Skills Loadout ---
  static renderSkillsContent(cat) {
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

  // --- Category 5: Pilot Comms Terminal ---
  static renderCommsContent(cat) {
    const { profile } = cat.content;

    return `
      <div class="comms-grid">
        <!-- Left Column: Pilot ID Card -->
        <div class="pilot-id-card">
          <div class="pilot-id-header">
            <span class="pilot-callsign">${pilotProfile.callsign}</span>
            <span class="pilot-status-live">● ACTIVE FOR HIRE</span>
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
            <button class="copy-email-btn" id="inline-copy-email-btn">
              <span>COPY EMAIL</span>
            </button>
          </div>
          <div id="inline-copy-status" class="copy-status"></div>

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
          <form id="inline-transmission-form" class="transmission-form">
            <div class="form-group">
              <label for="inline-sender-callsign">SENDER CALLSIGN / NAME</label>
              <input type="text" id="inline-sender-callsign" placeholder="e.g. Commander Smith // Tech Vanguard" required />
            </div>
            <div class="form-group">
              <label for="inline-sender-email">FREQUENCY / RETURN EMAIL</label>
              <input type="email" id="inline-sender-email" placeholder="e.g. commander@orbit.io" required />
            </div>
            <div class="form-group">
              <label for="inline-transmission-body">TACTICAL MISSION BRIEF</label>
              <textarea id="inline-transmission-body" rows="4" placeholder="Describe the mission parameters, project timeline, or role specifications..." required></textarea>
            </div>
            <button type="submit" class="transmit-btn" id="inline-transmit-btn">
              <span>TRANSMIT PARAMETERS</span> ⚡
            </button>
            <div id="inline-transmission-feedback" class="transmission-feedback"></div>
          </form>
        </div>
      </div>
    `;
  }
}
