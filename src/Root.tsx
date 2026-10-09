import "./index.css";
import { Composition } from "remotion";
import { RemotionRoot3D } from "./RemotionRoot3D";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
       id="Human3DView"
        component={RemotionRoot3D}
        durationInFrames={300} // 10 seconds
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

