import type { WidgetShape } from "@/lib/types";
import styles from "./WidgetFrame.module.css";

type WidgetFrameProps = {
  svg: string;
  widgetType: WidgetShape | "diagram";
};

// svg is trusted, hardcoded fake data for now — once widgets are LLM-generated
// this must render inside a sandboxed iframe instead, never dangerouslySetInnerHTML.
export default function WidgetFrame({ svg, widgetType }: WidgetFrameProps) {
  return (
    <div className={styles.frame}>
      <span className={styles.label}>{widgetType}</span>
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
