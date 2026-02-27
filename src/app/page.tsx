"use client";

import { useState, useEffect, useMemo } from "react";
import NextLink from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaGitlab } from "react-icons/fa6";
import {
  HiOutlineAcademicCap,
  HiOutlineLink,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineMagnifyingGlass,
  HiOutlineSquares2X2,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import { Link, UserState } from "@/types";
import { getAllSubjects } from "@/data/subjects";
import { getDefaultLinks } from "@/data/defaultLinks";
import SubjectCard from "@/components/SubjectCard";
import CourseSelector from "@/components/CourseSelector";

const USER_ID_KEY = "fiblinks-user-id";
const allSubjectsMap = getAllSubjects();

function normalizeUserId(value: string) {
  return value.trim().toLowerCase();
}

async function fetchUserState(userId: string): Promise<UserState> {
  const response = await fetch(`/api/user-state/${encodeURIComponent(userId)}`);
  if (!response.ok) return { activeSubjects: [] };
  const payload = (await response.json()) as {
    state?: { activeSubjects?: string[] };
  };
  return {
    activeSubjects: payload.state?.activeSubjects ?? [],
  };
}

async function saveUserState(userId: string, state: UserState) {
  await fetch(`/api/user-state/${encodeURIComponent(userId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activeSubjects: state.activeSubjects }),
  });
}

async function fetchCommunityLinks(subjectIds: string[]) {
  if (subjectIds.length === 0) return {} as Record<string, Link[]>;

  const params = new URLSearchParams({ subjectIds: subjectIds.join(",") });
  const response = await fetch(`/api/community-links?${params.toString()}`);
  if (!response.ok) return {} as Record<string, Link[]>;

  const payload = (await response.json()) as {
    linksBySubject?: Record<
      string,
      Array<{
        id: string;
        title: string;
        url: string;
        description?: string;
        createdBy?: string;
      }>
    >;
  };

  const linksBySubject = payload.linksBySubject ?? {};
  return Object.fromEntries(
    Object.entries(linksBySubject).map(([subjectId, links]) => [
      subjectId,
      links.map((link) => ({ ...link, source: "community" as const })),
    ])
  );
}

export default function Home() {
  const [state, setState] = useState<UserState>({ activeSubjects: [] });
  const [userId, setUserId] = useState("");
  const [pendingUserId, setPendingUserId] = useState("");
  const [communityLinks, setCommunityLinks] = useState<Record<string, Link[]>>({});
  const [loaded, setLoaded] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [search, setSearch] = useState("");

  // Load user identity from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(USER_ID_KEY);
    const normalized = normalizeUserId(stored || "invitado");
    localStorage.setItem(USER_ID_KEY, normalized);
    setUserId(normalized);
    setPendingUserId(normalized);
  }, []);

  // Load user state from backend when user changes
  useEffect(() => {
    if (!userId) return;

    let active = true;
    setLoaded(false);

    fetchUserState(userId).then((remoteState) => {
      if (!active) return;
      setState(remoteState);
      setLoaded(true);
      if (remoteState.activeSubjects.length === 0) setShowSelector(true);
    });

    return () => {
      active = false;
    };
  }, [userId]);

  // Save user state to backend
  useEffect(() => {
    if (!loaded || !userId) return;
    saveUserState(userId, state);
  }, [state, loaded, userId]);

  // Load community links for active subjects
  useEffect(() => {
    if (!loaded) return;
    fetchCommunityLinks(state.activeSubjects).then((linksBySubject) => {
      setCommunityLinks(linksBySubject);
    });
  }, [state.activeSubjects, loaded]);

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

  const addLink = async (subjectId: string, title: string, url: string, description?: string) => {
    if (!userId) return;

    const response = await fetch("/api/community-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId, title, url, description, userId }),
    });

    if (!response.ok) return;

    const payload = (await response.json()) as {
      link?: Link;
    };

    if (!payload.link) return;

    const newLink = { ...payload.link, source: "community" as const };
    setCommunityLinks((prev) => ({
      ...prev,
      [subjectId]: [...(prev[subjectId] ?? []), newLink],
    }));
  };

  const deleteLink = async (subjectId: string, linkId: string) => {
    if (!userId) return;

    const response = await fetch("/api/community-links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId, linkId, userId }),
    });

    if (!response.ok) return;

    setCommunityLinks((prev) => ({
      ...prev,
      [subjectId]: (prev[subjectId] ?? []).filter((link) => link.id !== linkId),
    }));
  };

  const applyUserIdChange = () => {
    const normalized = normalizeUserId(pendingUserId);
    if (!normalized || normalized === userId || typeof window === "undefined") return;
    localStorage.setItem(USER_ID_KEY, normalized);
    setCommunityLinks({});
    setUserId(normalized);
  };

  // Active subjects with their definitions
  const activeSubjects = state.activeSubjects
    .map((id) => allSubjectsMap.get(id))
    .filter(Boolean);

  const totalLinks = activeSubjects.reduce((acc, subject) => {
    if (!subject) return acc;
    return acc + getDefaultLinks(subject.id).length + (communityLinks[subject.id]?.length ?? 0);
  }, 0);

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
          <div className="w-full sm:w-auto flex flex-col gap-2.5">
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
            </div>

            <div className="flex sm:hidden items-center gap-2 overflow-x-auto pb-1">
              <a
                href="https://raco.fib.upc.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 min-w-[92px] px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <img src="/logos/raco.png" alt="Racó" className="h-4.5 w-6.5" />
                <span className="text-xs font-medium text-stone-700">Racó</span>
              </a>
              <a
                href="https://atenea.upc.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 min-w-[92px] px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <img src="/logos/atenea.png" alt="Atenea" className="h-4.5 w-4.5" />
                <span className="text-xs font-medium text-stone-700">Atenea</span>
              </a>
              <a
                href="https://whola.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 min-w-[92px] px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <img src="/logos/whola.png" alt="Whola" className="h-4.5 w-4.5" />
                <span className="text-xs font-medium text-stone-700">Whola</span>
              </a>
              <a
                href="https://jutge.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 min-w-[92px] px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <img src="/logos/jutge.png" alt="Jutge" className="h-4.5 w-4.5" />
                <span className="text-xs font-medium text-stone-700">Jutge</span>
              </a>
              <a
                href="https://gitlab.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 min-w-[108px] px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <FaGitlab className="text-sm text-orange-600" />
                <span className="text-xs font-medium text-stone-700">Soluciones</span>
              </a>
              <NextLink
                href="/utilidades"
                className="h-9 min-w-[108px] px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <HiOutlineWrenchScrewdriver className="text-sm text-stone-600" />
                <span className="text-xs font-medium text-stone-700">Utilidades</span>
              </NextLink>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <a
                href="https://raco.fib.upc.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2"
              >
                <img src="/logos/raco.png" alt="Racó" className="h-5 w-8" />
                <span className="text-sm font-medium text-stone-700">Racó</span>
              </a>
              <a
                href="https://atenea.upc.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2"
              >
                <img src="/logos/atenea.png" alt="Atenea" className="h-5 w-5" />
                <span className="text-sm font-medium text-stone-700">Atenea</span>
              </a>
              <a
                href="https://whola.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2"
              >
                <img src="/logos/whola.png" alt="Whola" className="h-5 w-5" />
                <span className="text-sm font-medium text-stone-700">Whola</span>
              </a>
              <a
                href="https://jutge.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2"
              >
                <img src="/logos/jutge.png" alt="Jutge" className="h-5 w-5" />
                <span className="text-sm font-medium text-stone-700">Jutge</span>
              </a>
              <a
                href="https://gitlab.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2"
              >
                <FaGitlab className="text-base text-orange-600" />
                <span className="text-sm font-medium text-stone-700">Soluciones</span>
              </a>
              <NextLink
                href="/utilidades"
                className="h-10 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2"
              >
                <HiOutlineWrenchScrewdriver className="text-base text-stone-600" />
                <span className="text-sm font-medium text-stone-700">Utilidades</span>
              </NextLink>
            </div>
          </div>
          

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 w-64">
              <HiOutlineUser className="text-stone-400 text-lg flex-shrink-0" />
              <input
                type="text"
                value={pendingUserId}
                onChange={(e) => setPendingUserId(e.target.value)}
                onBlur={applyUserIdChange}
                className="flex-1 bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none min-w-0"
                placeholder="usuario"
              />
            </div>
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
                    data={{
                      links: [
                        ...getDefaultLinks(subject!.id),
                        ...(communityLinks[subject!.id] ?? []),
                      ],
                    }}
                    currentUserId={userId}
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