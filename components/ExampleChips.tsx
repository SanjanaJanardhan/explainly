"use client";

import type { WidgetShape } from "@/lib/types";
import styles from "./ExampleChips.module.css";

type ExampleChipsProps = {
  queries: { label: string; shape: WidgetShape }[];
  onSelect: (query: string, shape: WidgetShape) => void;
};

export default function ExampleChips({ queries, onSelect }: ExampleChipsProps) {
  return (
    <div className={styles.row}>
      {queries.map(({ label, shape }) => (
        <button
          key={label}
          type="button"
          className={styles.chip}
          onClick={() => onSelect(label, shape)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
