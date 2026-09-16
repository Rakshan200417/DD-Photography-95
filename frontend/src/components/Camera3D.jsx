import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const CameraModel = ({ scrollY }) => {
  const group = useRef();
  const bodyRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Continuous slow rotation
    group.current.rotation.y = t * 0.2 + scrollY * 0.005;
    
    // Scroll effects: move into distance and tilt
    group.current.position.z = -scrollY * 0.01;
    group.current.rotation.x = Math.sin(t * 0.5) * 0.1 + scrollY * 0.001;
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Camera Body */}
        <mesh ref={bodyRef}>
          <boxGeometry args={[2, 1.2, 0.8]} />
          <meshStandardMaterial 
            color="#1c1c1e" 
            metalness={0.8} 
            roughness={0.2} 
            envMapIntensity={1}
          />
        </mesh>
        
        {/* Lens */}
        <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.6, 32]} />
          <meshStandardMaterial color="#0a0a0b" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Lens Ring (Gold) */}
        <mesh position={[0, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.03, 16, 100]} />
          <meshStandardMaterial color="#B5622E" metalness={1} roughness={0.1} />
        </mesh>

        {/* Shutter Button (Gold) */}
        <mesh position={[0.7, 0.6, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
          <meshStandardMaterial color="#B5622E" metalness={1} roughness={0.1} />
        </mesh>
      </Float>
    </group>
  );
};

const Particles = ({ scrollY }) => {
  const points = useRef();
  
  const particlesCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouseX = state.mouse.x;
    const mouseY = state.mouse.y;

    points.current.rotation.y = t * 0.05;
    points.current.position.y += 0.002;
    if (points.current.position.y > 2) points.current.position.y = -2;

    // React to mouse
    points.current.rotation.x += (mouseY * 0.1 - points.current.rotation.x) * 0.05;
    points.current.rotation.z += (mouseX * 0.1 - points.current.rotation.z) * 0.05;
  });

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="white"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
};

const Camera3D = ({ scrollY = 0 }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#B5622E" />
      <pointLight position={[-10, -10, 5]} intensity={0.5} />
      
      <CameraModel scrollY={scrollY} />
      <Particles scrollY={scrollY} />
    </>
  );
};

export default Camera3D;
