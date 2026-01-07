import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText } from "../components/AnimatedText";

export const Root: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontSize: 100,
        backgroundColor: "#fff",
      }}
    >
      <AnimatedText text="Hello World!" startFrame={0} durationInFrames={30} />
      <div style={{ fontSize: 40, marginTop: 20 }}>
        Frame {frame} ({Math.round(frame / fps)}s)
      </div>
    </AbsoluteFill>
  );
};
