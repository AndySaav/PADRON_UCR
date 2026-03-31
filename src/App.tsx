import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "./components/EmptyState";
import { ResultList } from "./components/ResultList";
import { SearchBar } from "./components/SearchBar";
import { loadPadron } from "./lib/csv";
import { detectSearchMode, searchPadron } from "./lib/search";
import type { PadronRecord, SearchMode } from "./lib/types";

function App() {
  const [records, setRecords] = useState<PadronRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchPadron() {
      try {
        const data = await loadPadron();
        if (mounted) {
          setRecords(data);
          setError(null);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "No se pudo cargar el padrón."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchPadron();

    return () => {
      mounted = false;
    };
  }, []);

  const searchMode: SearchMode | null = query.trim()
    ? detectSearchMode(query)
    : null;

  const filteredRecords = useMemo(() => searchPadron(records, query), [records, query]);

  return (
    <div className="app-shell">
      <main className="app-container">
        <section className="hero">
          <p className="hero-eyebrow">Padrón UCR</p>
          <h1>Consulta rápida por apellido o DNI</h1>
          <p className="hero-description">
            Buscá afiliados desde el celular con un único campo. Si ingresás
            números, la búsqueda se hace por DNI. Si ingresás texto, se hace
            solo por apellido.
          </p>
        </section>

        <SearchBar
          query={query}
          mode={searchMode}
          onChange={setQuery}
          disabled={loading || Boolean(error)}
        />

        {loading ? (
          <EmptyState
            title="Cargando padrón"
            description="Estamos preparando los datos para que puedas empezar a buscar."
          />
        ) : null}

        {!loading && error ? (
          <EmptyState
            title="No pudimos cargar el padrón"
            description={error}
          />
        ) : null}

        {!loading && !error && !query.trim() ? (
          <EmptyState
            title="Empezá a buscar"
            description="Ingresá un apellido o un DNI para ver los resultados en tarjetas."
          />
        ) : null}

        {!loading && !error && query.trim() && filteredRecords.length === 0 ? (
          <EmptyState
            title="Sin resultados"
            description="No encontramos afiliados que coincidan con esa búsqueda."
          />
        ) : null}

        {!loading && !error && filteredRecords.length > 0 ? (
          <ResultList records={filteredRecords} />
        ) : null}
      </main>
    </div>
  );
}

export default App;
