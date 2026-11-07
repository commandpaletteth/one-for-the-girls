import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon (iPhone "Add to Home Screen"), same mark as app/icon.svg.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#B85C5C",
          color: "#FFFFFF",
          fontSize: 110,
          fontStyle: "italic",
          fontFamily: "serif",
        }}
      >
        1
      </div>
    ),
    size,
  );
}
