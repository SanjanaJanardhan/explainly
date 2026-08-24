"use client";

import { useEffect, useState } from "react";
import WidgetIframe from "./WidgetIframe";
import WidgetFrame from "./WidgetFrame";
import ExplanationCard from "./ExplanationCard";
import FollowUp from "./FollowUp";
import { fetchExplainer, ExplainError } from "@/lib/api";
import type { ExplainResponse, WidgetShape, FollowUpContext } from "@/lib/types";
import styles from "./ResultView.module.css";

const WIDGET_SHAPES: WidgetShape[] = ["process", "network", "chart", "comparison"];

type ResultViewProps = {
  query: string;
  shape?: WidgetShape;
  context?: FollowUpContext;
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; data: ExplainResponse };

export default function ResultView({ query, shape, context }: ResultViewProps) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchExplainer(query, shape, context)
      .then((data) => {
        if (!cancelled) setState({ status: "done", data });
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err instanceof ExplainError ? err.message : "Something went wrong. Please try again.";
        setState({ status: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, [query, shape, context, retryNonce]);

  function retry() {
    setState({ status: "loading" });
    setRetryNonce((n) => n + 1);
  }

  if (state.status === "loading") {
    return (
      <>
        <div className={styles.skeletonWidget} />
        <span className={styles.mutedLabel}>Generating your explainer...</span>
        <div className={styles.skeletonText} style={{ width: "90%" }} />
        <div className={styles.skeletonText} style={{ width: "75%" }} />
      </>
    );
  }

  if (state.status === "error") {
    return (
      <div className={styles.errorBox}>
        <p>{state.message}</p>
        <button type="button" className={styles.retryButton} onClick={retry}>
          Try again
        </button>
      </div>
    );
  }

  const { data } = state;

  return (
    <>
      {WIDGET_SHAPES.includes(data.widgetType as WidgetShape) && data.widgetHtml && (
        <WidgetIframe html={data.widgetHtml} shape={data.widgetType as WidgetShape} />
      )}
      {data.widgetType === "static-fallback" && data.widgetSvg && (
        <>
          <WidgetFrame svg={data.widgetSvg} widgetType="diagram" />
          <p className={styles.fallbackNote}>
            The interactive widget for this one didn&apos;t come out right, so here&apos;s a
            placeholder diagram alongside the explanation.
          </p>
        </>
      )}
      {data.widgetType === "text-fallback" && (
        <p className={styles.fallbackNote}>
          Couldn&apos;t generate a widget for this one — here&apos;s the explanation on its own.
        </p>
      )}
      <ExplanationCard text={data.explanation} />
      {!context && (
        <div>
          <span className={styles.mutedLabel}>Ask a follow-up</span>
          <FollowUp previousQuery={data.query} previousExplanation={data.explanation} />
        </div>
      )}
    </>
  );
}
