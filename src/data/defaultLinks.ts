import { Link } from "@/types";

export const defaultLinksBySubject: Record<string, Link[]> = {
  PRO1: [
    {
      id: "def-pro1-problemas",
      title: "Problemas PRO1",
      url: "https://raco.fib.upc.edu/",
      description: "Coleccion de ejercicios y entregas",
      source: "default",
    },
    {
      id: "def-pro1-apuntes",
      title: "Apuntes PRO1",
      url: "https://atenea.upc.edu/",
      description: "Material oficial y transparencias",
      source: "default",
    },
  ],
  PRO2: [
    {
      id: "def-pro2-problemas",
      title: "Web PRO2",
      url: "https://pro2.cs.upc.edu/",
      description: "Coleccion de ejercicios y entregas",
      source: "default",
    },
    {
      id: "def-pro2-apuntes",
      title: "Sesiones Teoria",
      url: "https://www.cs.upc.edu/~valles/pro2.html",
      description: "Material oficial y transparencias",
      source: "default",
    },
    {
      id: "def-pro2-apuntes",
      title: "Web PRO2.0",
      url: "https://apunts-pro2.vercel.app/",
      description: "Material oficial y transparencias",
      source: "default",
    },
  ],
  M1: [
    {
        id: "def-m1-apuntes",
        title: "Apuntes M1",
        url: "https://web.mat.upc.edu/fib/matematiques1/",
        description: "Material oficial y transparencias",
        source: "default",
    },
  ],
  M2: [
    {
        id: "def-m2-problemas",
        title: "Problemas M2",
        url: "https://raco.fib.upc.edu/avisos/veure.jsp?assig=GRAU-M2&id=104113",
        description: "Coleccion de ejercicios y entregas",
        source: "default",
    },
    {
        id: "def-m2-apuntes",
        title: "Apuntes M2",
        url: "https://raco.fib.upc.edu/avisos/veure.jsp?assig=GRAU-M2&id=99906",
        description: "Material oficial y transparencias",
        source: "default",
    },
  ],
  EC: [
    {
        id: "def-ec-apuntes", 
        title: "Apuntes EC",
        url: "https://docencia.ac.upc.edu/FIB/grau/EC",
        description: "Material oficial y transparencias",
        source: "default",
    },
  ],
  EDA: [
    {
      id: "def-eda-problemas",
      title: "Problemas EDA",
      url: "https://raco.fib.upc.edu/",
      description: "Listas de problemas y practicas",
      source: "default",
    },
    {
      id: "def-eda-apuntes",
      title: "Apuntes EDA",
      url: "https://atenea.upc.edu/",
      description: "Apuntes y enunciados de laboratorio",
      source: "default",
    },
  ],
  BD: [
    {
      id: "def-bd-problemas",
      title: "Problemas BD",
      url: "https://raco.fib.upc.edu/",
      description: "Enunciados y coleccion de consultas",
      source: "default",
    },
    {
      id: "def-bd-apuntes",
      title: "Apuntes BD",
      url: "https://atenea.upc.edu/",
      description: "Diapositivas y guias de la asignatura",
      source: "default",
    },
  ],
};

export function getDefaultLinks(subjectId: string): Link[] {
  return defaultLinksBySubject[subjectId] ?? [];
}
