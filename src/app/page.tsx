"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineAcademicCap,
  HiOutlineLink,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineMagnifyingGlass,
  HiOutlineSquares2X2,
  HiOutlineXMark,
} from "react-icons/hi2";
import { Link, SubjectUserData, UserState } from "@/types";
import { getAllSubjects } from "@/data/subjects";
import SubjectCard from "@/components/SubjectCard";
import CourseSelector from "@/components/CourseSelector";

const STORAGE_KEY = "fiblinks-state";
const allSubjectsMap = getAllSubjects();

function loadState(): UserState {
  if (typeof window === "undefined") return { activeSubjects: [], subjectData: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { activeSubjects: [], subjectData: {} };
}

function saveState(state: UserState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function Home() {
  const [state, setState] = useState<UserState>({ activeSubjects: [], subjectData: {} });
  const [loaded, setLoaded] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [search, setSearch] = useState("");

  // Load from localStorage
  useEffect(() => {
    const s = loadState();
    setState(s);
    setLoaded(true);
    // If first visit, show course selector
    if (s.activeSubjects.length === 0) setShowSelector(true);
  }, []);

  // Save on change
  useEffect(() => {
    if (loaded) saveState(state);
  }, [state, loaded]);

  const activeSet = useMemo(() => new Set(state.activeSubjects), [state.activeSubjects]);

  const toggleSubject = (id: string) => {
    setState((prev) => {
      const active = new Set(prev.activeSubjects);
      if (active.has(id)) {
        active.delete(id);
      } else {
        active.add(id);
      }
      return { ...prev, activeSubjects: Array.from(active) };
    });
  };

  const bulkAdd = (ids: string[]) => {
    setState((prev) => {
      const active = new Set(prev.activeSubjects);
      ids.forEach((id) => active.add(id));
      return { ...prev, activeSubjects: Array.from(active) };
    });
  };

  const hideSubject = (id: string) => {
    setState((prev) => ({
      ...prev,
      activeSubjects: prev.activeSubjects.filter((s) => s !== id),
    }));
  };

  const addLink = (subjectId: string, title: string, url: string, description?: string) => {
    const newLink: Link = { id: crypto.randomUUID(), title, url, description };
    setState((prev) => ({
      ...prev,
      subjectData: {
        ...prev.subjectData,
        [subjectId]: {
          links: [...(prev.subjectData[subjectId]?.links || []), newLink],
        },
      },
    }));
  };

  const deleteLink = (subjectId: string, linkId: string) => {
    setState((prev) => ({
      ...prev,
      subjectData: {
        ...prev.subjectData,
        [subjectId]: {
          links: (prev.subjectData[subjectId]?.links || []).filter((l) => l.id !== linkId),
        },
      },
    }));
  };

  // Active subjects with their definitions
  const activeSubjects = state.activeSubjects
    .map((id) => allSubjectsMap.get(id))
    .filter(Boolean);

  const totalLinks = Object.values(state.subjectData).reduce(
    (acc, d) => acc + (d.links?.length || 0),
    0
  );

  const filtered = activeSubjects.filter(
    (s) =>
      s!.name.toLowerCase().startsWith(search.toLowerCase()) ||
      s!.id.toLowerCase().startsWith(search.toLowerCase())
  );

  if (!loaded) return null;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        {/* ── Top Bar ── */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10"
        >
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-stone-900 flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-bold">F</span>
              </div>
              <span className="text-lg sm:text-xl font-semibold text-stone-900 tracking-tight">
                FibLinks
              </span>
            </div>
            <button
              onClick={() => setShowSelector(!showSelector)}
              className={`btn-primary rounded-xl h-10 px-4 text-sm ${
                showSelector ? "!bg-violet-600" : ""
              }`}
            >
              <HiOutlineAdjustmentsHorizontal className="text-lg" />
            </button>
            <button>
              <a href="https://raco.fib.upc.edu/">Racó</a>
            </button>
            <button>
              <a href="https://atenea.upc.edu/">Atenea</a>
            </button>
          </div>
          

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 sm:px-4 py-2 sm:py-2.5 flex-1 sm:flex-none sm:w-64">
              <HiOutlineMagnifyingGlass className="text-stone-400 text-lg flex-shrink-0" />
              <input
                type="text"
                placeholder="Buscar asignatura..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none min-w-0"
              />
            </div>
            {/* <button
              onClick={() => setShowSelector(!showSelector)}
              className={`hidden sm:inline-flex btn-primary rounded-xl h-11 px-5 text-sm ${
                showSelector ? "!bg-violet-600 hover:!bg-violet-700" : ""
              }`}
            >
              <HiOutlineAdjustmentsHorizontal className="text-lg" />
              <span>Gestionar</span>
            </button> */}
          </div>
        </motion.nav>

        {/* ── Header + Stats ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-10"
        >
          <div className="card px-6 py-7 sm:px-8 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm font-medium text-stone-400 mb-1">FIB — UPC</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Tu espacio academico
              </h1>
              <p className="text-stone-500 mt-1.5 sm:mt-2 max-w-md text-sm sm:text-base leading-relaxed">
                Selecciona tus asignaturas, recopila enlaces y accede a todo desde un solo lugar.
              </p>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <StatCard
                icon={<HiOutlineAcademicCap />}
                label="Activas"
                value={state.activeSubjects.length}
                color="bg-violet-50 text-violet-600"
              />
              <StatCard
                icon={<HiOutlineLink />}
                label="Enlaces"
                value={totalLinks}
                color="bg-amber-50 text-amber-600"
              />
            </div>
          </div>
        </motion.section>

        {/* ── Course Selector Panel ── */}
        <AnimatePresence>
          {showSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <div className="card p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-stone-900">
                      Gestionar asignaturas
                    </h2>
                    <p className="text-sm text-stone-400 mt-0.5">
                      Activa las asignaturas que quieras ver en tu dashboard
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSelector(false)}
                    className="h-9 w-9 rounded-xl flex items-center justify-center text-stone-400 hover:bg-stone-100 transition-colors"
                  >
                    <HiOutlineXMark className="text-lg" />
                  </button>
                </div>
                <CourseSelector
                  activeSubjects={activeSet}
                  onToggle={toggleSubject}
                  onBulkAdd={bulkAdd}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Subject Grid ── */}
        {activeSubjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card flex flex-col items-center justify-center py-16 sm:py-24 px-6 sm:px-8 text-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-5">
              <HiOutlineSquares2X2 className="text-3xl text-stone-400" />
            </div>
            <p className="text-stone-500 font-medium text-lg">
              No tienes asignaturas activas
            </p>
            <p className="text-stone-400 text-sm mt-1 mb-5">
              Pulsa &quot;Gestionar&quot; para elegir las asignaturas de tu curso.
            </p>
            <button
              onClick={() => setShowSelector(true)}
              className="btn-primary text-sm"
            >
              <HiOutlineAdjustmentsHorizontal className="text-lg" />
              Elegir asignaturas
            </button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <div className="card py-16 text-center">
            <p className="text-stone-400">
              No se encontraron resultados para &quot;{search}&quot;
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((subject) => (
                <motion.div
                  key={subject!.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <SubjectCard
                    subject={subject!}
                    data={state.subjectData[subject!.id] || { links: [] }}
                    onHide={hideSubject}
                    onAddLink={addLink}
                    onDeleteLink={deleteLink}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}

/* ── Stat Card ── */
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="card px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4 flex-1 sm:flex-none sm:min-w-[140px]">
      <div className={`h-9 w-9 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center text-lg sm:text-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-stone-400">
          {label}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-stone-900 leading-none mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}