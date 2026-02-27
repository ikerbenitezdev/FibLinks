"use client";

import { SubjectDef, Link, SubjectUserData } from "@/types";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineChevronDown,
  HiOutlineLink,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineEyeSlash,
} from "react-icons/hi2";

interface SubjectCardProps {
  subject: SubjectDef;
  data: SubjectUserData;
  currentUserId: string;
  onHide: (id: string) => void;
  onAddLink: (subjectId: string, title: string, url: string, description?: string) => void;
  onDeleteLink: (subjectId: string, linkId: string) => void;
}

const COLORS = [
  { bg: "bg-violet-100", text: "text-violet-600", dot: "bg-violet-400", badge: "bg-violet-50 text-violet-600" },
  { bg: "bg-sky-100", text: "text-sky-600", dot: "bg-sky-400", badge: "bg-sky-50 text-sky-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600", dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-600" },
  { bg: "bg-amber-100", text: "text-amber-600", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-600" },
  { bg: "bg-rose-100", text: "text-rose-600", dot: "bg-rose-400", badge: "bg-rose-50 text-rose-600" },
  { bg: "bg-teal-100", text: "text-teal-600", dot: "bg-teal-400", badge: "bg-teal-50 text-teal-600" },
];

function getColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function normalizeUserId(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

export default function SubjectCard({
  subject,
  data,
  currentUserId,
  onHide,
  onAddLink,
  onDeleteLink,
}: SubjectCardProps) {
  const [open, setOpen] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDescription, setLinkDescription] = useState("");

  const color = getColor(subject.id);
  const links = data.links;
  const normalizedCurrentUser = normalizeUserId(currentUserId);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkTitle && linkUrl) {
      onAddLink(subject.id, linkTitle, linkUrl, linkDescription);
      setLinkTitle("");
      setLinkUrl("");
      setLinkDescription("");
      setShowAddLink(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
            <div
              className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl ${color.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
            >
              <span className={`font-bold text-[10px] sm:text-xs ${color.text}`}>
                {subject.id}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-stone-900 truncate">
                {subject.name}
              </h3>
              <span className={`text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-md ${color.badge} mt-1 inline-block`}>
                {subject.ects} ECTS
              </span>
            </div>
          </div>
          <button
            onClick={() => onHide(subject.id)}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-orange-500 hover:bg-orange-50 transition-all flex-shrink-0"
            title="Ocultar asignatura"
          >
            <HiOutlineEyeSlash className="text-lg" />
          </button>
        </div>
      </div>

      {/* Toggle links */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-5">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between rounded-xl bg-stone-50 hover:bg-stone-100 px-4 py-2.5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <HiOutlineLink className={`text-sm ${color.text}`} />
            <span className="text-sm font-medium text-stone-600">
              {links.length} enlace{links.length !== 1 && "s"}
            </span>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <HiOutlineChevronDown className="text-stone-400" />
          </motion.div>
        </button>
      </div>

      {/* Links area */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-4 sm:pb-6 space-y-2">
              {links.length === 0 ? (
                <p className="text-stone-400 text-sm text-center py-4">
                  Sin enlaces todavia
                </p>
              ) : (
                links.map((link) => (
                  <div
                    key={link.id}
                    className="group flex items-center gap-2.5 sm:gap-3 rounded-xl bg-stone-50 hover:bg-stone-100 px-3 sm:px-4 py-2.5 sm:py-3 transition-colors"
                  >
                    <div className={`h-2 w-2 rounded-full ${color.dot} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-stone-700 hover:text-violet-600 transition-colors flex items-center gap-1.5"
                      >
                        <span className="truncate">{link.title}</span>
                        <HiOutlineArrowTopRightOnSquare className="text-xs text-stone-400 flex-shrink-0" />
                      </a>
                      {link.description && (
                        <p className="text-stone-400 text-xs mt-0.5 truncate">
                          {link.description}
                        </p>
                      )}
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        {link.source === "default"
                          ? "Por defecto"
                          : `Comunidad · ${link.createdBy ?? "anonimo"}`}
                      </p>
                    </div>
                    {link.source !== "default" &&
                      (normalizeUserId(link.createdBy) === normalizedCurrentUser ||
                        !normalizeUserId(link.createdBy)) && (
                      <button
                        onClick={() => onDeleteLink(subject.id, link.id)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex-shrink-0"
                        title="Eliminar enlace"
                      >
                        <HiOutlineTrash className="text-sm" />
                      </button>
                    )}
                  </div>
                ))
              )}

              {/* Add link form */}
              {!showAddLink ? (
                <button
                  onClick={() => setShowAddLink(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 hover:border-stone-300 py-3 text-sm font-medium text-stone-400 hover:text-stone-600 transition-all"
                >
                  <HiOutlinePlus className="text-base" />
                  Anadir enlace
                </button>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddLink}
                  className="rounded-xl border border-stone-200 bg-white p-4 space-y-3"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Titulo *
                    </label>
                    <input
                      type="text"
                      value={linkTitle}
                      onChange={(e) => setLinkTitle(e.target.value)}
                      className="input-field text-sm"
                      placeholder="ej: Apuntes tema 1"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      URL *
                    </label>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="input-field text-sm"
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Nota
                    </label>
                    <input
                      type="text"
                      value={linkDescription}
                      onChange={(e) => setLinkDescription(e.target.value)}
                      className="input-field text-sm"
                      placeholder="Descripcion breve"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="submit" className="btn-primary text-sm flex-1">
                      <HiOutlineCheck className="text-base" />
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddLink(false)}
                      className="btn-ghost text-sm"
                    >
                      <HiOutlineXMark className="text-base" />
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
