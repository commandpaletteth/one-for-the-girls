import { ImageResponse } from "next/og";
import content from "@/content/en.json";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${content.Site.name}: ${content.Site.slogan}`;

// Picture shown when the site is shared (LINE, WhatsApp, Instagram DM, Facebook...).
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#FAF7F5",
          borderTop: "24px solid #B85C5C",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#B85C5C", textTransform: "uppercase" }}>
          {content.Home.hero_eyebrow}
        </div>
        <div style={{ fontSize: 96, color: "#4A4A4A", marginTop: 24, fontFamily: "serif" }}>{content.Site.name}</div>
        <div style={{ fontSize: 44, color: "#B85C5C", marginTop: 16, fontStyle: "italic", fontFamily: "serif" }}>
          {content.Site.slogan}
        </div>
        <div style={{ fontSize: 28, color: "#6B5B5B", marginTop: 48 }}>{content.Site.location}</div>
      </div>
    ),
    size,
  );
}
