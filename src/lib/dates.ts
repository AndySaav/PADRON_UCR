const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre"
];

export function parseCsvDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split("/");
  if (parts.length !== 3) {
    return null;
  }

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);

  if (!day || !month || !year) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  if (
    Number.isNaN(date.getTime()) ||
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
}

export function formatCsvDate(value: string): string {
  const parsed = parseCsvDate(value);
  if (!parsed) {
    return value || "Sin fecha";
  }

  const day = parsed.getDate().toString().padStart(2, "0");
  const month = MONTH_NAMES[parsed.getMonth()];
  const year = parsed.getFullYear();

  return `${day} de ${month} de ${year}`;
}

export function getMembershipAge(date: Date | null): string {
  if (!date) {
    return "Antigüedad no disponible";
  }

  const now = new Date();
  let years = now.getFullYear() - date.getFullYear();
  let months = now.getMonth() - date.getMonth();

  if (now.getDate() < date.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) {
    return "Antigüedad no disponible";
  }

  if (years === 0 && months === 0) {
    return "Menos de 1 mes";
  }

  if (years === 0) {
    return `${months} ${months === 1 ? "mes" : "meses"}`;
  }

  if (months === 0) {
    return `${years} ${years === 1 ? "año" : "años"}`;
  }

  return `${years} ${years === 1 ? "año" : "años"} y ${months} ${
    months === 1 ? "mes" : "meses"
  }`;
}
