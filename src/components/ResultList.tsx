import { ResultCard } from "./ResultCard";
import type { PadronRecord } from "../lib/types";

type ResultListProps = {
  records: PadronRecord[];
};

export function ResultList({ records }: ResultListProps) {
  return (
    <section className="results-section" aria-label="Resultados">
      <div className="results-header">
        <p className="results-count">
          {records.length} {records.length === 1 ? "resultado" : "resultados"}
        </p>
      </div>

      <div className="results-list">
        {records.map((record) => (
          <ResultCard key={record.id} record={record} />
        ))}
      </div>
    </section>
  );
}
