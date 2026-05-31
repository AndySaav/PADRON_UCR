export type RawPadronRow = {
  Localidad?: string;
  Circuito?: string;
  Apellido?: string;
  Nombre?: string;
  Genero?: string;
  DNI?: string;
  "Fecha nacimiento"?: string;
  "Fecha afiliacion"?: string;
  Domicilio?: string;
};

export type RawJuventudRow = {
  Matrícula?: string;
  Matricula?: string;
  MATRICULA?: string;
  DNI?: string;
};

export type PadronRecord = {
  id: string;
  apellido: string;
  nombre: string;
  dni: string;
  domicilio: string;
  localidad: string;
  fechaAfiliacion: string;
  fechaAfiliacionDate: Date | null;
  esJuventudRadical: boolean;
};

export type SearchMode = "dni" | "apellido";
