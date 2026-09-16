import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, useGLTF, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';

// Preload the realistic DSLR camera model
useGLTF.preload('/models/camera.glb');

// --------------------------------------------------------------------------
// 1. REALISTIC 3D DSLR CAMERA MODEL (PENTAX K-1 85MM)
// Handles Act 1 (Assemble), Act 2 (Into the Lens), Act 3 (Shutter),
// Act 4 (Mosaic Pullback), and Act 5 (Viewfinder 180° Turn)
// --------------------------------------------------------------------------
function CameraAssemblyModel({ scrollProgress, pointer, isMobile, flashIntensityRef }) {
  const { scene } = useGLTF('/models/camera.glb');
  const groupRef = useRef();

  // Clone scene with SkeletonUtils to ensure bones and skinned meshes animate independently
  const clonedScene = useMemo(() => {
    const clone = cloneSkeleton(scene);

    clone.traverse((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material.envMapIntensity = 1.8;

          // Enhanced realistic PBR for optical glass elements
          if (child.name === 'Object_19' || child.material.name === 'mat_DAF85mm_Lens') {
            child.material.transparent = true;
            child.material.opacity = 0.86;
            child.material.roughness = 0.03;
            child.material.metalness = 0.2;
            child.material.envMapIntensity = 3.0;
          }
          // Viewfinder glass element
          else if (child.name === 'Object_7' || child.material.name === 'mat_K-I_Finder') {
            child.material.transparent = true;
            child.material.opacity = 0.9;
            child.material.roughness = 0.06;
            child.material.metalness = 0.25;
            child.material.envMapIntensity = 2.4;
          }
          // Magnesium alloy body & knurled metal dials
          else {
            child.material.metalness = Math.max(child.material.metalness || 0.7, 0.78);
            child.material.roughness = Math.min(child.material.roughness || 0.42, 0.38);
            child.material.envMapIntensity = 1.6;
          }
        }
      }
    });

    return clone;
  }, [scene]);

  // Extract key mechanical parts and bones discovered in camera.glb
  const parts = useMemo(() => {
    return {
      bodyRoot: clonedScene.getObjectByName('FullsizeK_root'),
      lensRoot: clonedScene.getObjectByName('Lens85mm_root'),
      hoodBone: clonedScene.getObjectByName('85_LensHood_010'),
      focusBone: clonedScene.getObjectByName('85_Forcas_09'),
      capBone: clonedScene.getObjectByName('85_LensCap_011'),
      mirrorBone: clonedScene.getObjectByName('Mirror_01'),
      monitorRoot: clonedScene.getObjectByName('FlexTiltMonitor_root_06'),
      monitorTilt: clonedScene.getObjectByName('FlexTiltMonitor_Monitor-tilt_07'),
      opticsMesh: clonedScene.getObjectByName('Object_19'),
    };
  }, [clonedScene]);

  // Record resting transform values to interpolate smoothly back into assembled position
  const rest = useMemo(() => {
    return {
      bodyRootPos: parts.bodyRoot ? parts.bodyRoot.position.clone() : new THREE.Vector3(),
      bodyRootRot: parts.bodyRoot ? parts.bodyRoot.rotation.clone() : new THREE.Euler(),
      lensRootPos: parts.lensRoot ? parts.lensRoot.position.clone() : new THREE.Vector3(),
      lensRootRot: parts.lensRoot ? parts.lensRoot.rotation.clone() : new THREE.Euler(),
      hoodBonePos: parts.hoodBone ? parts.hoodBone.position.clone() : new THREE.Vector3(0, 0, 0.1806),
      focusBonePos: parts.focusBone ? parts.focusBone.position.clone() : new THREE.Vector3(0, 0, 0.0573),
      mirrorBoneRot: parts.mirrorBone ? parts.mirrorBone.rotation.clone() : new THREE.Euler(2.3562, 0, 0),
      monitorRootPos: parts.monitorRoot ? parts.monitorRoot.position.clone() : new THREE.Vector3(-0.0004, -0.0053, -0.0531),
      monitorTiltRot: parts.monitorTilt ? parts.monitorTilt.rotation.clone() : new THREE.Euler(-0.2633, 0, 0),
    };
  }, [parts]);

  // Dynamic frame loop
  useFrame(() => {
    if (!groupRef.current) return;

    const p = scrollProgress.current;
    const mouseX = pointer.current.x;
    const mouseY = pointer.current.y;

    // ------------------------------------------------------------------
    // ACT 1: ASSEMBLE (0.0 to 0.18 scroll)
    // When p < 0.18: Parts are exploded in balanced proportion.
    // When p >= 0.18: Parts are 100% ASSEMBLED AND LOCKED (ease = 0).
    // ------------------------------------------------------------------
    const isExplodedPhase = p < 0.18;
    const explode = isExplodedPhase ? (0.18 - p) / 0.18 : 0;
    // Cubic easing for realistic mechanical movement
    const ease = Math.pow(explode, 1.8);

    // 1. Lens Assembly & Optics (from the RIGHT side):
    // Lens barrel floats out along the forward axis towards the right, with 45° bayonet twist to lock!
    if (parts.lensRoot) {
      parts.lensRoot.position.z = rest.lensRootPos.z + 0.055 * ease;
      parts.lensRoot.position.x = rest.lensRootPos.x + 0.020 * ease;
      parts.lensRoot.position.y = rest.lensRootPos.y + 0.005 * ease;
      // Bayonet rotation: twists 45° to lock flush into camera mount flange
      parts.lensRoot.rotation.z = rest.lensRootRot.z + 0.785 * ease;
    }

    // 2. Lens Hood (further to the RIGHT):
    if (parts.hoodBone) {
      parts.hoodBone.position.z = rest.hoodBonePos.z + 0.040 * ease;
    }

    // 3. Internal Optics / Focus Group:
    if (parts.focusBone) {
      if (isExplodedPhase) {
        parts.focusBone.position.z = rest.focusBonePos.z + 0.022 * ease;
        parts.focusBone.rotation.z = 0;
      } else if (p >= 0.18 && p < 0.40) {
        // ACT 2: Racks focus smoothly back and forth when looking into the lens!
        const tFocus = (p - 0.18) / 0.22;
        parts.focusBone.position.z = rest.focusBonePos.z;
        parts.focusBone.rotation.z = Math.sin(tFocus * Math.PI * 2) * 0.9;
      } else {
        parts.focusBone.position.z = rest.focusBonePos.z;
        parts.focusBone.rotation.z = 0;
      }
    }

    // 4. Rear LCD Display (monitorRoot & monitorTilt - pulled to the LEFT):
    if (parts.monitorRoot) {
      parts.monitorRoot.position.x = rest.monitorRootPos.x - 0.045 * ease;
      parts.monitorRoot.position.z = rest.monitorRootPos.z - 0.025 * ease;
    }
    if (parts.monitorTilt) {
      parts.monitorTilt.rotation.x = rest.monitorTiltRot.x - 0.35 * ease;
    }

    // 5. Internal Reflex Mirror (mirrorBone):
    if (parts.mirrorBone) {
      parts.mirrorBone.rotation.x = rest.mirrorBoneRot.x - 0.25 * ease;
    }

    // 6. Camera Main Body (pulled to the LEFT side):
    if (parts.bodyRoot) {
      parts.bodyRoot.position.x = rest.bodyRootPos.x - 0.045 * ease;
      parts.bodyRoot.position.z = rest.bodyRootPos.z - 0.025 * ease;
    }

    // ------------------------------------------------------------------
    // CONTINUOUS SCROLL POSITIONING & CAMERA JOURNEY (ACTS 1 -> 5)
    // ------------------------------------------------------------------
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let targetScale = isMobile ? 6.5 : 8.0;

    if (p < 0.18) {
      // ----------------------------------------------------------------
      // ACT 1: THE ASSEMBLE (0–20% Scroll)
      // Camera presented in dramatic SIDE SHAPE PROFILE (~65° angle):
      // Main camera body comes from the LEFT, lens/hood come from the RIGHT,
      // assembling and locking into place as user scrolls.
      // ----------------------------------------------------------------
      targetX = isMobile ? mouseX * 0.12 : -2.05 + mouseX * 0.15;
      targetY = isMobile ? -0.12 - mouseY * 0.1 : 0.02 - mouseY * 0.12;
      targetZ = 0.1;
      targetRotY = isMobile ? 0.75 + mouseX * 0.15 : 1.15 + mouseX * 0.12;
      targetRotX = -0.04 - mouseY * 0.1;
      targetScale = isMobile ? 6.6 : 8.2;
    } else if (p < 0.40) {
      // ----------------------------------------------------------------
      // ACT 2: INTO THE LENS / FOCUS (20–40% Scroll)
      // Camera glides to CENTER SCREEN, smoothly rotating from the SIDE PROFILE
      // to point its lens directly at the user!
      // ----------------------------------------------------------------
      const t = (p - 0.18) / 0.22;
      const startX = isMobile ? 0 : -2.05;
      targetX = THREE.MathUtils.lerp(startX, 0, t) + mouseX * 0.15;
      targetY = THREE.MathUtils.lerp(0.02, 0.0, t) - mouseY * 0.12;
      targetZ = THREE.MathUtils.lerp(0.1, 0.85, t); // glides closer
      targetRotY = THREE.MathUtils.lerp(1.15, 0.0, t) + mouseX * 0.12; // smoothly pivots from side to facing forward
      targetRotX = THREE.MathUtils.lerp(-0.04, 0.0, t) - mouseY * 0.1;
      targetScale = THREE.MathUtils.lerp(8.2, 12.8, t);
    } else if (p < 0.75) {
      // ----------------------------------------------------------------
      // ACT 3: THE SHUTTER & FLOATING PRINTS (40–75% Scroll)
      // Camera sits on center-left, firing shutter as photos develop
      // ----------------------------------------------------------------
      const t = (p - 0.40) / 0.35;
      targetX = isMobile ? 0 : -1.4 + mouseX * 0.15;
      targetY = -0.05 - mouseY * 0.12;
      targetZ = THREE.MathUtils.lerp(0.85, 0.3, t);
      targetRotY = THREE.MathUtils.lerp(0.0, 0.38, t) + mouseX * 0.15;
      targetRotX = -0.04 - mouseY * 0.1;
      targetScale = isMobile ? 7.5 : 10.0;

      // Shutter flash triggers at discrete intervals
      const cycle = (p * 20) % 1;
      if (cycle < 0.08 && flashIntensityRef) {
        flashIntensityRef.current = (1 - cycle / 0.08) * 18;
      } else if (flashIntensityRef) {
        flashIntensityRef.current = 0;
      }
    } else if (p < 0.90) {
      // ----------------------------------------------------------------
      // ACT 4: THE 3D MOSAIC WALL (75–90% Scroll)
      // Camera pulls back to a cinematic wide angle for gallery wall overview
      // ----------------------------------------------------------------
      const t = (p - 0.75) / 0.15;
      targetX = THREE.MathUtils.lerp(-1.4, 0, t) + mouseX * 0.1;
      targetY = THREE.MathUtils.lerp(-0.05, 0.35, t) - mouseY * 0.1;
      targetZ = THREE.MathUtils.lerp(0.3, -1.2, t); // pulls back
      targetRotY = THREE.MathUtils.lerp(0.38, 0.0, t) + mouseX * 0.1;
      targetRotX = THREE.MathUtils.lerp(-0.04, 0.18, t); // slight high-angle pitch
      targetScale = THREE.MathUtils.lerp(10.0, 6.2, t);
    } else {
      // ----------------------------------------------------------------
      // ACT 5: THE VIEWFINDER HUD (90–100% Scroll)
      // Camera rotates 180° to bring rear LCD / optical viewfinder right to screen!
      // ----------------------------------------------------------------
      const t = Math.min(1, (p - 0.90) / 0.10);
      targetX = mouseX * 0.08;
      targetY = -0.05 - mouseY * 0.08;
      targetZ = THREE.MathUtils.lerp(-1.2, 0.8, t); // zooms into viewfinder
      targetRotY = THREE.MathUtils.lerp(0.0, Math.PI, t) + mouseX * 0.08; // 180° rotation
      targetRotX = -mouseY * 0.08;
      targetScale = THREE.MathUtils.lerp(6.2, 11.0, t);
    }

    // Smooth lerping
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.08);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.08);

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);

    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1);
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Centering offset: keeps rotation axis aligned with camera body / sensor */}
      <primitive object={clonedScene} position={[0.013, -0.005, -0.049]} />
    </group>
  );
}

// --------------------------------------------------------------------------
// REALISTIC CAMERA DROP SHADOW
// Casts a rich, grounded, soft studio contact shadow directly under the camera body & lens
// --------------------------------------------------------------------------
function CameraDropShadow({ scrollProgress, pointer, isMobile }) {
  const shadowRef = useRef();

  const shadowTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 512);

    // 1. Broad soft ambient falloff
    const ambientGrad = ctx.createRadialGradient(256, 256, 10, 256, 256, 250);
    ambientGrad.addColorStop(0, 'rgba(0, 0, 0, 0.70)');
    ambientGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.45)');
    ambientGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.18)');
    ambientGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.05)');
    ambientGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = ambientGrad;
    ctx.beginPath();
    ctx.arc(256, 256, 250, 0, Math.PI * 2);
    ctx.fill();

    // 2. Focused dense contact core
    const coreGrad = ctx.createRadialGradient(256, 256, 5, 256, 256, 130);
    coreGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    coreGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.75)');
    coreGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.30)');
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(256, 256, 130, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame(() => {
    if (!shadowRef.current) return;
    const p = scrollProgress.current;
    const mouseX = pointer.current.x;

    let posX = isMobile ? mouseX * 0.12 : -1.80 + mouseX * 0.15;
    let posY = -0.72; // Directly below camera body & lens
    let posZ = 0.1;
    let scaleX = isMobile ? 2.6 : 3.8;
    let scaleZ = isMobile ? 1.1 : 1.5;
    let opacity = 0.88;

    if (p < 0.18) {
      // Act 1: Side shape profile (hero section)
      posX = isMobile ? mouseX * 0.12 : -1.80 + mouseX * 0.15;
      posY = -0.72;
      posZ = 0.1;
      scaleX = isMobile ? 2.6 : 3.8;
      scaleZ = isMobile ? 1.1 : 1.5;
      opacity = 0.88;
    } else if (p < 0.40) {
      // Act 2: Move to center & face lens forward
      const t = (p - 0.18) / 0.22;
      const startX = isMobile ? 0 : -1.80;
      posX = THREE.MathUtils.lerp(startX, 0, t) + mouseX * 0.15;
      posY = THREE.MathUtils.lerp(-0.72, -0.85, t);
      posZ = THREE.MathUtils.lerp(0.1, 0.8, t);
      scaleX = THREE.MathUtils.lerp(3.8, 4.8, t);
      scaleZ = THREE.MathUtils.lerp(1.5, 3.2, t);
      opacity = THREE.MathUtils.lerp(0.88, 0.70, t);
    } else if (p < 0.75) {
      // Act 3: Shutter & gallery
      posX = isMobile ? mouseX * 0.1 : -1.2 + mouseX * 0.1;
      posY = -0.78;
      scaleX = 3.2;
      scaleZ = 1.6;
      opacity = 0.65;
    } else if (p < 0.88) {
      // Act 4: Pullback
      posX = 0;
      posY = -0.80;
      scaleX = 2.4;
      scaleZ = 1.2;
      opacity = 0.45;
    } else {
      // Act 5: Viewfinder turn
      posX = 0;
      posY = -0.90;
      scaleX = 3.0;
      scaleZ = 1.8;
      opacity = 0.6;
    }

    shadowRef.current.position.x = THREE.MathUtils.lerp(shadowRef.current.position.x, posX, 0.08);
    shadowRef.current.position.y = THREE.MathUtils.lerp(shadowRef.current.position.y, posY, 0.08);
    shadowRef.current.position.z = THREE.MathUtils.lerp(shadowRef.current.position.z, posZ, 0.08);
    shadowRef.current.scale.x = THREE.MathUtils.lerp(shadowRef.current.scale.x, scaleX, 0.08);
    shadowRef.current.scale.y = THREE.MathUtils.lerp(shadowRef.current.scale.y, scaleZ, 0.08);

    if (shadowRef.current.material) {
      shadowRef.current.material.opacity = THREE.MathUtils.lerp(shadowRef.current.material.opacity, opacity, 0.08);
    }
  });

  return (
    <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[-1.8, -0.72, 0.1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={shadowTex}
        transparent
        depthWrite={false}
        opacity={0.88}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

// --------------------------------------------------------------------------
// 2. 3D FLOATING GALLERY PRINTS (ACT 3 & ACT 4)
// Real photographic frames that emerge and float in 3D space around camera
// --------------------------------------------------------------------------
function FloatingPhotoPrints({ scrollProgress, pointer }) {
  const group = useRef();

  // Load real high-resolution luxury photography textures for the 4 floating frames
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const urls = [
      '/images/prints/print_wedding.jpg',
      '/images/prints/print_portrait.jpg',
      '/images/prints/print_fashion.jpg',
      '/images/prints/print_nature.jpg',
    ];
    return urls.map(url => {
      const tex = loader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      return tex;
    });
  }, []);

  // Floating prints configuration in 3D space
  const printPositions = useMemo(() => [
    { pos: [1.8, 0.8, 0.2], rot: [0.08, -0.35, 0.04], title: "LUXURY WEDDING" },
    { pos: [2.2, -0.7, -0.4], rot: [-0.05, -0.28, -0.06], title: "CINEMATIC PORTRAIT" },
    { pos: [-2.0, -0.9, -0.2], rot: [0.06, 0.32, 0.05], title: "EDITORIAL FASHION" },
    { pos: [0.2, 1.4, -0.8], rot: [-0.12, 0.08, -0.02], title: "FINE ART PRE-WEDDING" },
  ], []);

  useFrame(() => {
    if (!group.current) return;
    const p = scrollProgress.current;

    // Visible during Act 3 (Shutter / Gallery) & Act 4 (Mosaic Wall): 0.38 to 0.90
    if (p >= 0.38 && p <= 0.90) {
      group.current.visible = true;
      const t = (p - 0.38) / 0.52;
      const alpha = Math.sin(t * Math.PI);

      group.current.position.y = (t - 0.5) * 1.5;
      group.current.rotation.y = pointer.current.x * 0.1;
      group.current.scale.setScalar(Math.max(0.001, alpha));
    } else {
      group.current.visible = false;
    }
  });

  return (
    <group ref={group} visible={false}>
      {printPositions.map((slide, i) => (
        <group key={i} position={slide.pos} rotation={slide.rot}>
          {/* Elegant White Museum Polaroid Border */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.34, 1.64, 0.016]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.04} />
          </mesh>
          {/* Real High-Resolution Photographic Print Emulsion */}
          <mesh position={[0, 0.12, 0.011]}>
            <planeGeometry args={[1.18, 1.18]} />
            <meshStandardMaterial
              map={textures[i]}
              roughness={0.18}
              metalness={0.02}
            />
          </mesh>
          {/* Gold Accent Trim */}
          <mesh position={[0, -0.58, 0.011]}>
            <boxGeometry args={[0.92, 0.025, 0.005]} />
            <meshStandardMaterial color="#B5622E" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// --------------------------------------------------------------------------
// 3. INTERACTIVE 3D PARTICLES / FLOATING DOTS FIELD
// Luminous light dots in Dark Mode, luxury deep espresso dots in Light Mode
// --------------------------------------------------------------------------
function createCircleDotTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.85)');
  gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

function Interactive3DDotsField({ pointer, scrollProgress, currentTheme }) {
  const pointsRef = useRef();
  const count = 380;

  const { positions, originalPositions, speeds, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 8;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
      spd[i] = 0.25 + Math.random() * 0.45;
      phs[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, originalPositions: orig, speeds: spd, phases: phs };
  }, [count]);

  const dotTexture = useMemo(() => createCircleDotTexture(), []);

  const isDark = currentTheme === 'dark';
  const dotColor = isDark ? '#F5DFC6' : '#2A1C14';
  const dotOpacity = isDark ? 0.72 : 0.48;
  const dotSize = isDark ? 0.08 : 0.07;

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const mouseX = (pointer.current?.x || 0) * 0.9;
    const mouseY = (pointer.current?.y || 0) * 0.7;
    const scrollOffset = (scrollProgress.current || 0) * 2.5;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const speed = speeds[i];
      const phase = phases[i];

      const floatY = Math.sin(time * speed + phase) * 0.18;
      const floatX = Math.cos(time * 0.8 * speed + phase) * 0.14;

      const depth = (originalPositions[idx + 2] + 4) / 8;
      const pX = mouseX * depth * 0.6;
      const pY = mouseY * depth * 0.6;

      posAttr.array[idx] = originalPositions[idx] + floatX + pX;
      posAttr.array[idx + 1] = originalPositions[idx + 1] + floatY + pY - scrollOffset;
      posAttr.array[idx + 2] = originalPositions[idx + 2];
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={dotSize}
        color={dotColor}
        map={dotTexture}
        transparent={true}
        opacity={dotOpacity}
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

// --------------------------------------------------------------------------
// 4. MAIN FIXED FULL-VIEWPORT 3D CANVAS CONTROLLER
// Pinned for the entire page (z-index: 1, pointer-events: none)
// --------------------------------------------------------------------------
export default function ThreeDScene() {
  const scrollProgress = useRef(0);
  const targetScroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const flashIntensityRef = useRef(0);
  const flashLightRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    const updateTheme = () => {
      const th = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'dark';
      setCurrentTheme(th);
    };
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('storage', updateTheme);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', updateTheme);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        targetScroll.current = Math.max(0, Math.min(1, window.scrollY / docHeight));
      }
    };

    const handleMouseMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="canvas-container" style={{ pointerEvents: 'none' }}>
      <Canvas
        shadows
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.2]} fov={45} />

        {/* Studio HDRI Environment for authentic metal and glass reflections */}
        <Environment preset="studio" />

        {/* Ground Contact Shadows catching 3D geometry */}
        <ContactShadows
          position={[0, -0.85, 0]}
          opacity={0.65}
          scale={16}
          blur={2.0}
          far={3.0}
          resolution={1024}
          color="#000000"
        />

        {/* Studio Directional Key & Rim Lighting */}
        <ambientLight intensity={1.3} />
        <directionalLight position={[6, 8, 6]} intensity={3.5} color="#FFF8F0" castShadow />
        <directionalLight position={[-5, 3, 4]} intensity={2.2} color="#FFFFFF" />
        {/* Cool cyan rim light to highlight optical edges & metal bevels */}
        <pointLight position={[-6, 5, -3]} intensity={3.0} color="#80D8FF" />
        {/* Warm gold rim light from lower right */}
        <pointLight position={[5, -5, -2]} intensity={2.5} color="#D4A373" />

        {/* Shutter Burst Flash Light */}
        <pointLight
          ref={flashLightRef}
          position={[0, 0, 2.5]}
          color="#FFF8F0"
          intensity={0}
          distance={12}
        />

        {/* Synchronizer Hook */}
        <ScrollUpdater
          scrollProgress={scrollProgress}
          targetScroll={targetScroll}
          flashIntensityRef={flashIntensityRef}
          flashLightRef={flashLightRef}
        />

        {/* 3D DSLR Camera Model (All 5 Acts) */}
        <Suspense fallback={null}>
          <CameraAssemblyModel
            scrollProgress={scrollProgress}
            pointer={pointer}
            isMobile={isMobile}
            flashIntensityRef={flashIntensityRef}
          />
        </Suspense>

        {/* Dedicated Realistic Camera Ground Drop Shadow */}
        <CameraDropShadow
          scrollProgress={scrollProgress}
          pointer={pointer}
          isMobile={isMobile}
        />

        {/* Interactive 3D Floating Dots / Stardust Field (Theme adaptive) */}
        <Interactive3DDotsField
          pointer={pointer}
          scrollProgress={scrollProgress}
          currentTheme={currentTheme}
        />

        {/* Floating 3D Portfolio Prints for Gallery Acts */}
        <FloatingPhotoPrints scrollProgress={scrollProgress} pointer={pointer} />
      </Canvas>
    </div>
  );
}

// Helper component inside Canvas to update scroll progress and trigger flash bursts
function ScrollUpdater({ scrollProgress, targetScroll, flashIntensityRef, flashLightRef }) {
  useFrame(() => {
    scrollProgress.current = THREE.MathUtils.lerp(
      scrollProgress.current,
      targetScroll.current,
      0.08
    );

    if (flashLightRef.current && flashIntensityRef) {
      flashLightRef.current.intensity = THREE.MathUtils.lerp(
        flashLightRef.current.intensity,
        flashIntensityRef.current || 0,
        0.3
      );
    }
  });
  return null;
}
