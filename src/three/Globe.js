import * as THREE from 'three';
import { sectorData } from '../data/portfolioData.js';
import { soundFx } from '../effects/SoundFx.js';

/**
 * 3D Interactive Tactical Globe
 * Features custom procedural landmass shaders, pulsing sector beacons for Asia countries
 * (India = Professional Journey, China = Hobbies, etc.), flight trajectory arcs,
 * and raycasting interaction.
 */

export class TacticalGlobe {
  constructor(scene, camera, onSectorSelect, onSectorHover) {
    this.scene = scene;
    this.camera = camera;
    this.onSectorSelect = onSectorSelect;
    this.onSectorHover = onSectorHover;

    this.group = new THREE.Group();
    this.radius = 16;
    this.beacons = [];
    this.flightArcs = [];
    this.hoveredBeacon = null;
    this.autoRotate = true;
    this.targetRotationY = 0;

    this.initGlobe();
  }

  latLngToVector3(lat, lng, alt = 0) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const r = this.radius + alt;

    return new THREE.Vector3(
      -(r * Math.sin(phi) * Math.cos(theta)),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }

  initGlobe() {
    // 1. Base Dark Magenta-Obsidian Sphere
    const sphereGeo = new THREE.SphereGeometry(this.radius, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x090212,
      roughness: 0.8,
      metalness: 0.3,
      emissive: 0x140320,
      emissiveIntensity: 0.4
    });
    this.baseGlobe = new THREE.Mesh(sphereGeo, globeMat);
    this.group.add(this.baseGlobe);

    // 2. Tactical Lat/Long Wireframe Grid
    const gridGeo = new THREE.SphereGeometry(this.radius + 0.05, 36, 18);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    this.group.add(gridMesh);

    // 3. Procedural Landmass Particle Dots & Continents Focus on Asia & Global
    this.createProceduralLandmass();

    // 4. Glowing Magenta Atmospheric Halo (Custom Shader)
    this.createAtmosphere();

    // 5. Interactive Sector Beacons (India, China, Japan, Singapore, UAE)
    this.createSectorBeacons();

    // 6. Supersonic Flight Trajectory Arcs
    this.createFlightArcs();

    // Orient globe so Asia (India / China) faces camera by default
    // India is lat ~20, lng ~79.
    this.group.rotation.y = -THREE.MathUtils.degToRad(78);
    this.group.rotation.x = THREE.MathUtils.degToRad(12);

    this.scene.add(this.group);
  }

  createAtmosphere() {
    const atmosGeo = new THREE.SphereGeometry(this.radius * 1.18, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0) * intensity * 1.4;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });

    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    this.group.add(atmosphere);
  }

  createProceduralLandmass() {
    // Generate high-density tactical coordinate points mapped across real world continents
    const pointCount = 3500;
    const positions = [];
    const colors = [];

    const colorMagenta = new THREE.Color(0xff007f);
    const colorCyan = new THREE.Color(0x00f0ff);
    const colorViolet = new THREE.Color(0x8338ec);

    // Realistic density landmass generator (Asia, Europe, Africa, Americas, Oceania)
    for (let i = 0; i < pointCount; i++) {
      let lat, lng;

      // Cluster heavily on Asia & Eurasia (India, China, Japan, SE Asia, Middle East)
      const regionRand = Math.random();
      if (regionRand < 0.55) {
        // Asia / Indian subcontinent / East Asia
        lat = 5 + Math.random() * 50;
        lng = 60 + Math.random() * 85;
      } else if (regionRand < 0.75) {
        // Europe & Middle East & Africa
        lat = -30 + Math.random() * 90;
        lng = -20 + Math.random() * 80;
      } else if (regionRand < 0.90) {
        // Americas
        lat = -50 + Math.random() * 115;
        lng = -125 + Math.random() * 85;
      } else {
        // Oceania / Pacific Rim
        lat = -40 + Math.random() * 45;
        lng = 110 + Math.random() * 70;
      }

      const pos = this.latLngToVector3(lat, lng, 0.12 + Math.random() * 0.1);
      positions.push(pos.x, pos.y, pos.z);

      const mixedColor = Math.random() > 0.4 ? colorMagenta : (Math.random() > 0.5 ? colorCyan : colorViolet);
      colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    pointsGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const pointCloud = new THREE.Points(pointsGeo, pointsMat);
    this.group.add(pointCloud);
  }

  createSectorBeacons() {
    Object.values(sectorData).forEach(sector => {
      const pos = this.latLngToVector3(sector.coordinates.lat, sector.coordinates.lng, 0.1);

      const beaconGroup = new THREE.Group();
      beaconGroup.position.copy(pos);
      beaconGroup.lookAt(pos.clone().multiplyScalar(2)); // Orient normal to sphere surface

      // 1. Central Core Glowing Pip
      const coreGeo = new THREE.SphereGeometry(0.55, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: sector.id === 'india' ? 0x00f0ff : (sector.id === 'china' ? 0xffd700 : 0xff007f)
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      beaconGroup.add(coreMesh);

      // 2. Holographic Sector Pillar
      const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 8);
      pillarGeo.rotateX(Math.PI / 2);
      const pillarMat = new THREE.MeshBasicMaterial({
        color: 0xff00a0,
        transparent: true,
        opacity: 0.65
      });
      const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
      pillarMesh.position.z = 1.4;
      beaconGroup.add(pillarMesh);

      // 3. Pulsing Radar Ring
      const ringGeo = new THREE.RingGeometry(0.6, 0.85, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      beaconGroup.add(ringMesh);

      // 4. Raycasting Hitbox (Invisible sphere for smooth clicking/hovering)
      const hitGeo = new THREE.SphereGeometry(1.6, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { sector: sector, beaconGroup: beaconGroup };
      beaconGroup.add(hitMesh);

      this.group.add(beaconGroup);

      this.beacons.push({
        sector: sector,
        group: beaconGroup,
        ring: ringMesh,
        core: coreMesh,
        hitMesh: hitMesh,
        baseScale: 1.0
      });
    });
  }

  createFlightArcs() {
    // Interconnect Asian sectors: India <-> China, India <-> UAE, China <-> Japan, India <-> Singapore
    const connections = [
      ['india', 'china'],
      ['india', 'uae'],
      ['china', 'japan'],
      ['india', 'singapore'],
      ['singapore', 'japan']
    ];

    connections.forEach(([startId, endId]) => {
      const startSector = sectorData[startId];
      const endSector = sectorData[endId];
      if (!startSector || !endSector) return;

      const p1 = this.latLngToVector3(startSector.coordinates.lat, startSector.coordinates.lng, 0.1);
      const p2 = this.latLngToVector3(endSector.coordinates.lat, endSector.coordinates.lng, 0.1);

      // Calculate midpoint elevated into orbit for realistic ballistic parabolic arc
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(this.radius + dist * 0.38);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcMat = new THREE.LineBasicMaterial({
        color: 0xff007f,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });

      const arcLine = new THREE.Line(arcGeo, arcMat);
      this.group.add(arcLine);

      // Traveling Tactical Photon Missile along flight path
      const photonGeo = new THREE.SphereGeometry(0.22, 8, 8);
      const photonMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        blending: THREE.AdditiveBlending
      });
      const photonMesh = new THREE.Mesh(photonGeo, photonMat);
      this.group.add(photonMesh);

      this.flightArcs.push({
        curve: curve,
        mesh: photonMesh,
        speed: 0.003 + Math.random() * 0.002,
        progress: Math.random()
      });
    });
  }

  rotateToSector(sectorId) {
    const sector = sectorData[sectorId];
    if (!sector) return;

    this.autoRotate = false;
    const targetLng = sector.coordinates.lng;
    const targetLat = sector.coordinates.lat;

    // Smoothly calculate target Y and X rotation
    const targetRotY = -THREE.MathUtils.degToRad(targetLng);
    const targetRotX = THREE.MathUtils.degToRad(targetLat);

    return { rotX: targetRotX, rotY: targetRotY };
  }

  update(time) {
    // Subtle auto-rotation if idle
    if (this.autoRotate) {
      this.group.rotation.y += 0.0018;
    }

    // Pulse sector radar rings
    this.beacons.forEach((b, idx) => {
      const pulse = Math.sin(time * 4 + idx) * 0.5 + 0.5;
      b.ring.scale.set(1.0 + pulse * 1.2, 1.0 + pulse * 1.2, 1.0);
      b.ring.material.opacity = Math.max(0.1, 0.9 - pulse * 0.8);

      // Hover scale boost
      const targetScale = (this.hoveredBeacon === b) ? 1.4 : 1.0;
      b.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    });

    // Advance traveling missiles along flight routes
    this.flightArcs.forEach(arc => {
      arc.progress = (arc.progress + arc.speed) % 1;
      const point = arc.curve.getPoint(arc.progress);
      arc.mesh.position.copy(point);
    });
  }

  handleRaycast(raycaster) {
    const hitMeshes = this.beacons.map(b => b.hitMesh);
    const intersects = raycaster.intersectObjects(hitMeshes, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const sector = hit.userData.sector;
      const beacon = this.beacons.find(b => b.sector.id === sector.id);

      if (this.hoveredBeacon !== beacon) {
        this.hoveredBeacon = beacon;
        soundFx.playClick();
        if (this.onSectorHover) {
          this.onSectorHover(sector);
        }
      }
      return sector;
    } else {
      if (this.hoveredBeacon) {
        this.hoveredBeacon = null;
        if (this.onSectorHover) {
          this.onSectorHover(null);
        }
      }
      return null;
    }
  }

  handleClick(raycaster) {
    const hitMeshes = this.beacons.map(b => b.hitMesh);
    const intersects = raycaster.intersectObjects(hitMeshes, true);

    if (intersects.length > 0) {
      const sector = intersects[0].object.userData.sector;
      soundFx.playTargetLock();
      if (this.onSectorSelect) {
        this.onSectorSelect(sector.id);
      }
      return sector;
    }
    return null;
  }
}
