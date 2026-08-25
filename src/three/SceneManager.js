import * as THREE from 'three';
import gsap from 'gsap';
import { TacticalGlobe } from './Globe.js';
import { soundFx } from '../effects/SoundFx.js';

/**
 * Three.js Master Scene Manager (Khroma Edition)
 * Controls 3D canvas, lighting, plum-amethyst nebula dust, interactive globe with
 * on-surface country labels, and smooth globe reveal transitions.
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
    // 1. Scene & Depth Fog (#14071b)
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x14071b, 0.007);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 3, 50);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 3. Cinematic Lighting (Khroma Plum & Rose Tones)
    this.setupLighting();

    // 4. Starfield & Amethyst Dust
    this.createStarfield();

    // 5. Tactical Asia Globe with On-Globe Country Labels
    this.globe = new TacticalGlobe(
      this.scene,
      this.camera,
      (sectorId) => this.handleSectorSelected(sectorId),
      this.onSectorHover
    );

    // Initial globe scale (hidden until jet flight concludes)
    this.globe.group.scale.set(0.01, 0.01, 0.01);
    this.globe.group.position.set(0, 0, 0);

    // 6. Setup Mouse/Touch Event Listeners
    this.setupEventListeners();

    // 7. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Warm Key Sunlight
    const keyLight = new THREE.DirectionalLight(0xEDDBD8, 2.4);
    keyLight.position.set(30, 25, 40);
    this.scene.add(keyLight);

    // Vivid Magenta Rim Light
    const magentaRim = new THREE.DirectionalLight(0xB2094D, 3.8);
    magentaRim.position.set(-35, 10, -25);
    this.scene.add(magentaRim);

    // Soft Mauve Fill Light
    const mauveFill = new THREE.DirectionalLight(0xD4B4BD, 1.4);
    mauveFill.position.set(0, -25, 15);
    this.scene.add(mauveFill);

    // Deep Plum Ambient Glow
    const ambientLight = new THREE.AmbientLight(0x371E4D, 1.5);
    this.scene.add(ambientLight);
  }

  createStarfield() {
    const starCount = 2000;
    const positions = [];
    const colors = [];

    const colRose = new THREE.Color(0xEDDBD8);
    const colMagenta = new THREE.Color(0xB2094D);
    const colPlum = new THREE.Color(0x771450);

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 380;
      const y = (Math.random() - 0.5) * 380;
      const z = (Math.random() - 0.5) * 380;
      positions.push(x, y, z);

      const r = Math.random();
      const c = r > 0.65 ? colMagenta : (r > 0.35 ? colRose : colPlum);
      colors.push(c.r, c.g, c.b);
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.starfield = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starfield);
  }

  revealGlobe() {
    // Smooth zoom & pop-in animation for the Asia Globe after the F-22 exits
    gsap.fromTo(this.globe.group.scale,
      { x: 0.05, y: 0.05, z: 0.05 },
      { x: 1.0, y: 1.0, z: 1.0, duration: 1.8, ease: "elastic.out(1, 0.75)" }
    );

    gsap.fromTo(this.camera.position,
      { z: 65, y: 12 },
      { z: 48, y: 2, duration: 2.0, ease: "power2.out" }
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
    }

    if (this.onSectorSelect) {
      this.onSectorSelect(sectorId);
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());

    const dom = this.renderer.domElement;

    // Drag to rotate globe
    dom.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.globe.autoRotate = false;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    dom.addEventListener('pointermove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.globe.group.rotation.y += deltaX * 0.005;
        this.globe.group.rotation.x += deltaY * 0.005;
        this.globe.group.rotation.x = Math.max(-1.1, Math.min(1.1, this.globe.group.rotation.x));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    // Click country on globe
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
    const time = this.clock.getElapsedTime();

    if (!this.isDragging) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.globe.handleRaycast(this.raycaster);
    }

    this.globe.update(time);

    if (this.starfield) {
      this.starfield.rotation.y += 0.0003;
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }
}
