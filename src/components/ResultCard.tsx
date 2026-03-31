import { formatCsvDate, getMembershipAge } from "../lib/dates";
import type { PadronRecord } from "../lib/types";

type ResultCardProps = {
  record: PadronRecord;
};

export function ResultCard({ record }: ResultCardProps) {
  return (
    <article className="result-card">
      <header className="card-header">
        <div>
          <p className="card-kicker">Afiliado</p>
          <h2 className="card-name">
            {record.apellido}, {record.nombre}
          </h2>
        </div>
        <span className="dni-badge">DNI {record.dni || "Sin dato"}</span>
      </header>

      <dl className="card-grid">
        <div className="card-item">
          <dt>Domicilio</dt>
          <dd>{record.domicilio}</dd>
        </div>
        <div className="card-item">
          <dt>Localidad</dt>
          <dd>{record.localidad}</dd>
        </div>
        <div className="card-item">
          <dt>Fecha de afiliación</dt>
          <dd>{formatCsvDate(record.fechaAfiliacion)}</dd>
        </div>
        <div className="card-item">
          <dt>Antigüedad</dt>
          <dd>{getMembershipAge(record.fechaAfiliacionDate)}</dd>
        </div>
      </dl>
    </article>
  );
}
