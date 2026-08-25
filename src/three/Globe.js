import * as THREE from 'three';
import { sectorData } from '../data/portfolioData.js';
import { soundFx } from '../effects/SoundFx.js';

/**
 * 3D Interactive Tactical Globe (Khroma Palette Edition)
 * Countries are rendered and prominently labeled directly on the globe surface.
 * Clicking a country on the globe opens its corresponding category dossier.
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
    this.labels = [];
    this.hoveredBeacon = null;
    this.autoRotate = true;

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
    // 1. Base Dark Plum/Amethyst Obsidian Sphere (#210a2d / #371E4D)
    const sphereGeo = new THREE.SphereGeometry(this.radius, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x210a2d,
      roughness: 0.75,
      metalness: 0.35,
      emissive: 0x371E4D,
      emissiveIntensity: 0.5
    });
    this.baseGlobe = new THREE.Mesh(sphereGeo, globeMat);
    this.group.add(this.baseGlobe);

    // 2. Tactical Lat/Long Wireframe Grid
    const gridGeo = new THREE.SphereGeometry(this.radius + 0.05, 36, 18);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0xB2094D,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    this.group.add(gridMesh);

    // 3. Procedural Landmass Coordinate Cloud with Khroma Tints
    this.createProceduralLandmass();

    // 4. Glowing Magenta Atmospheric Halo Shader
    this.createAtmosphere();

    // 5. Interactive Country Beacons & On-Globe Labels (India, China, etc.)
    this.createCountryBeaconsOnGlobe();

    // 6. Supersonic Flight Trajectory Arcs
    this.createFlightArcs();

    // Default orientation centered on Asia (India / China)
    this.group.rotation.y = -THREE.MathUtils.degToRad(78);
    this.group.rotation.x = THREE.MathUtils.degToRad(12);

    this.scene.add(this.group);
  }

  createAtmosphere() {
    const atmosGeo = new THREE.SphereGeometry(this.radius * 1.16, 64, 64);
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
          float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
          gl_FragColor = vec4(0.7, 0.04, 0.3, 1.0) * intensity * 1.8;
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
    const pointCount = 3800;
    const positions = [];
    const colors = [];

    const colMagenta = new THREE.Color(0xB2094D);
    const colRose = new THREE.Color(0xEDDBD8);
    const colPlum = new THREE.Color(0x771450);
    const colMauve = new THREE.Color(0xD4B4BD);

    for (let i = 0; i < pointCount; i++) {
      let lat, lng;
      const regionRand = Math.random();

      if (regionRand < 0.60) {
        // Asia focus: India, China, Japan, SE Asia, Middle East
        lat = 5 + Math.random() * 52;
        lng = 58 + Math.random() * 88;
      } else if (regionRand < 0.78) {
        lat = -30 + Math.random() * 90;
        lng = -20 + Math.random() * 80;
      } else if (regionRand < 0.92) {
        lat = -50 + Math.random() * 115;
        lng = -125 + Math.random() * 85;
      } else {
        lat = -40 + Math.random() * 45;
        lng = 110 + Math.random() * 70;
      }

      const pos = this.latLngToVector3(lat, lng, 0.12 + Math.random() * 0.1);
      positions.push(pos.x, pos.y, pos.z);

      const r = Math.random();
      const mixedColor = r > 0.6 ? colMagenta : (r > 0.35 ? colRose : (r > 0.15 ? colMauve : colPlum));
      colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    pointsGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending
    });

    const pointCloud = new THREE.Points(pointsGeo, pointsMat);
    this.group.add(pointCloud);
  }

  createCountryLabelSprite(sector) {
    // Generate high-res 2D canvas texture for on-globe floating badge
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');

    // Background pill with laser border
    ctx.fillStyle = 'rgba(33, 10, 45, 0.88)';
    ctx.strokeStyle = '#B2094D';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 120, 16);
    ctx.fill();
    ctx.stroke();

    // Top indicator dot & code
    ctx.fillStyle = '#B2094D';
    ctx.beginPath();
    ctx.arc(38, 45, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 26px Orbitron, sans-serif';
    ctx.fillStyle = '#EDDBD8';
    ctx.fillText(`${sector.name.toUpperCase()} [${sector.code}]`, 60, 52);

    // Section Category Subtitle (e.g. Professional Journey, Hobbies)
    ctx.font = '600 24px Rajdhani, sans-serif';
    ctx.fillStyle = '#D4B4BD';
    ctx.fillText(`▸ ${sector.sectorTitle.toUpperCase()}`, 60, 95);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });

    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(6.5, 1.8, 1);
    return sprite;
  }

  createCountryBeaconsOnGlobe() {
    Object.values(sectorData).forEach(sector => {
      const pos = this.latLngToVector3(sector.coordinates.lat, sector.coordinates.lng, 0.1);

      const beaconGroup = new THREE.Group();
      beaconGroup.position.copy(pos);
      beaconGroup.lookAt(pos.clone().multiplyScalar(2));

      // 1. Glowing Core Sphere on globe surface
      const coreGeo = new THREE.SphereGeometry(0.65, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: sector.id === 'india' ? 0xEDDBD8 : (sector.id === 'china' ? 0xB2094D : 0xD4B4BD)
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      beaconGroup.add(coreMesh);

      // 2. Holographic Sector Light Column
      const columnGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8);
      columnGeo.rotateX(Math.PI / 2);
      const columnMat = new THREE.MeshBasicMaterial({
        color: 0xB2094D,
        transparent: true,
        opacity: 0.75
      });
      const columnMesh = new THREE.Mesh(columnGeo, columnMat);
      columnMesh.position.z = 1.6;
      beaconGroup.add(columnMesh);

      // 3. Pulsing Concentric Radar Rings
      const ringGeo = new THREE.RingGeometry(0.75, 1.05, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xB2094D,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      beaconGroup.add(ringMesh);

      // 4. On-Globe Country Name & Category Label Badge
      const labelSprite = this.createCountryLabelSprite(sector);
      labelSprite.position.z = 3.6; // Hover slightly above beacon
      beaconGroup.add(labelSprite);

      // 5. Large Raycasting Hitbox for Easy Clicking on Globe
      const hitGeo = new THREE.SphereGeometry(2.8, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { sector: sector, beaconGroup: beaconGroup, sprite: labelSprite };
      beaconGroup.add(hitMesh);

      this.group.add(beaconGroup);

      this.beacons.push({
        sector: sector,
        group: beaconGroup,
        ring: ringMesh,
        core: coreMesh,
        sprite: labelSprite,
        hitMesh: hitMesh
      });
    });
  }

  createFlightArcs() {
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

      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(this.radius + dist * 0.38);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcMat = new THREE.LineBasicMaterial({
        color: 0xB2094D,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });

      const arcLine = new THREE.Line(arcGeo, arcMat);
      this.group.add(arcLine);

      // Tactical Traveling Pulse along flight route
      const photonGeo = new THREE.SphereGeometry(0.24, 8, 8);
      const photonMat = new THREE.MeshBasicMaterial({
        color: 0xEDDBD8,
        blending: THREE.AdditiveBlending
      });
      const photonMesh = new THREE.Mesh(photonGeo, photonMat);
      this.group.add(photonMesh);

      this.flightArcs.push({
        curve: curve,
        mesh: photonMesh,
        speed: 0.0035 + Math.random() * 0.002,
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

    return {
      rotY: -THREE.MathUtils.degToRad(targetLng),
      rotX: THREE.MathUtils.degToRad(targetLat)
    };
  }

  update(time) {
    if (this.autoRotate) {
      this.group.rotation.y += 0.0015;
    }

    // Pulse radar rings on globe
    this.beacons.forEach((b, idx) => {
      const pulse = Math.sin(time * 3.8 + idx) * 0.5 + 0.5;
      b.ring.scale.set(1.0 + pulse * 1.3, 1.0 + pulse * 1.3, 1.0);
      b.ring.material.opacity = Math.max(0.1, 0.9 - pulse * 0.8);

      const isHovered = (this.hoveredBeacon === b);
      const targetScale = isHovered ? 1.35 : 1.0;
      b.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.18);
    });

    // Advance traveling missiles
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
