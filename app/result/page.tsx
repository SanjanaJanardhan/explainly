import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import ResultView from "@/components/ResultView";
import { parseFollowUpContext } from "@/lib/followUpContext";
import type { WidgetShape } from "@/lib/types";
import styles from "./page.module.css";

const VALID_SHAPES: WidgetShape[] = ["process", "network", "chart", "comparison"];

type ResultPageProps = {
  searchParams: Promise<{ q?: string; shape?: string; prevQ?: string; prevExplanation?: string }>;
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const { q, shape, prevQ, prevExplanation } = await searchParams;
  const query = q?.trim() || "Untitled query";
  const widgetShape = VALID_SHAPES.includes(shape as WidgetShape)
    ? (shape as WidgetShape)
    : undefined;
  const context = parseFollowUpContext(prevQ, prevExplanation);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>
          <IconArrowLeft size={16} />
          Back
        </Link>
        {context && (
          <p className={styles.followUpBreadcrumb}>Following up on &ldquo;{context.query}&rdquo;</p>
        )}
        <h1 className={styles.heading}>{query}</h1>
        <ResultView
          key={`${query}-${widgetShape ?? "chart"}-${context ? "followup" : "root"}`}
          query={query}
          shape={widgetShape}
          context={context}
        />
      </div>
    </div>
  );
}
