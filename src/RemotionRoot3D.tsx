import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { PerspectiveCamera } from "@react-three/drei";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SquatPractice } from "./SquatPractice";

export const RemotionRoot3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Travel halfway around the body over the full video.
  const orbitAngle = interpolate(frame, [0, durationInFrames - 1], [0, Math.PI], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        backgroundColor: "#0B0F19",
        width: "100%",
        height: "100%",
      }}
    >
      {/* 1. Setup the Three.js 3D viewport canvas */}
      <ThreeCanvas width={width} height={height}>
        {/* Rotate a camera rig around the body's center, keeping its aim inward. */}
        <group position={[0, 1.2, 0]} rotation={[0, orbitAngle, 0]}>
          <PerspectiveCamera
            makeDefault
            position={[0, 1.4, 5]}
            rotation={[-Math.atan2(1.4, 5), 0, 0]}
            fov={40}
          />
        </group>
        {/* 2. Add technical cyber lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={2} color="#FFFFFF" />
        <pointLight position={[10, 10, 10]} intensity={4} color="#3300ff" />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={1.2}
          color="#4000ff"
        />

        {/* 3. Render our customizable dynamic human mesh component */}
        <SquatPractice />
      </ThreeCanvas>

      {/* HUD overlay text for that cyber laboratory look */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          fontFamily: "monospace",
          color: "#00FF66",
          fontSize: "32px",
        }}
      >
        SQUAT PRACTICE // HIP → KNEE → ANKLE
      </div>
    </div>
  );
};
