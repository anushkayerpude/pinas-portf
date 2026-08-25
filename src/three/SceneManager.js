import * as THREE from 'three';
import gsap from 'gsap';
import { F22Raptor } from './F22Raptor.js';
import { TacticalGlobe } from './Globe.js';
import { soundFx } from '../effects/SoundFx.js';

/**
 * Three.js Master Scene Manager
 * Controls the 3D canvas, lighting, nebula starfield, F-22 Raptor flight paths,
 * interactive globe controls, and intro cinematic flyby sequence.
 */

export class SceneManager {
  constructor(container, onSectorSelect, onSectorHover) {
    this.container = container;
    this.onSectorSelect = onSectorSelect;
    this.onSectorHover = onSectorHover;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x08010d, 0.008);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 5, 48);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    // 3. Cinematic Lighting
    this.setupLighting();

    // 4. Starfield & Deep Nebula Particle Dust
    this.createStarfield();

    // 5. Tactical Asia Globe
    this.globe = new TacticalGlobe(
      this.scene,
      this.camera,
      (sectorId) => this.handleSectorSelected(sectorId),
      this.onSectorHover
    );

    // 6. F-22 Raptor Fighter Aircraft
    this.f22 = new F22Raptor();
    this.scene.add(this.f22.group);

    // 7. Event Listeners (Drag, Hover, Click, Resize)
    this.setupEventListeners();

    // 8. Trigger Initial Flyby Sequence
    this.triggerIntroFlyby();

    // 9. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Primary Key Sun Light (Warm White / Amber)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(30, 25, 40);
    this.scene.add(keyLight);

    // Cyber Magenta Rim Light (From back-left)
    const magentaRim = new THREE.DirectionalLight(0xff007f, 3.5);
    magentaRim.position.set(-35, 10, -25);
    this.scene.add(magentaRim);

    // Electric Cyan Fill Light (From below)
    const cyanFill = new THREE.DirectionalLight(0x00f0ff, 1.6);
    cyanFill.position.set(0, -25, 15);
    this.scene.add(cyanFill);

    // Deep Ambient Glow
    const ambientLight = new THREE.AmbientLight(0x200330, 1.4);
    this.scene.add(ambientLight);
  }

  createStarfield() {
    const starCount = 1800;
    const positions = [];
    const colors = [];

    const colWhite = new THREE.Color(0xffffff);
    const colMagenta = new THREE.Color(0xff007f);
    const colCyan = new THREE.Color(0x00f0ff);

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 350;
      const y = (Math.random() - 0.5) * 350;
      const z = (Math.random() - 0.5) * 350;
      positions.push(x, y, z);

      const r = Math.random();
      const c = r > 0.7 ? colMagenta : (r > 0.4 ? colCyan : colWhite);
      colors.push(c.r, c.g, c.b);
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.starfield = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starfield);
  }

  triggerIntroFlyby() {
    // Play jet sound & sonic boom
    soundFx.playJetFlyby();

    // Reset jet position way out in the distance
    const jet = this.f22.group;
    jet.position.set(-60, 18, -80);
    jet.rotation.set(THREE.MathUtils.degToRad(-15), THREE.MathUtils.degToRad(120), THREE.MathUtils.degToRad(35));
    jet.scale.set(0.6, 0.6, 0.6);

    // Initial globe position slightly lower
    this.globe.group.position.set(0, -1.5, 0);

    const tl = gsap.timeline();

    // 1. High-speed supersonic pass right through camera center
    tl.to(jet.position, {
      x: 18,
      y: 4,
      z: 22,
      duration: 1.3,
      ease: "power2.inOut",
      onUpdate: () => {
        if (jet.position.z > 0 && !jet.userData.boomTriggered) {
          jet.userData.boomTriggered = true;
          this.f22.triggerSonicShockwave();
        }
      }
    });

    tl.to(jet.rotation, {
      x: THREE.MathUtils.degToRad(10),
      y: THREE.MathUtils.degToRad(140),
      z: THREE.MathUtils.degToRad(-45),
      duration: 1.3,
      ease: "power2.inOut"
    }, "<");

    // 2. Bank into high tactical orbit around the globe
    tl.to(jet.position, {
      x: 14,
      y: 10,
      z: 16,
      duration: 1.8,
      ease: "power1.out"
    });

    tl.to(jet.rotation, {
      x: THREE.MathUtils.degToRad(-10),
      y: THREE.MathUtils.degToRad(205),
      z: THREE.MathUtils.degToRad(-25),
      duration: 1.8,
      ease: "power1.out",
      onComplete: () => {
        jet.userData.boomTriggered = false;
      }
    }, "<");

    // Smooth camera settle
    gsap.fromTo(this.camera.position,
      { z: 65, y: 15 },
      { z: 46, y: 3, duration: 2.5, ease: "power2.out" }
    );
  }

  handleSectorSelected(sectorId) {
    const targetRot = this.globe.rotateToSector(sectorId);
    if (targetRot) {
      gsap.to(this.globe.group.rotation, {
        y: targetRot.rotY,
        x: targetRot.rotX,
        duration: 1.2,
        ease: "power2.inOut"
      });

      // Jet maneuvers toward the engaged sector coordinates
      gsap.to(this.f22.group.position, {
        x: 12,
        y: 8,
        z: 18,
        duration: 1.4,
        ease: "power2.out"
      });
    }

    if (this.onSectorSelect) {
      this.onSectorSelect(sectorId);
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());

    // Globe Drag Rotation
    const dom = this.renderer.domElement;

    dom.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.globe.autoRotate = false;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    dom.addEventListener('pointermove', (e) => {
      // Normalize mouse coordinates for Raycasting
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.globe.group.rotation.y += deltaX * 0.005;
        this.globe.group.rotation.x += deltaY * 0.005;

        // Clamp latitude rotation so globe doesn't invert
        this.globe.group.rotation.x = Math.max(-1.1, Math.min(1.1, this.globe.group.rotation.x));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    // Sector Click
    dom.addEventListener('click', () => {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.globe.handleClick(this.raycaster);
    });

    // Zoom on wheel
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camera.position.z = Math.max(30, Math.min(65, this.camera.position.z + e.deltaY * 0.03));
    }, { passive: false });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Raycast hover test when not dragging
    if (!this.isDragging) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.globe.handleRaycast(this.raycaster);
    }

    // Update Globe
    this.globe.update(time);

    // Update F-22 Raptor Jet
    this.f22.update(time);

    // Gentle orbital patrol loop for F-22 when idle
    const orbitSpeed = 0.25;
    const orbitRadius = 24;
    this.f22.group.position.x = Math.cos(time * orbitSpeed) * orbitRadius;
    this.f22.group.position.z = Math.sin(time * orbitSpeed) * orbitRadius + 4;
    this.f22.group.rotation.y = -time * orbitSpeed - Math.PI / 2;

    // Slow starfield rotation
    if (this.starfield) {
      this.starfield.rotation.y += 0.0003;
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }
}
