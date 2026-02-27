"use client";

import { useState, useEffect, useMemo } from "react";
import NextLink from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGitlab } from "react-icons/fa6";
import {
  HiOutlineAcademicCap,
  HiOutlineCheck,
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

const allSubjectsMap = getAllSubjects();

type PendingLinkItem = {
  subjectId: string;
  link: Link;
};

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
  if (subjectIds.length === 0) {
    return {
      linksBySubject: {} as Record<string, Link[]>,
      globalDefaultLinksBySubject: {} as Record<string, Link[]>,
    };
  }

  const params = new URLSearchParams({ subjectIds: subjectIds.join(",") });
  const response = await fetch(`/api/community-links?${params.toString()}`);
  if (!response.ok) {
    return {
      linksBySubject: {} as Record<string, Link[]>,
      globalDefaultLinksBySubject: {} as Record<string, Link[]>,
    };
  }

  const payload = (await response.json()) as {
    linksBySubject?: Record<
      string,
      Array<{
        id: string;
        title: string;
        url: string;
        description?: string;
        createdBy?: string;
        moderationStatus?: "pending" | "approved";
      }>
    >;
    globalDefaultLinksBySubject?: Record<
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
  const globalDefaultLinksBySubject = payload.globalDefaultLinksBySubject ?? {};

  return {
    linksBySubject: Object.fromEntries(
    Object.entries(linksBySubject).map(([subjectId, links]) => [
      subjectId,
      links.map((link) => ({ ...link, source: "community" as const })),
    ])
    ),
    globalDefaultLinksBySubject: Object.fromEntries(
      Object.entries(globalDefaultLinksBySubject).map(([subjectId, links]) => [
        subjectId,
        links.map((link) => ({ ...link, source: "default" as const })),
      ])
    ),
  };
}

async function fetchPendingLinks(): Promise<{
  allowed: boolean;
  links: PendingLinkItem[];
}> {
  const params = new URLSearchParams({ status: "pending" });
  const response = await fetch(`/api/community-links?${params.toString()}`);

  if (response.status === 403) {
    return { allowed: false, links: [] };
  }

  if (!response.ok) {
    return { allowed: true, links: [] };
  }

  const payload = (await response.json()) as {
    pendingLinks?: Array<{
      subjectId: string;
      link: Link;
    }>;
  };

  const links = (payload.pendingLinks ?? []).map((item) => ({
    subjectId: item.subjectId,
    link: { ...item.link, source: "community" as const },
  }));

  return { allowed: true, links };
}

async function moderatePendingLink(input: {
  subjectId: string;
  linkId: string;
  action: "approve" | "reject";
}) {
  const response = await fetch("/api/community-links", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return response.ok;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [state, setState] = useState<UserState>({ activeSubjects: [] });
  const [communityLinks, setCommunityLinks] = useState<Record<string, Link[]>>({});
  const [globalDefaultLinks, setGlobalDefaultLinks] = useState<Record<string, Link[]>>({});
  const [pendingLinks, setPendingLinks] = useState<PendingLinkItem[]>([]);
  const [canModerate, setCanModerate] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hydratedUserId, setHydratedUserId] = useState("");
  const [showSelector, setShowSelector] = useState(false);
  const [search, setSearch] = useState("");

  const userId = useMemo(
    () => normalizeUserId(session?.user?.email ?? ""),
    [session?.user?.email]
  );

  // Load user state from backend when user changes
  useEffect(() => {
    if (status === "loading") return;

    if (!userId) {
      setState({ activeSubjects: [] });
      setCommunityLinks({});
      setGlobalDefaultLinks({});
      setPendingLinks([]);
      setCanModerate(false);
      setHydratedUserId("");
      setLoaded(true);
      return;
    }

    let active = true;
    setLoaded(false);

    fetchUserState(userId).then((remoteState) => {
      if (!active) return;
      setState(remoteState);
      setHydratedUserId(userId);
      setLoaded(true);
      if (remoteState.activeSubjects.length === 0) setShowSelector(true);
    });

    return () => {
      active = false;
    };
  }, [userId, status]);

  // Save user state to backend
  useEffect(() => {
    if (!loaded || !userId || hydratedUserId !== userId) return;
    saveUserState(userId, state);
  }, [state, loaded, userId, hydratedUserId]);

  // Load community links for active subjects
  useEffect(() => {
    if (!loaded) return;
    fetchCommunityLinks(state.activeSubjects).then(({ linksBySubject, globalDefaultLinksBySubject }) => {
      setCommunityLinks(linksBySubject);
      setGlobalDefaultLinks(globalDefaultLinksBySubject);
    });
  }, [state.activeSubjects, loaded]);

  // Load pending links if current user can moderate
  useEffect(() => {
    if (!userId) {
      setCanModerate(false);
      setPendingLinks([]);
      return;
    }

    fetchPendingLinks().then(({ allowed, links }) => {
      setCanModerate(allowed);
      setPendingLinks(links);
    });
  }, [userId]);

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
      body: JSON.stringify({ subjectId, title, url, description }),
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

    if (newLink.moderationStatus === "approved") return;

    if (canModerate) {
      setPendingLinks((prev) => [{ subjectId, link: newLink }, ...prev]);
    }
  };

  const deleteLink = async (subjectId: string, linkId: string) => {
    if (!userId) return;

    const response = await fetch("/api/community-links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId, linkId }),
    });

    if (!response.ok) return;

    setCommunityLinks((prev) => ({
      ...prev,
      [subjectId]: (prev[subjectId] ?? []).filter((link) => link.id !== linkId),
    }));
  };

  const moderateLink = async (
    subjectId: string,
    linkId: string,
    action: "approve" | "reject"
  ) => {
    if (!userId) return;

    const ok = await moderatePendingLink({ subjectId, linkId, action });
    if (!ok) return;

    setPendingLinks((prev) =>
      prev.filter((item) => !(item.subjectId === subjectId && item.link.id === linkId))
    );

    if (action === "approve") {
      const { linksBySubject, globalDefaultLinksBySubject } = await fetchCommunityLinks(
        state.activeSubjects
      );
      setCommunityLinks(linksBySubject);
      setGlobalDefaultLinks(globalDefaultLinksBySubject);
    }
  };

  // Active subjects with their definitions
  const activeSubjects = state.activeSubjects
    .map((id) => allSubjectsMap.get(id))
    .filter(Boolean);

  const totalLinks = activeSubjects.reduce((acc, subject) => {
    if (!subject) return acc;
    return (
      acc +
      getDefaultLinks(subject.id).length +
      (globalDefaultLinks[subject.id]?.length ?? 0) +
      (communityLinks[subject.id]?.length ?? 0)
    );
  }, 0);

  const filtered = activeSubjects.filter(
    (s) =>
      s!.name.toLowerCase().startsWith(search.toLowerCase()) ||
      s!.id.toLowerCase().startsWith(search.toLowerCase())
  );

  if (status === "loading" || !loaded) return null;

  if (!userId) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-300 via-blue-200 to-cyan-100 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute -top-16 -left-12 h-56 w-56 rounded-full bg-violet-200/30 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="pointer-events-none absolute top-24 right-0 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl"
        />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 py-10 sm:py-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="card p-6 sm:p-10"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex-1"
              >
                <p className="text-xs sm:text-sm font-medium text-stone-400 mb-2">FIB — UPC</p>
                <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
                  Inicia sesión para usar FibLinks
                </h1>
                <p className="text-stone-500 mt-3 text-sm sm:text-base max-w-xl">
                  Guarda tus asignaturas en tu cuenta, añade enlaces privados y envía recursos
                  para revisión antes de publicarlos para todos.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.25 }}
                  className="mt-6 flex flex-wrap gap-2"
                >
                  <span className="badge">Sincronizado entre dispositivos</span>
                  <span className="badge">Enlaces privados por usuario</span>
                  <span className="badge">Moderación de contenido</span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="w-full lg:w-auto lg:min-w-[260px]"
              >
                <div className="rounded-2xl border border-stone-200 bg-gradient-to-br from-white to-stone-50 p-5 sm:p-6 shadow-sm">
                  <p className="text-sm text-stone-600 mb-4">
                    Accede con tu cuenta de Google para empezar.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => signIn("google")}
                    className="btn-primary w-full"
                  >
                    Entrar con Google
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        {/* ── Top Bar ── */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 mb-8 sm:mb-10"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
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

            <div className="flex items-center gap-3 flex-wrap">
              <div className="hidden lg:flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 max-w-xs">
                <HiOutlineUser className="text-stone-400 text-lg flex-shrink-0" />
                <span className="text-sm text-stone-700 truncate">{session?.user?.email}</span>
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
              <button
                onClick={() => signOut()}
                className="btn-ghost text-sm"
              >
                Salir
              </button>
            </div>
          </div>

          <div className="flex sm:hidden items-center gap-2 overflow-x-auto pb-1 pr-1">
              <a
                href="https://raco.fib.upc.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 min-w-[92px] px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <img src="/logos/raco.png" alt="Racó" className="h-4 w-6" />
                <span className="text-xs font-medium text-stone-700">Racó</span>
              </a>
              <a
                href="https://atenea.upc.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 min-w-[92px] px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <img src="/logos/atenea.png" alt="Atenea" className="h-4 w-4" />
                <span className="text-xs font-medium text-stone-700">Atenea</span>
              </a>
              <a
                href="https://whola.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 min-w-[92px] px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <img src="/logos/whola.png" alt="Whola" className="h-4 w-4" />
                <span className="text-xs font-medium text-stone-700">Whola</span>
              </a>
              <a
                href="https://jutge.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 min-w-[92px] px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <img src="/logos/jutge.png" alt="Jutge" className="h-4 w-4" />
                <span className="text-xs font-medium text-stone-700">Jutge</span>
              </a>
              <a
                href="https://gitlab.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 min-w-[108px] px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <FaGitlab className="text-sm text-orange-600" />
                <span className="text-xs font-medium text-stone-700">Soluciones</span>
              </a>
              <NextLink
                href="/utilidades"
                className="h-9 min-w-[108px] px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
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
                className="h-10 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap"
              >
                <img src="/logos/raco.png" alt="Racó" className="h-5 w-8" />
                <span className="text-sm font-medium text-stone-700">Racó</span>
              </a>
              <a
                href="https://atenea.upc.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap"
              >
                <img src="/logos/atenea.png" alt="Atenea" className="h-5 w-5" />
                <span className="text-sm font-medium text-stone-700">Atenea</span>
              </a>
              <a
                href="https://whola.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap"
              >
                <img src="/logos/whola.png" alt="Whola" className="h-5 w-5" />
                <span className="text-sm font-medium text-stone-700">Whola</span>
              </a>
              <a
                href="https://jutge.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap"
              >
                <img src="/logos/jutge.png" alt="Jutge" className="h-5 w-5" />
                <span className="text-sm font-medium text-stone-700">Jutge</span>
              </a>
              <a
                href="https://gitlab.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap"
              >
                <FaGitlab className="text-base text-orange-600" />
                <span className="text-sm font-medium text-stone-700">Soluciones</span>
              </a>
              <NextLink
                href="/utilidades"
                className="h-10 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap"
              >
                <HiOutlineWrenchScrewdriver className="text-base text-stone-600" />
                <span className="text-sm font-medium text-stone-700">Utilidades</span>
              </NextLink>
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

        {canModerate && (
          <section className="mb-8 sm:mb-10">
            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-stone-900">
                    Enlaces pendientes de revisión
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                    Revisa, acepta o rechaza enlaces de la comunidad.
                  </p>
                </div>
                <span className="badge">{pendingLinks.length} pendientes</span>
              </div>

              {pendingLinks.length === 0 ? (
                <p className="text-sm text-stone-400">No hay enlaces pendientes ahora mismo.</p>
              ) : (
                <div className="space-y-2">
                  {pendingLinks.map((item) => {
                    const subjectName = allSubjectsMap.get(item.subjectId)?.name ?? item.subjectId;
                    return (
                      <div
                        key={`${item.subjectId}-${item.link.id}`}
                        className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 sm:px-4 flex flex-col sm:flex-row sm:items-center gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-stone-400">
                            {item.subjectId} · {subjectName}
                          </p>
                          <a
                            href={item.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-stone-700 hover:text-violet-600 transition-colors"
                          >
                            {item.link.title}
                          </a>
                          {item.link.description && (
                            <p className="text-xs text-stone-500 mt-0.5 truncate">
                              {item.link.description}
                            </p>
                          )}
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            Enviado por {item.link.createdBy ?? "anonimo"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => moderateLink(item.subjectId, item.link.id, "approve")}
                            className="h-9 px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-sm font-medium inline-flex items-center gap-1.5"
                          >
                            <HiOutlineCheck className="text-base" />
                            Aceptar
                          </button>
                          <button
                            onClick={() => moderateLink(item.subjectId, item.link.id, "reject")}
                            className="h-9 px-3 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors text-sm font-medium inline-flex items-center gap-1.5"
                          >
                            <HiOutlineXMark className="text-base" />
                            Rechazar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

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
                        ...(globalDefaultLinks[subject!.id] ?? []),
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