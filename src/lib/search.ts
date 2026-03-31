import type { PadronRecord, SearchMode } from "./types";

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function cleanDni(value: string): string {
  return value.replace(/\D/g, "");
}

export function detectSearchMode(query: string): SearchMode {
  const compactValue = query.trim();
  return /^[0-9\s.\-]+$/.test(compactValue) ? "dni" : "apellido";
}

export function searchPadron(records: PadronRecord[], query: string): PadronRecord[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const mode = detectSearchMode(trimmedQuery);

  if (mode === "dni") {
    const dniQuery = cleanDni(trimmedQuery);
    return records.filter((record) => record.dni.includes(dniQuery));
  }

  const apellidoQuery = normalizeText(trimmedQuery);
  return records.filter((record) =>
    normalizeText(record.apellido).includes(apellidoQuery)
  );
}
