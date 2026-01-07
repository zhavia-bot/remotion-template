import { Player } from "@remotion/player";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RootComposition } from "./compositions";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1920px",
          aspectRatio: "16/9",
          position: "relative",
        }}
      >
        <Player
          component={RootComposition}
          durationInFrames={150}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={30}
          controls
          alwaysShowControls
          hideControlsWhenPointerDoesntMove={false}
          clickToPlay
          doubleClickToFullscreen
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  </StrictMode>
);
