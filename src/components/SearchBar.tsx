import type { SearchMode } from "../lib/types";

type SearchBarProps = {
  query: string;
  mode: SearchMode | null;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const modeLabel: Record<SearchMode, string> = {
  apellido: "Buscando por apellido y nombre",
  dni: "Buscando por DNI"
};

export function SearchBar({ query, mode, onChange, disabled }: SearchBarProps) {
  return (
    <section className="search-panel" aria-label="Buscador de padrón">
      <label className="search-label" htmlFor="padron-search">
        Buscar afiliado
      </label>
      <div className="search-input-wrap">
        <input
          id="padron-search"
          className="search-input"
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="Buscá por apellido y nombre, o DNI"
          value={query}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
        />
      </div>
      <p className="search-help">
        Si escribís números, la búsqueda será por DNI. Si escribís texto, se
        buscará en apellido y nombre, incluso con varias palabras y en
        cualquier orden.
      </p>
      {mode ? <p className="search-mode">{modeLabel[mode]}</p> : null}
    </section>
  );
}
