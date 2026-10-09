import React, { useRef } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const HumanModelSimulation: React.FC = () => {
  const frame = useCurrentFrame();
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);

  // 1. Math calculation logic: Smooth bicep/squat joint mechanics looping over time
  const loopProgress = (frame % 60) / 60; // 2-second repeat cadence
  const jointRotation = interpolate(loopProgress, [0, 0.5, 1], [0, -0.8, 0]);

  // 2. Camera tracking loop: Spin the camera around the 3D actor as frames tick forward
  useFrame((state) => {
    const angle = interpolate(frame, [0, 300], [0, Math.PI * 2]);
    state.camera.position.x = Math.sin(angle) * 4;
    state.camera.position.z = Math.cos(angle) * 4;
    state.camera.lookAt(0, 1.2, 0); // Keep tracking camera on the center torso
  });

  return (
    <group ref={groupRef}>
      {/* Cyber Grid Floor */}
      <gridHelper args={[20, 20, "#1E293B", "#111827"]} position={[0, 0, 0]} />

      {/* HIPS & TORSO */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.7, 16]} />
        <meshStandardMaterial color="#0B132B" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* HEAD (With glowing neon facial terminal slot) */}
      <mesh position={[0, 1.75, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#FF007A" emissive="#FF007A" emissiveIntensity={0.3} />
      </mesh>

      {/* RIGHT UPPER THIGH JOINT */}
      <mesh position={[0.15, 0.8, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#00FF66" />
      </mesh>

      {/* RIGHT LOWER LEG MESH */}
      <mesh ref={rightLegRef} position={[0.15, 0.4, 0]} rotation={[jointRotation, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.04, 0.6, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.1} />
      </mesh>

      {/* LEFT UPPER THIGH JOINT */}
      <mesh position={[-0.15, 0.8, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#00FF66" />
      </mesh>

      {/* LEFT LOWER LEG MESH (Mirrored offset cycle loop) */}
      <mesh ref={leftLegRef} position={[-0.15, 0.4, 0]} rotation={[-jointRotation, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.04, 0.6, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.1} />
      </mesh>
    </group>
  );
};
