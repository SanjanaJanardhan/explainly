import { useEffect, useRef, useState } from "react";
import type { WidgetShape } from "@/lib/types";
import styles from "./WidgetIframe.module.css";

type WidgetIframeProps = {
  html: string;
  shape: WidgetShape;
};

const RESIZE_MESSAGE_TYPE = "explainly:resize";
const DEFAULT_HEIGHT = 320;
const MIN_HEIGHT = 120;
const MAX_HEIGHT = 900;
// Small cushion on top of the reported height for sub-pixel rounding.
const HEIGHT_BUFFER = 8;

// widget_html is model-generated. sandbox="allow-scripts" with no
// allow-same-origin means the iframe gets an opaque origin: it can run its own
// JS but cannot read cookies, call same-origin APIs, or reach the parent DOM.
// Height comes from the widget's own postMessage — the parent has no other
// way to learn a sandboxed iframe's real content height — verified via
// event.source so only messages from this exact iframe are honored (the
// sender's opaque origin means event.origin can't be checked the usual way).
export default function WidgetIframe({ html, shape }: WidgetIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const srcDoc = `<!doctype html><meta charset="utf-8"><style>body{margin:0}</style>${html}`;

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type !== RESIZE_MESSAGE_TYPE) return;
      const nextHeight = Number(event.data.height);
      if (!Number.isFinite(nextHeight)) return;
      setHeight(Math.min(Math.max(nextHeight + HEIGHT_BUFFER, MIN_HEIGHT), MAX_HEIGHT));
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className={styles.frame}>
      <span className={styles.label}>{shape}</span>
      <iframe
        ref={iframeRef}
        className={styles.iframe}
        style={{ height }}
        srcDoc={srcDoc}
        sandbox="allow-scripts"
        title="Generated interactive widget"
      />
    </div>
  );
}
