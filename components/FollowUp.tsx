"use client";

import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";

type FollowUpProps = {
  previousQuery: string;
  previousExplanation: string;
};

export default function FollowUp({ previousQuery, previousExplanation }: FollowUpProps) {
  const router = useRouter();

  function goToResult(query: string) {
    const params = new URLSearchParams({
      q: query,
      prevQ: previousQuery,
      prevExplanation: previousExplanation,
    });
    router.push(`/result?${params.toString()}`);
  }

  return (
    <SearchInput
      placeholder="Ask a follow-up..."
      submitLabel="Ask"
      onSubmit={goToResult}
    />
  );
}
