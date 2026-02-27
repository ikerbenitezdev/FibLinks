import {
  HiOutlineCalculator,
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

const tools = [
  {
    id: "media",
    title: "Calculadora de media",
    description: "Calcula nota final por porcentajes de forma rápida.",
    url: "https://gradecalc.mauri.app/",
    icon: HiOutlineCalculator,
  },
  {
    id: "discord",
    title: "Discord",
    description: "Abre Discord para coordinarte con clase.",
    url: "https://discord.gg/UVDQu2TW",
    icon: HiOutlineChatBubbleLeftRight,
  },
  {
    id: "youtube",
    title: "YouTube",
    description: "Tutoriales, explicaciones y clases grabadas de asignaturas.",
    url: "http://youtube.com/@eltraductor_ok",
    icon: HiOutlineDocumentText,
  },
  {
    id: "horario",
    title: "Horario de clase",
    description: "Consulta el horario oficial de las clases.",
    url: "https://www.fib.upc.edu/ca/estudis/graus/grau-en-enginyeria-informatica/horaris?&class=false&lang=false&quad=2025Q2",
    icon: HiOutlineClock,
  },
];

export default function UtilidadesPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <section className="card p-6 sm:p-8 mb-6">
          <p className="text-xs sm:text-sm font-medium text-stone-400 mb-1">FIB — UPC</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Utilidades
          </h1>
          <p className="text-stone-500 mt-2 text-sm sm:text-base max-w-2xl">
            Accesos rápidos para tareas habituales: cálculos de nota, comunicación y organización.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-5 sm:p-6 flex items-start gap-4"
              >
                <div className="h-11 w-11 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="text-xl" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-stone-900">{tool.title}</h2>
                    <HiOutlineArrowTopRightOnSquare className="text-sm text-stone-400" />
                  </div>
                  <p className="text-sm text-stone-500 mt-1">{tool.description}</p>
                </div>
              </a>
            );
          })}
        </section>
      </div>
    </main>
  );
}
