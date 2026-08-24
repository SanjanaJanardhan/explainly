"use client";

import { useRouter } from "next/navigation";
import SearchInput from "@/components/SearchInput";
import ExampleChips from "@/components/ExampleChips";
import { exampleQueries } from "@/lib/staticContent";
import type { WidgetShape } from "@/lib/types";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  function goToResult(query: string, shape?: WidgetShape) {
    const params = new URLSearchParams({ q: query });
    if (shape) params.set("shape", shape);
    router.push(`/result?${params.toString()}`);
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>explainly</h1>
        <p className={styles.subtitle}>Type a concept. Get an interactive explainer.</p>
        <div className={styles.searchBlock}>
          <SearchInput
            placeholder="How does a neural network learn?"
            onSubmit={(query) => goToResult(query)}
          />
          <ExampleChips queries={exampleQueries} onSelect={goToResult} />
        </div>
      </div>
    </div>
  );
}
