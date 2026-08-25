import * as THREE from 'three';

/**
 * 3D F-22 Raptor Stealth Fighter Model Builder
 * Procedurally constructs an accurate stealth fighter geometry with diamond delta wings,
 * canted vertical stabilizers, faceted cockpit canopy, afterburner exhaust cones,
 * and dynamic supersonic vapor shockwaves.
 */

export class F22Raptor {
  constructor() {
    this.group = new THREE.Group();
    this.afterburners = [];
    this.vaporCones = [];
    this.flameMaterials = [];

    this.buildModel();
  }

  buildModel() {
    // 1. Materials with stealth matte finish and neon magenta accents
    const stealthBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x181528,
      roughness: 0.35,
      metalness: 0.85,
      flatShading: true
    });

    const stealthUnderMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f0b1a,
      roughness: 0.45,
      metalness: 0.9,
      flatShading: true
    });

    const edgeLaserMaterial = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    const canopyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      metalness: 0.95,
      ior: 1.5,
      reflectivity: 0.9
    });

    const exhaustNozzleMaterial = new THREE.MeshStandardMaterial({
      color: 0x080810,
      metalness: 0.95,
      roughness: 0.2
    });

    const afterburnerCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95
    });

    const afterburnerFlameMaterial = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.flameMaterials.push(afterburnerFlameMaterial);

    // 2. Main Fuselage & Diamond Delta Wings (Procedural Custom Extruded Geometry)
    const wingShape = new THREE.Shape();
    // Top-down stealth profile of F-22 (Z is longitudinal, X is lateral)
    wingShape.moveTo(0, 7.5);           // Nose tip
    wingShape.lineTo(1.2, 4.0);         // Forward chine
    wingShape.lineTo(6.8, -1.5);        // Right wingtip leading edge
    wingShape.lineTo(6.2, -3.2);        // Right wingtip trailing edge
    wingShape.lineTo(2.4, -2.8);        // Right wing root
    wingShape.lineTo(3.2, -6.5);        // Right horizontal stabilizer outer
    wingShape.lineTo(1.8, -6.8);        // Right stabilizer tip
    wingShape.lineTo(1.4, -5.8);        // Right engine nozzle outer
    wingShape.lineTo(0.5, -5.5);        // Center tail spine
    wingShape.lineTo(0, -5.2);          // Center aft
    wingShape.lineTo(-0.5, -5.5);       // Left center tail
    wingShape.lineTo(-1.4, -5.8);       // Left engine nozzle outer
    wingShape.lineTo(-1.8, -6.8);       // Left stabilizer tip
    wingShape.lineTo(-3.2, -6.5);       // Left horizontal stabilizer outer
    wingShape.lineTo(-2.4, -2.8);       // Left wing root
    wingShape.lineTo(-6.2, -3.2);       // Left wingtip trailing edge
    wingShape.lineTo(-6.8, -1.5);       // Left wingtip leading edge
    wingShape.lineTo(-1.2, 4.0);        // Left forward chine
    wingShape.closePath();

    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.35,
      bevelThickness: 0.25
    };

    const wingGeometry = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    // Rotate to lie in X-Z plane with Y as up
    wingGeometry.rotateX(Math.PI / 2);
    wingGeometry.center();

    const mainWings = new THREE.Mesh(wingGeometry, stealthBodyMaterial);
    this.group.add(mainWings);

    // Wireframe laser edge overlay for futuristic cyber aesthetic
    const wingWireframe = new THREE.Mesh(wingGeometry, edgeLaserMaterial);
    wingWireframe.scale.set(1.002, 1.002, 1.002);
    this.group.add(wingWireframe);

    // 3. Upper Dorsal Spine & Cockpit Hump
    const spineGeo = new THREE.ConeGeometry(0.85, 9.0, 4);
    spineGeo.rotateX(-Math.PI / 2);
    spineGeo.scale(1.2, 0.45, 1.0);
    const spine = new THREE.Mesh(spineGeo, stealthBodyMaterial);
    spine.position.set(0, 0.35, -0.2);
    this.group.add(spine);

    // 4. Cockpit Canopy (Stealth Gold/Cyan Tinted Glass)
    const canopyGeo = new THREE.ConeGeometry(0.42, 3.2, 8);
    canopyGeo.rotateX(-Math.PI / 2);
    canopyGeo.scale(1.0, 0.5, 1.0);
    const canopy = new THREE.Mesh(canopyGeo, canopyMaterial);
    canopy.position.set(0, 0.55, 2.2);
    this.group.add(canopy);

    // 5. Twin Canted Vertical Stabilizers (F-22 iconic 28-degree outward cant)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.9, 0);
    finShape.lineTo(0.5, 2.4);
    finShape.lineTo(0.1, 2.4);
    finShape.closePath();

    const finExtrude = { depth: 0.08, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrude);

    // Right Vertical Stabilizer
    const rightFin = new THREE.Mesh(finGeo, stealthBodyMaterial);
    rightFin.position.set(1.15, 0.3, -4.5);
    rightFin.rotation.z = -THREE.MathUtils.degToRad(26); // Cant outward
    rightFin.rotation.y = THREE.MathUtils.degToRad(2);
    this.group.add(rightFin);

    // Left Vertical Stabilizer
    const leftFin = new THREE.Mesh(finGeo, stealthBodyMaterial);
    leftFin.position.set(-1.15, 0.3, -4.5);
    leftFin.rotation.z = THREE.MathUtils.degToRad(26); // Cant outward
    leftFin.rotation.y = -THREE.MathUtils.degToRad(2);
    this.group.add(leftFin);

    // 6. Twin Stealth Thrust-Vectoring Exhaust Nozzles
    const nozzleGeo = new THREE.BoxGeometry(0.8, 0.35, 0.9);

    const rightNozzle = new THREE.Mesh(nozzleGeo, exhaustNozzleMaterial);
    rightNozzle.position.set(0.85, 0, -5.2);
    this.group.add(rightNozzle);

    const leftNozzle = new THREE.Mesh(nozzleGeo, exhaustNozzleMaterial);
    leftNozzle.position.set(-0.85, 0, -5.2);
    this.group.add(leftNozzle);

    // 7. Supersonic Afterburner Plasma Flames
    const flameGeo = new THREE.ConeGeometry(0.35, 3.5, 12, 1, true);
    flameGeo.rotateX(Math.PI / 2);

    const rightFlame = new THREE.Mesh(flameGeo, afterburnerFlameMaterial);
    rightFlame.position.set(0.85, 0, -7.0);
    this.group.add(rightFlame);
    this.afterburners.push(rightFlame);

    const leftFlame = new THREE.Mesh(flameGeo, afterburnerFlameMaterial);
    leftFlame.position.set(-0.85, 0, -7.0);
    this.group.add(leftFlame);
    this.afterburners.push(leftFlame);

    // Core bright white plasma inside flame
    const coreFlameGeo = new THREE.ConeGeometry(0.18, 1.8, 8, 1, true);
    coreFlameGeo.rotateX(Math.PI / 2);

    const rightCore = new THREE.Mesh(coreFlameGeo, afterburnerCoreMaterial);
    rightCore.position.set(0.85, 0, -6.0);
    this.group.add(rightCore);

    const leftCore = new THREE.Mesh(coreFlameGeo, afterburnerCoreMaterial);
    leftCore.position.set(-0.85, 0, -6.0);
    this.group.add(leftCore);

    // 8. Supersonic Vapor Cone (Prandtl-Glauert Singularity shock ring)
    const vaporRingGeo = new THREE.TorusGeometry(3.2, 0.12, 8, 32);
    const vaporMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00a0,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const vaporRing = new THREE.Mesh(vaporRingGeo, vaporMaterial);
    vaporRing.position.set(0, 0, -1.0);
    this.group.add(vaporRing);
    this.vaporCones.push(vaporRing);

    // Overall scale adjustment
    this.group.scale.set(0.7, 0.7, 0.7);
  }

  update(time) {
    // Dynamic afterburner flame pulse & flicker
    const flameScale = 1.0 + Math.sin(time * 35) * 0.18 + Math.cos(time * 20) * 0.12;
    this.afterburners.forEach(flame => {
      flame.scale.set(1.0 + Math.sin(time * 25) * 0.1, 1.0 + Math.cos(time * 25) * 0.1, flameScale);
    });

    // Subtle atmospheric breathing roll
    this.group.position.y += Math.sin(time * 2.5) * 0.003;
  }

  triggerSonicShockwave() {
    this.vaporCones.forEach(vapor => {
      vapor.material.opacity = 0.8;
      vapor.scale.set(0.5, 0.5, 0.5);

      const expand = () => {
        vapor.scale.x += 0.12;
        vapor.scale.y += 0.12;
        vapor.scale.z += 0.12;
        vapor.material.opacity *= 0.91;
        if (vapor.material.opacity > 0.02) {
          requestAnimationFrame(expand);
        } else {
          vapor.material.opacity = 0;
        }
      };
      expand();
    });
  }
}
