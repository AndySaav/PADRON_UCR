import { parseCsvDate } from "./dates";
import type { PadronRecord, RawPadronRow } from "./types";

function splitCsvLine(line: string): string[] {
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

    if (character === ";" && !insideQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  result.push(current);
  return result.map((value) => value.trim());
}

function parseCsv(csvText: string): RawPadronRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: RawPadronRow = {};

    headers.forEach((header, index) => {
      row[header as keyof RawPadronRow] = values[index] ?? "";
    });

    return row;
  });
}

function mapRowToRecord(row: RawPadronRow, index: number): PadronRecord | null {
  const apellido = row.Apellido?.trim() ?? "";
  const nombre = row.Nombre?.trim() ?? "";
  const dni = row.DNI?.replace(/\D/g, "") ?? "";
  const fechaAfiliacion = row["Fecha afiliacion"]?.trim() ?? "";

  if (!apellido && !dni) {
    return null;
  }

  return {
    id: `${dni || "sin-dni"}-${index}`,
    apellido,
    nombre,
    dni,
    domicilio: row.Domicilio?.trim() ?? "Sin domicilio",
    localidad: row.Localidad?.trim() ?? "Sin localidad",
    fechaAfiliacion,
    fechaAfiliacionDate: parseCsvDate(fechaAfiliacion)
  };
}

export async function loadPadron(): Promise<PadronRecord[]> {
  const response = await fetch("/data/padron.csv");

  if (!response.ok) {
    throw new Error("No se pudo cargar el archivo del padrón.");
  }

  const csvText = await response.text();
  const rows = parseCsv(csvText);

  return rows
    .map((row, index) => mapRowToRecord(row, index))
    .filter((record): record is PadronRecord => record !== null);
}
