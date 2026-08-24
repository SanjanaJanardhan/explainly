import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 14, height: 64, background: "#2f5bff", borderRadius: 4 }} />
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              color: "#1a1a1a",
              letterSpacing: "-0.03em",
              fontFamily: "sans-serif",
            }}
          >
            explainly
          </div>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 34,
            color: "#6b6b6b",
            fontFamily: "sans-serif",
          }}
        >
          Type a concept. Get an interactive explainer.
        </div>
      </div>
    ),
    { ...size }
  );
}
