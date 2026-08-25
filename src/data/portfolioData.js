/**
 * Tactical Portfolio Data Configuration
 * Edit this file to customize your career journey, hobbies, projects, and contact info.
 */

export const pilotProfile = {
  callsign: "VIPER-01",
  name: "Anushka Yerpude",
  title: "Full-Stack Engineer & Creative Technologist",
  status: "COMBAT READY // ACTIVE FOR HIRE",
  location: "Sector IND // Earth",
  clearance: "TOP SECRET // LEVEL 5",
  bio: "Architecting high-performance web systems, 3D interactive experiences, and resilient distributed applications. Operating at the intersection of cutting-edge frontend engineering, AI integration, and aviation-grade precision.",
  coordinates: "20.5937° N, 78.9629° E",
  socials: {
    github: "https://github.com/anushkayerpude",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "anushka@example.com"
  }
};

export const sectorData = {
  india: {
    id: "india",
    code: "IND-01",
    name: "India",
    sectorTitle: "Professional Journey",
    subtitle: "Career Trajectory & Operational Milestones",
    coordinates: { lat: 20.5937, lng: 78.9629 },
    color: "#ff007f",
    accent: "#00f0ff",
    badge: "MISSION LOG // CAREER",
    summary: "A timeline of engineering leadership, scalable system development, and delivering mission-critical applications across modern tech stacks.",
    timeline: [
      {
        period: "2024 — PRESENT",
        role: "Senior Full-Stack Engineer / Flight Lead",
        organization: "Advanced Systems Lab",
        location: "Hybrid // Global",
        description: "Spearheaded the architecture and deployment of high-throughput real-time data pipelines and interactive 3D web portals. Reduced frontend bundle latency by 45% and scaled microservices to 100k+ concurrent requests.",
        highlights: [
          "Built high-performance WebGL telemetry visualizers with 60 FPS real-time data streaming.",
          "Engineered resilient serverless microservices with automated failover and 99.99% uptime.",
          "Mentored junior engineers and instituted military-grade code review standards."
        ],
        tags: ["React", "Three.js", "Node.js", "TypeScript", "AWS", "WebSockets"]
      },
      {
        period: "2022 — 2024",
        role: "Frontend Systems Specialist",
        organization: "Cybernetics Dynamics",
        location: "Bengaluru, India",
        description: "Engineered next-generation design systems and reactive dashboards. Translated complex domain workflows into fluid, intuitive user interfaces with micro-animations and zero-layout-shift UI.",
        highlights: [
          "Developed reusable component library adopted across 8 distinct internal platforms.",
          "Implemented Web Audio and Canvas-driven data dashboards with dynamic filtering.",
          "Optimized Core Web Vitals to achieve 98+ Lighthouse scores across all client products."
        ],
        tags: ["Vue / React", "Tailwind / Vanilla CSS", "GraphQL", "Web Workers", "Jest"]
      },
      {
        period: "2020 — 2022",
        role: "Software Engineering Cadet",
        organization: "Tech Vanguard Labs",
        location: "Pune, India",
        description: "Contributed to core product features, RESTful API development, database optimizations, and cross-platform mobile integration.",
        highlights: [
          "Implemented secure JWT authentication and OAuth2 SSO integration.",
          "Refactored legacy database queries, improving average response time by 60%."
        ],
        tags: ["JavaScript", "Python", "PostgreSQL", "Docker", "Git"]
      }
    ],
    tacticalStats: [
      { label: "MISSIONS COMPLETED", value: "48+" },
      { label: "CODEBASE FLIGHT HOURS", value: "6,500+" },
      { label: "UPTIME ACCURACY", value: "99.98%" },
      { label: "COFFEE TO CODE CONVERSION", value: "100%" }
    ]
  },

  china: {
    id: "china",
    code: "CHN-02",
    name: "China",
    sectorTitle: "Hobbies & Tactical Passions",
    subtitle: "Extracurricular Missions & Creative Pursuits",
    coordinates: { lat: 35.8617, lng: 104.1954 },
    color: "#ff2a8d",
    accent: "#ffd700",
    badge: "OFF-DUTY PROTOCOL",
    summary: "When stepping out of the developer cockpit, exploring the worlds of aviation simulation, creative shader coding, electronic music synthesis, and competitive gaming.",
    hobbies: [
      {
        title: "Aviation & Combat Flight Sim",
        icon: "plane",
        level: "ACE PILOT",
        description: "Passionate about high-fidelity military flight sims (DCS World, MSFS 2024). Studying aerodynamic physics, dogfight tactics (BFM), and cockpit avionics of 5th-gen stealth fighters like the F-22 Raptor and Su-57.",
        quote: "Speed is life, altitude is life insurance."
      },
      {
        title: "Creative 3D & Shader Coding",
        icon: "sparkles",
        level: "GLSL EXPERIMENTER",
        description: "Crafting procedural particle universes, raymarching fractal terrains, and audio-reactive WebGL shaders using Three.js and GLSL. Finding beauty in the mathematical equations behind light and physics.",
        quote: "Transforming raw linear algebra into visual poetry."
      },
      {
        title: "Synthesizer & Audio Design",
        icon: "music",
        level: "SOUND ARCHITECT",
        description: "Designing cyberpunk soundscapes, deep sub-bass drops, and retro-synthwave electronic tracks using modular VSTs, serum synthesizers, and Web Audio API code generation.",
        quote: "Frequency modulation at 432 Hz."
      },
      {
        title: "Tactical eSports & Strategy",
        icon: "gamepad-2",
        level: "DIAMOND STRATEGIST",
        description: "Competitive gaming in tactical shooters and real-time strategy titles. Cultivating rapid split-second decision making, situational awareness, and squad coordination under high pressure.",
        quote: "Precision, patience, execution."
      },
      {
        title: "Astrophotography & Night Sky",
        icon: "moon",
        level: "STARGAZER",
        description: "Capturing long-exposure deep space imagery, nebulae, the Milky Way core, and planetary transits using motorized equatorial tracking mounts and stacking algorithms.",
        quote: "Looking millions of light-years into the past."
      }
    ],
    quote: "Creativity is the afterburner that fuels technical mastery."
  },

  japan: {
    id: "japan",
    code: "JPN-03",
    name: "Japan",
    sectorTitle: "Tactical Projects & Operations",
    subtitle: "Deployed Systems & Open Source Artifacts",
    coordinates: { lat: 36.2048, lng: 138.2529 },
    color: "#e0115f",
    accent: "#00f0ff",
    badge: "WEAPONS LAB // PROJECTS",
    summary: "A curated hangar of flagship applications, open-source utilities, and high-performance interactive experiments deployed in the wild.",
    projects: [
      {
        name: "Project Stealth-X",
        type: "3D Flight Radar & WebGL Telemetry",
        status: "OPERATIONAL",
        description: "A real-time flight tracking engine rendering global air traffic with low-latency WebSockets, custom 3D aircraft shaders, and procedural weather Doppler overlays.",
        tech: ["Three.js", "WebSockets", "GLSL", "Node.js", "Tailwind"],
        demoUrl: "#",
        repoUrl: "https://github.com/anushkayerpude"
      },
      {
        name: "Neural HUD Assistant",
        type: "Local AI Interface & Voice Control",
        status: "ACTIVE DEPLOYMENT",
        description: "Futuristic tactical HUD interface powered by on-device LLMs and Web Speech API. Provides hands-free voice command execution, contextual code analysis, and system monitoring.",
        tech: ["Web Audio", "Gemini API", "TypeScript", "IndexedDB", "CSS3"],
        demoUrl: "#",
        repoUrl: "https://github.com/anushkayerpude"
      },
      {
        name: "Quantum Sound Synth",
        type: "Procedural Audio Synthesizer",
        status: "PROTOTYPE",
        description: "Web Audio API sound synthesis workstation generating cinematic sci-fi sound effects, jet afterburners, and nuclear shockwave sub-bass frequencies mathematically in real-time.",
        tech: ["Web Audio API", "Canvas 2D", "JavaScript ES6"],
        demoUrl: "#",
        repoUrl: "https://github.com/anushkayerpude"
      }
    ]
  },

  singapore: {
    id: "singapore",
    code: "SGP-04",
    name: "Singapore",
    sectorTitle: "Tech Arsenal & Skills Loadout",
    subtitle: "Combat-Tested Engineering Competencies",
    coordinates: { lat: 1.3521, lng: 103.8198 },
    color: "#ff00a0",
    accent: "#00f0ff",
    badge: "ARSENAL INVENTORY",
    summary: "Comprehensive technical capabilities categorized across frontend engineering, backend infrastructure, 3D graphics, and DevOps pipelines.",
    categories: [
      {
        category: "Frontend & UI Systems",
        skills: ["JavaScript (ESNext)", "TypeScript", "React / Next.js", "Vue.js", "Vanilla CSS3 / Modern Layouts", "HTML5 Semantics", "GSAP Animations", "TailwindCSS"]
      },
      {
        category: "3D Graphics & Canvas",
        skills: ["Three.js", "GLSL Shaders", "WebGL / WebGPU", "Canvas 2D Particle Engines", "SVG Morphing", "Blender 3D Modeling"]
      },
      {
        category: "Backend & Systems",
        skills: ["Node.js", "Express / Fastify", "Python / FastAPI", "GraphQL / REST APIs", "WebSockets / WebRTC", "PostgreSQL", "Redis", "MongoDB"]
      },
      {
        category: "DevOps & Cloud Flight Gear",
        skills: ["Docker & Containers", "AWS (S3, CloudFront, Lambda)", "CI/CD GitHub Actions", "Vite / Webpack", "Linux Shell / Bash", "Git & SemVer"]
      }
    ]
  },

  uae: {
    id: "uae",
    code: "UAE-05",
    name: "UAE / Middle East",
    sectorTitle: "Pilot Dossier & Comms Terminal",
    subtitle: "Establish Direct Transmission // Hire Me",
    coordinates: { lat: 23.4241, lng: 53.8478 },
    color: "#ff007f",
    accent: "#ffd700",
    badge: "DIRECT COMMS",
    summary: "Ready to deploy for innovative full-stack engineering roles, high-impact freelance missions, or collaborative 3D web experiences. Transmit your coordinates below.",
    contactInfo: {
      email: "anushka@example.com",
      status: "Available for Full-time Roles & High-Impact Contracts",
      preferredRoles: ["Senior Frontend Engineer", "Creative Technologist", "Full-Stack Developer", "3D Web Specialist"]
    }
  }
};
