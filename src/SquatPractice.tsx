import type { FC } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

const LEG_LENGTH = 0.6;
const ANKLE_HEIGHT = 0.12;

// Each leg uses the same joint hierarchy; x sets its side of the body.
const SquatLeg: FC<{ x: number; bendAngle: number }> = ({ x, bendAngle }) => (
  <group position={[x, 0, 0]} rotation={[-bendAngle, 0, 0]}>
    <mesh>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshStandardMaterial color="#00FF66" />
    </mesh>
    {/* Offset the thigh's center below its hip pivot. */}
    <mesh position={[0, -LEG_LENGTH / 2, 0]}>
      <cylinderGeometry args={[0.09, 0.07, LEG_LENGTH, 16]} />
      <meshStandardMaterial color="#64748B" />
    </mesh>
    <group position={[0, -LEG_LENGTH, 0]} rotation={[2 * bendAngle, 0, 0]}>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#00FF66" />
      </mesh>
      <mesh position={[0, -LEG_LENGTH / 2, 0]}>
        <cylinderGeometry args={[0.065, 0.045, LEG_LENGTH, 16]} />
        <meshStandardMaterial color="#64748B" />
      </mesh>
      {/* Cancel the shin's world rotation to keep the foot level. */}
      <group position={[0, -LEG_LENGTH, 0]} rotation={[-bendAngle, 0, 0]}>
        <mesh position={[0, -0.06, 0.1]}>
          <boxGeometry args={[0.19, 0.12, 0.36]} />
          <meshStandardMaterial color="#FF007A" />
        </mesh>
      </group>
    </group>
  </group>
);

const SquatArm: FC<{ x: number; shoulderAngle: number }> = ({
  x,
  shoulderAngle,
}) => (
  <group position={[x, 0.58, 0]} rotation={[shoulderAngle, 0, 0]}>
    <mesh>
      <sphereGeometry args={[0.075, 16, 16]} />
      <meshStandardMaterial color="#00FF66" />
    </mesh>
    <mesh position={[0, -0.16, 0]}>
      <cylinderGeometry args={[0.055, 0.045, 0.32, 16]} />
      <meshStandardMaterial color="#64748B" />
    </mesh>
    <group position={[0, -0.32, 0]} rotation={[-0.25, 0, 0]}>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.045, 0.035, 0.3, 16]} />
        <meshStandardMaterial color="#64748B" />
      </mesh>
      <mesh position={[0, -0.33, 0]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#FF007A" />
      </mesh>
    </group>
  </group>
);

export const SquatPractice: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Four seconds: descend for 1.5s, hold for 0.5s, rise for 1.5s, rest for 0.5s.
  const progress = (frame % (fps * 4)) / (fps * 4);
  const smooth = (t: number) => (1 - Math.cos(t * Math.PI)) / 2;
  const bend =
    progress < 0.375
      ? smooth(progress / 0.375)
      : progress < 0.5
        ? 1
        : progress < 0.875
          ? 1 - smooth((progress - 0.5) / 0.375)
          : 0;

  const bendAngle = 0.85 * bend;
  // Each segment contributes L*cos(angle) vertically. Their z offsets cancel.
  const hipHeight = ANKLE_HEIGHT + 2 * LEG_LENGTH * Math.cos(bendAngle);
  const torsoLean = 0.28 * bend;
  // The shoulder rotation is local to the torso, so subtract its lean.
  const shoulderAngle = -1.3 * bend - torsoLean;

  return (
    <group>
      <gridHelper args={[8, 16, "#475569", "#1E293B"]} />
      <group position={[0, hipHeight, 0]}>
        <SquatLeg x={-0.2} bendAngle={bendAngle} />
        <SquatLeg x={0.2} bendAngle={bendAngle} />
        <mesh>
          <boxGeometry args={[0.48, 0.18, 0.25]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Torso, head, and arms all follow the hips and torso lean. */}
        <group rotation={[torsoLean, 0, 0]}>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.25, 0.18, 0.7, 16]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.18, 24, 24]} />
            <meshStandardMaterial
              color="#FF007A"
              emissive="#FF007A"
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* A small face marker shows that forward is positive z. */}
          <mesh position={[0, 0.9, 0.17]}>
            <boxGeometry args={[0.2, 0.045, 0.035]} />
            <meshStandardMaterial color="#00FF66" />
          </mesh>
          <SquatArm x={-0.3} shoulderAngle={shoulderAngle} />
          <SquatArm x={0.3} shoulderAngle={shoulderAngle} />
        </group>
      </group>
    </group>
  );
};
