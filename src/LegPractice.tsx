import { useCurrentFrame, useVideoConfig } from "remotion";

export const LegPractice = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // One bend-and-return cycle lasts two seconds.
  const cycleFrames = fps * 2;
  const progress = (frame % cycleFrames) / cycleFrames;

  // Smoothly moves from 0 → 1 → 0.
  const bend = (1 - Math.cos(progress * Math.PI * 2)) / 2;

  // Angles are in radians.
  const hipAngle = -0.6 * bend;
  const kneeAngle = 1.2 * bend;

  return (
    <group position={[0.15, 1.2, 0]} rotation={[hipAngle, 0, 0]}>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.6, 16]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      <group position={[0, -0.6, 0]} rotation={[kneeAngle, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color="#00FF66" />
        </mesh>

        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.06, 0.04, 0.6, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    </group>
  );
};