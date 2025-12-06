import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export const HelloWorld: React.FC = () => {
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
      <div>Hello World from Remotion!</div>
      <div style={{ fontSize: 40, marginTop: 20 }}>
        Frame {frame} ({Math.round(frame / fps)}s)
      </div>
    </AbsoluteFill>
  );
};
