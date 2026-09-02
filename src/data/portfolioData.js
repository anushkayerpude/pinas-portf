/**
 * Fighter Jet Tactical Portfolio Data Configuration
 * Configures the 5 fighter jet categories, pilot credentials, project dossiers, and skills loadout.
 */

export const pilotProfile = {
  callsign: "VIPER-01",
  name: "Anushka Yerpude",
  title: "Full-Stack Systems Engineer & Creative Technologist",
  status: "COMBAT READY // AVAILABLE FOR HIRE",
  location: "Sector IND // Earth Orbit",
  clearance: "TOP SECRET // LEVEL 5 ACCESS",
  bio: "Architecting high-performance web systems, real-time 3D interactive graphics, and resilient distributed platforms. Operating at the intersection of aerospace-grade engineering precision, creative shader art, and scalable architecture.",
  coordinates: "20.5937° N, 78.9629° E",
  socials: {
    github: "https://github.com/anushkayerpude",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "anushkayerpude@gmail.com"
  }
};

export const jetCategories = [
  {
    id: "f22-career",
    sectorIndex: 1,
    side: "left", // Wireframe Left (Angled Front-Right)
    jetName: "Lockheed Martin F-22 Raptor",
    jetDesignation: "5TH-GEN AIR SUPERIORITY STEALTH",
    jetSpeed: "MACH 2.25 SUPERCRUISE",
    jetImage: "/assets/jets/f22.png",
    categoryCode: "SEC-01",
    categoryTitle: "CAREER & EXPEDITIONS",
    categorySubtitle: "Operational Milestones // Leadership Timeline",
    accentColor: "#d47a9e",
    summary: "A battle-tested timeline of full-stack engineering leadership, scalable distributed architectures, and mission-critical web applications.",
    badge: "MISSION TIMELINE",
    content: {
      timeline: [
        {
          period: "2024 — PRESENT",
          role: "Senior Full-Stack Engineer / Flight Lead",
          organization: "Advanced Systems Lab",
          location: "Global // Distributed",
          description: "Spearheaded the architecture and deployment of high-throughput real-time data pipelines and interactive 3D WebGL portals. Reduced frontend bundle latency by 45% and scaled microservices to 100k+ concurrent telemetry requests.",
          highlights: [
            "Built high-performance WebGL telemetry visualizers with 60 FPS real-time data streaming.",
            "Engineered resilient serverless microservices with automated failover and 99.99% uptime.",
            "Mentored junior engineers and instituted military-grade code review standards."
          ],
          tags: ["React / Next.js", "Three.js", "Node.js", "TypeScript", "AWS Cloud", "WebSockets"]
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
          tags: ["Vue / React", "Vanilla CSS3", "GraphQL", "Web Workers", "Jest / Vitest"]
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
          tags: ["JavaScript ES6+", "Python", "PostgreSQL", "Docker", "Git CI/CD"]
        }
      ],
      stats: [
        { label: "MISSIONS COMPLETED", value: "48+" },
        { label: "CODE FLIGHT HOURS", value: "6,500+" },
        { label: "UPTIME RELIABILITY", value: "99.98%" },
        { label: "COFFEE TO CODE EFFICIENCY", value: "100%" }
      ]
    }
  },
  {
    id: "rafale-hobbies",
    sectorIndex: 2,
    side: "right", // Wireframe Right (Angled Front-Left)
    jetName: "Dassault Rafale",
    jetDesignation: "4.5+ OMNIROLE CANARD-DELTA FIGHTER",
    jetSpeed: "MACH 1.8 / SPECTRA EW",
    jetImage: "/assets/jets/rafale.png",
    categoryCode: "SEC-02",
    categoryTitle: "HOBBIES & CREATIVE PURSUITS",
    categorySubtitle: "Aviation Sims // Shaders // Audio Synthesis",
    accentColor: "#f2b8cc",
    summary: "When stepping out of the engineering cockpit: exploring high-fidelity military flight sims, creative GLSL shader mathematics, synthesizer audio design, and astrophotography.",
    badge: "OFF-DUTY MISSIONS",
    content: {
      hobbies: [
        {
          title: "Aviation & Combat Flight Simulators",
          icon: "plane",
          level: "ACE PILOT // TOP GUN",
          description: "Passionate about high-fidelity military flight simulation (DCS World, MSFS). Studying aerodynamic physics, basic fighter maneuvers (BFM), dogfight BVR tactics, and cockpit avionics of modern 5th-gen stealth fighters.",
          quote: "Speed is life, altitude is life insurance."
        },
        {
          title: "Creative 3D Shaders & Math Art",
          icon: "sparkles",
          level: "GLSL SHADER ARCHITECT",
          description: "Crafting procedural particle universes, raymarching fractal terrains, and audio-reactive WebGL shaders using Three.js and raw GLSL. Finding beauty in the mathematical equations behind light, optics, and physics.",
          quote: "Transforming raw linear algebra into visual poetry."
        },
        {
          title: "Synthesizer & Modular Sound Design",
          icon: "music",
          level: "AUDIO SYNTHESIS SPECIALIST",
          description: "Designing cyberpunk soundscapes, deep sub-bass shockwaves, and retro-synthwave electronic tracks using modular VSTs, serum synthesizers, and Web Audio API procedural code generation.",
          quote: "Frequency modulation tuned to 432 Hz."
        },
        {
          title: "Tactical eSports & Strategy",
          icon: "gamepad-2",
          level: "DIAMOND STRATEGIST",
          description: "Competitive gaming in tactical shooters and real-time strategy titles. Cultivating rapid split-second decision making, situational awareness, and squad coordination under intense pressure.",
          quote: "Precision, patience, decisive execution."
        },
        {
          title: "Astrophotography & Deep Space Imaging",
          icon: "moon",
          level: "STARGAZER",
          description: "Capturing long-exposure deep space imagery, nebulae, the Milky Way galactic core, and planetary transits using motorized equatorial mounts and multi-frame stacking algorithms.",
          quote: "Looking millions of light-years into the cosmic past."
        }
      ]
    }
  },
  {
    id: "su57-projects",
    sectorIndex: 3,
    side: "left", // Wireframe Left (Angled Front-Right)
    jetName: "Sukhoi Su-57 Felon",
    jetDesignation: "5TH-GEN STEALTH MULTIROLE FIGHTER",
    jetSpeed: "MACH 2.0+ SUPER-MANEUVERABLE",
    jetImage: "/assets/jets/su57.png",
    categoryCode: "SEC-03",
    categoryTitle: "TACTICAL PROJECTS & WEAPONS LAB",
    categorySubtitle: "Flagship Software // Interactive 3D Apps",
    accentColor: "#d47a9e",
    summary: "A curated hangar of flagship web systems, open-source utilities, and high-performance interactive experiments deployed in production.",
    badge: "HANGAR ARTIFACTS",
    content: {
      projects: [
        {
          name: "Project Stealth-X",
          type: "3D Flight Radar & WebGL Telemetry",
          status: "OPERATIONAL // 60 FPS",
          description: "A real-time flight tracking engine rendering global air traffic with low-latency WebSockets, custom 3D aircraft shaders, and procedural weather Doppler overlays.",
          tech: ["Three.js", "WebSockets", "GLSL Shaders", "Node.js", "Tailwind"],
          demoUrl: "#",
          repoUrl: "https://github.com/anushkayerpude",
          highlights: [
            "Sub-50ms telemetry sync across 10,000 active aircraft entities.",
            "Hardware-accelerated instanced mesh rendering in WebGL."
          ]
        },
        {
          name: "Neural HUD Assistant",
          type: "Local AI Tactical Interface & Voice",
          status: "ACTIVE DEPLOYMENT",
          description: "Futuristic tactical HUD interface powered by on-device LLMs and Web Speech API. Provides hands-free voice command execution, contextual code analysis, and system monitoring.",
          tech: ["Web Audio API", "Gemini API", "TypeScript", "IndexedDB", "Modern CSS"],
          demoUrl: "#",
          repoUrl: "https://github.com/anushkayerpude",
          highlights: [
            "Zero-latency on-device voice recognition and tactical HUD visualization.",
            "Multi-modal situational awareness and contextual code debugging."
          ]
        },
        {
          name: "Quantum Sound Synth",
          type: "Procedural Web Audio Synthesizer",
          status: "PROTOTYPE LAB",
          description: "Web Audio API sound synthesis workstation generating cinematic sci-fi sound effects, jet afterburners, and nuclear shockwave sub-bass frequencies mathematically in real-time.",
          tech: ["Web Audio API", "Canvas 2D Engine", "JavaScript ESNext"],
          demoUrl: "#",
          repoUrl: "https://github.com/anushkayerpude",
          highlights: [
            "Zero external audio samples; 100% procedural waveform synthesis.",
            "Interactive frequency spectrum analyzer with 60 FPS canvas visualization."
          ]
        }
      ]
    }
  },
  {
    id: "typhoon-skills",
    sectorIndex: 4,
    side: "right", // Wireframe Right (Angled Front-Left)
    jetName: "Eurofighter Typhoon",
    jetDesignation: "4.5+ HIGH-AGILITY DELTA INTERCEPTOR",
    jetSpeed: "MACH 2.0 / CAPTOR-E AESA",
    jetImage: "/assets/jets/typhoon.png",
    categoryCode: "SEC-04",
    categoryTitle: "TECH ARSENAL & COMBAT SKILLS",
    categorySubtitle: "Frontend // Backend // 3D WebGL // DevOps",
    accentColor: "#f2b8cc",
    summary: "Comprehensive combat-tested competencies categorized across frontend engineering, backend systems, 3D WebGL graphics, and cloud deployment pipelines.",
    badge: "ARSENAL INVENTORY",
    content: {
      skillCategories: [
        {
          title: "Frontend & Reactive Systems",
          icon: "code",
          skills: [
            { name: "JavaScript (ESNext)", level: 98 },
            { name: "TypeScript", level: 94 },
            { name: "React & Next.js", level: 96 },
            { name: "Vue.js", level: 88 },
            { name: "Vanilla CSS3 & Modern Layouts", level: 98 },
            { name: "GSAP Motion Engine", level: 92 }
          ]
        },
        {
          title: "3D Graphics & Canvas Shaders",
          icon: "layers",
          skills: [
            { name: "Three.js & WebGL", level: 95 },
            { name: "GLSL Fragment & Vertex Shaders", level: 90 },
            { name: "Canvas 2D Particle Engines", level: 96 },
            { name: "WebGPU Modern API", level: 84 },
            { name: "Blender 3D Asset Pipeline", level: 82 }
          ]
        },
        {
          title: "Backend & Distributed Infrastructure",
          icon: "server",
          skills: [
            { name: "Node.js & Express / Fastify", level: 94 },
            { name: "Python & FastAPI", level: 90 },
            { name: "GraphQL & REST Architectures", level: 95 },
            { name: "WebSockets & Real-Time Sync", level: 92 },
            { name: "PostgreSQL & Redis Caching", level: 88 }
          ]
        },
        {
          title: "DevOps & Cloud Flight Gear",
          icon: "terminal",
          skills: [
            { name: "Docker & Containerization", level: 90 },
            { name: "AWS Cloud (S3, Lambda, CloudFront)", level: 88 },
            { name: "CI/CD Automation (GitHub Actions)", level: 94 },
            { name: "Vite & Modern Build Toolchains", level: 96 },
            { name: "Linux Shell & Scripting", level: 90 }
          ]
        }
      ]
    }
  },
  {
    id: "f35-comms",
    sectorIndex: 5,
    side: "left", // Wireframe Left (Angled Front-Right)
    jetName: "Lockheed Martin F-35 Lightning II",
    jetDesignation: "5TH-GEN ALL-WEATHER MULTIROLE STEALTH",
    jetSpeed: "MACH 1.6 / MADL SENSOR FUSION",
    jetImage: "/assets/jets/f35.png",
    categoryCode: "SEC-05",
    categoryTitle: "PILOT DOSSIER & DIRECT COMMS",
    categorySubtitle: "Transmit Mission Parameters // Hire Me",
    accentColor: "#d47a9e",
    summary: "Ready to deploy for innovative full-stack engineering missions, high-impact contracts, or collaborative 3D web experiences. Transmit your coordinates below.",
    badge: "DIRECT TRANSMISSION",
    content: {
      profile: {
        email: "anushkayerpude@gmail.com",
        location: "Sector IND // Open to Global Remote / Hybrid",
        clearance: "TOP SECRET // LEVEL 5 ACCESS",
        availability: "Available for Senior Full-Stack Roles, 3D Web & Creative Contracts",
        targetRoles: [
          "Senior Full-Stack Engineer",
          "Creative Technologist / 3D Web Specialist",
          "Frontend Architecture Specialist",
          "Interactive WebGL Developer"
        ]
      }
    }
  }
];
