import type { ReadinessStatus } from "@bellgrinda/domain";

export function StatusBadge({ status, score }: { status: ReadinessStatus; score?: number }) {
  return (
    <span className={`status-badge ${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
      {typeof score === "number" ? ` ${score}` : ""}
    </span>
  );
}
