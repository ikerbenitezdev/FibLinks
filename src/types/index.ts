export interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  source?: "default" | "community";
  createdBy?: string;
  moderationStatus?: "pending" | "approved";
}

export interface SubjectDef {
  id: string;       // codigo: PRO1, IC, FM...
  name: string;     // nombre completo
  ects: number;
}

export interface Course {
  id: string;       // Q1, Q2, Q3...
  label: string;    // "Q1 — Primer cuatrimestre"
  subjects: SubjectDef[];
}

export interface Specialty {
  id: string;
  label: string;
  obligatory: SubjectDef[];
  complementary: SubjectDef[];
}

/** Lo que se guarda en localStorage por asignatura */
export interface SubjectUserData {
  links: Link[];
}

/** Estado global guardado por usuario */
export interface UserState {
  activeSubjects: string[];
}
