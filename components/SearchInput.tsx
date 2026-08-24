"use client";

import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import styles from "./SearchInput.module.css";

type SearchInputProps = {
  placeholder?: string;
  initialValue?: string;
  submitLabel?: string;
  onSubmit: (query: string) => void;
};

export default function SearchInput({
  placeholder = "Ask anything...",
  initialValue = "",
  submitLabel = "Explain",
  onSubmit,
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <IconSearch size={18} className={styles.icon} />
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={300}
      />
      <button type="submit" className={styles.submit} disabled={!value.trim()}>
        {submitLabel}
      </button>
    </form>
  );
}
