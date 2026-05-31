import { parseCsvDate } from "./dates";
import type { PadronRecord, RawJuventudRow } from "./types";

type CsvRow = Record<string, string>;

function normalizeCsvToken(value: string): string {
  return value
    .replace(/\uFEFF/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .toLowerCase()
    .trim();
}

function detectDelimiter(line: string): string {
  const semicolonCount = (line.match(/;/g) ?? []).length;
  const commaCount = (line.match(/,/g) ?? []).length;
  return semicolonCount >= commaCount ? ";" : ",";
}

function splitCsvLine(line: string): string[] {
  const delimiter = detectDelimiter(line);
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      const nextCharacter = line[index + 1];
      if (insideQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === delimiter && !insideQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  result.push(current);
  return result.map((value) => value.trim());
}

function parseCsv(csvText: string): CsvRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.replace(/\uFEFF/g, "").trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: CsvRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

function getRowValue(row: CsvRow, aliases: string[]): string {
  const normalizedAliases = aliases.map(normalizeCsvToken);

  for (const [key, value] of Object.entries(row)) {
    if (normalizedAliases.includes(normalizeCsvToken(key))) {
      return value.trim();
    }
  }

  return "";
}

function getJuventudIdentifier(row: CsvRow): string {
  for (const [key, value] of Object.entries(row)) {
    const normalizedHeader = normalizeCsvToken(key);
    if (
      normalizedHeader === "dni" ||
      normalizedHeader === "matricula" ||
      normalizedHeader === "matrcula" ||
      /^matr.*cula$/.test(normalizedHeader)
    ) {
      return value.replace(/\D/g, "");
    }
  }

  return "";
}

function mapRowToRecord(row: CsvRow, index: number): PadronRecord | null {
  const apellido = getRowValue(row, ["Apellido"]);
  const nombre = getRowValue(row, ["Nombre"]);
  const dni = getRowValue(row, ["DNI"]).replace(/\D/g, "");
  const fechaAfiliacion = getRowValue(row, [
    "Fecha afiliacion",
    "Fecha afiliación"
  ]);

  if (!apellido && !dni) {
    return null;
  }

  return {
    id: `${dni || "sin-dni"}-${index}`,
    apellido,
    nombre,
    dni,
    domicilio: getRowValue(row, ["Domicilio"]) || "Sin domicilio",
    localidad: getRowValue(row, ["Localidad"]) || "Sin localidad",
    fechaAfiliacion,
    fechaAfiliacionDate: parseCsvDate(fechaAfiliacion),
    esJuventudRadical: false
  };
}

async function fetchCsvText(path: string): Promise<string> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`No se pudo cargar el archivo ${path}.`);
  }

  return response.text();
}

async function loadJuventudMatriculas(): Promise<Set<string>> {
  const csvText = await fetchCsvText("/data/padron-juventud-2026.csv");
  const rows = parseCsv(csvText) as RawJuventudRow[];

  return new Set(
    rows
      .map((row) => getJuventudIdentifier(row as CsvRow))
      .filter(Boolean)
  );
}

export async function loadPadron(): Promise<PadronRecord[]> {
  const [padronText, juventudMatriculas] = await Promise.all([
    fetchCsvText("/data/padron.csv"),
    loadJuventudMatriculas()
  ]);

  const rows = parseCsv(padronText);

  return rows
    .map((row, index) => mapRowToRecord(row, index))
    .filter((record): record is PadronRecord => record !== null)
    .map((record) => ({
      ...record,
      esJuventudRadical: juventudMatriculas.has(record.dni)
    }));
}
