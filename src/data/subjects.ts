import { Course, Specialty } from "@/types";

export const courses: Course[] = [
  {
    id: "Q1",
    label: "Q1 — Primer cuatrimestre",
    subjects: [
      { id: "PRO1", name: "Programacion 1", ects: 7.5 },
      { id: "IC", name: "Introduccion a los Computadores", ects: 7.5 },
      { id: "FM", name: "Fundamentos Matematicos", ects: 7.5 },
      { id: "F", name: "Fisica", ects: 7.5 },
    ],
  },
  {
    id: "Q2",
    label: "Q2 — Segundo cuatrimestre",
    subjects: [
      { id: "PRO2", name: "Programacion 2", ects: 7.5 },
      { id: "EC", name: "Estructura de Computadores", ects: 7.5 },
      { id: "M1", name: "Matematicas 1", ects: 7.5 },
      { id: "M2", name: "Matematicas 2", ects: 7.5 },
    ],
  },
  {
    id: "Q3",
    label: "Q3 — Tercer cuatrimestre",
    subjects: [
      { id: "EDA", name: "Estructuras de Datos y Algoritmos", ects: 6 },
      { id: "BD", name: "Bases de Datos", ects: 6 },
      { id: "CI", name: "Interfaces de Computadores", ects: 6 },
      { id: "PE", name: "Probabilidad y Estadistica", ects: 6 },
      { id: "SO", name: "Sistemas Operativos", ects: 6 },
    ],
  },
  {
    id: "Q4",
    label: "Q4 — Cuarto cuatrimestre",
    subjects: [
      { id: "AC", name: "Arquitectura de Computadores", ects: 6 },
      { id: "EEE", name: "Empresa y Entorno Economico", ects: 6 },
      { id: "IDI", name: "Interaccion y Diseno de Interfaces", ects: 6 },
      { id: "IES", name: "Introduccion a la Ingenieria del Software", ects: 6 },
      { id: "XC", name: "Redes de Computadores", ects: 6 },
    ],
  },
  {
    id: "Q5",
    label: "Q5 — Quinto cuatrimestre",
    subjects: [
      { id: "PAR", name: "Paralelismo", ects: 6 },
      { id: "PROP", name: "Proyectos de Programacion", ects: 6 },
    ],
  },
];

export const specialties: Specialty[] = [
  {
    id: "computacion",
    label: "Computacion",
    obligatory: [
      { id: "A", name: "Algoritmica", ects: 6 },
      { id: "G", name: "Graficos", ects: 6 },
      { id: "IA", name: "Inteligencia Artificial", ects: 6 },
      { id: "LI", name: "Logica en la Informatica", ects: 6 },
      { id: "LP", name: "Lenguajes de Programacion", ects: 6 },
      { id: "TC", name: "Teoria de la Computacion", ects: 6 },
    ],
    complementary: [
      { id: "AA", name: "Ampliacion de Algoritmica", ects: 6 },
      { id: "APA", name: "Aprendizaje Automatico", ects: 6 },
      { id: "CAIM", name: "Busqueda y Analisis de Informacion Masiva", ects: 6 },
      { id: "CL", name: "Compiladores", ects: 6 },
      { id: "CN", name: "Computacion Numerica", ects: 6 },
      { id: "IO", name: "Investigacion Operativa", ects: 6 },
      { id: "SID", name: "Sistemas Inteligentes Distribuidos", ects: 6 },
    ],
  },
  {
    id: "ing-computadores",
    label: "Ingenieria de Computadores",
    obligatory: [
      { id: "AC2", name: "Arquitectura de Computadores II", ects: 6 },
      { id: "DSBM", name: "Diseno de Sistemas Basados en Microcomputadores", ects: 6 },
      { id: "MP", name: "Multiprocesadores", ects: 6 },
      { id: "PEC", name: "Proyecto de Ingenieria de Computadores", ects: 6 },
      { id: "SO2", name: "Sistemas Operativos II", ects: 6 },
      { id: "XC2", name: "Redes de Computadores II", ects: 6 },
    ],
    complementary: [
      { id: "CASO", name: "Conceptos Avanzados de Sistemas Operativos", ects: 6 },
      { id: "CPD", name: "Centros de Proceso de Datos", ects: 6 },
      { id: "PAP", name: "Programacion y Arquitecturas Paralelas", ects: 6 },
      { id: "PCA", name: "Programacion Consciente de la Arquitectura", ects: 6 },
      { id: "PDS", name: "Procesado Digital de la Senal", ects: 6 },
      { id: "STR", name: "Sistemas de Tiempo Real", ects: 6 },
      { id: "VLSI", name: "VLSI", ects: 6 },
    ],
  },
  {
    id: "ing-software",
    label: "Ingenieria del Software",
    obligatory: [
      { id: "AS", name: "Arquitectura del Software", ects: 6 },
      { id: "ASW", name: "Aplicaciones y Servicios Web", ects: 6 },
      { id: "DBD", name: "Diseno de Bases de Datos", ects: 6 },
      { id: "ER", name: "Ingenieria de Requisitos", ects: 6 },
      { id: "GPS", name: "Gestion de Proyectos de Software", ects: 6 },
      { id: "PES", name: "Proyecto de Ingenieria del Software", ects: 6 },
    ],
    complementary: [
      { id: "CAP", name: "Conceptos Avanzados de Programacion", ects: 6 },
      { id: "CBDE", name: "Conceptos para Bases de Datos Especializadas", ects: 6 },
      { id: "CSI", name: "Conceptos de Sistemas de Informacion", ects: 6 },
      { id: "ECSDI", name: "Ingenieria del Conocimiento y Sistemas Distribuidos Inteligentes", ects: 6 },
      { id: "SIM", name: "Simulacion", ects: 6 },
      { id: "SOAD", name: "Sistemas Operativos para Aplicaciones Distribuidas", ects: 6 },
    ],
  },
  {
    id: "sistemas-info",
    label: "Sistemas de Informacion",
    obligatory: [
      { id: "ADEI", name: "Analisis de Datos y Explotacion de la Informacion", ects: 6 },
      { id: "DSI", name: "Diseno de Sistemas de Informacion", ects: 6 },
      { id: "ER-SI", name: "Ingenieria de Requisitos", ects: 6 },
      { id: "NE", name: "Negocio Electronico", ects: 6 },
      { id: "PSI", name: "Proyecto de Sistemas de Informacion", ects: 6 },
      { id: "SIO", name: "Sistemas de Informacion para las Organizaciones", ects: 6 },
    ],
    complementary: [
      { id: "ABD", name: "Administracion de Bases de Datos", ects: 6 },
      { id: "CAIM-SI", name: "Busqueda y Analisis de Informacion Masiva", ects: 6 },
      { id: "EDO", name: "Estrategia Digital en las Organizaciones", ects: 6 },
      { id: "IO-SI", name: "Investigacion Operativa", ects: 6 },
      { id: "MI", name: "Marketing en Internet", ects: 6 },
      { id: "VPE", name: "Viabilidad de Proyectos Empresariales", ects: 6 },
    ],
  },
  {
    id: "tec-info",
    label: "Tecnologias de la Informacion",
    obligatory: [
      { id: "ASO", name: "Administracion de Sistemas Operativos", ects: 6 },
      { id: "PI", name: "Protocolos de Internet", ects: 6 },
      { id: "PTI", name: "Proyecto de Tecnologias de la Informacion", ects: 6 },
      { id: "SI", name: "Seguridad Informatica", ects: 6 },
      { id: "SOA", name: "Sistemas Operativos Avanzados", ects: 6 },
      { id: "TXC", name: "Tecnologias de Redes de Computadores", ects: 6 },
    ],
    complementary: [
      { id: "AD", name: "Aplicaciones Distribuidas", ects: 6 },
      { id: "CASO-TI", name: "Conceptos Avanzados de Sistemas Operativos", ects: 6 },
      { id: "CPD-TI", name: "Centros de Proceso de Datos", ects: 6 },
      { id: "IM", name: "Internet Movil", ects: 6 },
      { id: "SDX", name: "Sistemas Distribuidos en Red", ects: 6 },
      { id: "TCI", name: "Transmision y Codificacion de la Informacion", ects: 6 },
    ],
  },
];

/** Helper: obtener todas las asignaturas planas */
export function getAllSubjects() {
  const map = new Map<string, { id: string; name: string; ects: number; source: string }>();
  
  for (const course of courses) {
    for (const s of course.subjects) {
      map.set(s.id, { ...s, source: course.label });
    }
  }
  
  for (const spec of specialties) {
    for (const s of spec.obligatory) {
      if (!map.has(s.id)) map.set(s.id, { ...s, source: `${spec.label} (Oblig.)` });
    }
    for (const s of spec.complementary) {
      if (!map.has(s.id)) map.set(s.id, { ...s, source: `${spec.label} (Comp.)` });
    }
  }
  
  return map;
}
