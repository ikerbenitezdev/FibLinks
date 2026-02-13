"use client";

import { courses, specialties } from "@/data/subjects";
import { SubjectDef } from "@/types";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineAcademicCap,
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlinePlusCircle,
  HiOutlineXMark,
} from "react-icons/hi2";

interface CourseSelectorProps {
  activeSubjects: Set<string>;
  onToggle: (id: string) => void;
  onBulkAdd: (ids: string[]) => void;
}

export default function CourseSelector({
  activeSubjects,
  onToggle,
  onBulkAdd,
}: CourseSelectorProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {/* Obligatorias por cuatrimestre */}
      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 ml-1">
        Asignaturas obligatorias
      </p>
      {courses.map((course) => (
        <SectionAccordion
          key={course.id}
          id={course.id}
          label={course.label}
          subjects={course.subjects}
          activeSubjects={activeSubjects}
          onToggle={onToggle}
          onBulkAdd={onBulkAdd}
          isOpen={openSection === course.id}
          onOpenToggle={() => toggle(course.id)}
        />
      ))}

      {/* Especialidades */}
      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 ml-1 mt-6">
        Especialidades
      </p>
      {specialties.map((spec) => {
        const allSubs = [...spec.obligatory, ...spec.complementary];
        return (
          <SectionAccordion
            key={spec.id}
            id={spec.id}
            label={spec.label}
            subjects={allSubs}
            activeSubjects={activeSubjects}
            onToggle={onToggle}
            onBulkAdd={onBulkAdd}
            isOpen={openSection === spec.id}
            onOpenToggle={() => toggle(spec.id)}
            groupLabels={[
              { label: "Obligatorias", count: spec.obligatory.length },
              { label: "Complementarias", count: spec.complementary.length },
            ]}
          />
        );
      })}
    </div>
  );
}

function SectionAccordion({
  id,
  label,
  subjects,
  activeSubjects,
  onToggle,
  onBulkAdd,
  isOpen,
  onOpenToggle,
  groupLabels,
}: {
  id: string;
  label: string;
  subjects: SubjectDef[];
  activeSubjects: Set<string>;
  onToggle: (id: string) => void;
  onBulkAdd: (ids: string[]) => void;
  isOpen: boolean;
  onOpenToggle: () => void;
  groupLabels?: { label: string; count: number }[];
}) {
  const activeCount = subjects.filter((s) => activeSubjects.has(s.id)).length;
  const allActive = activeCount === subjects.length;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
      <button
        onClick={onOpenToggle}
        className="w-full flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-4 hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
            <HiOutlineAcademicCap className="text-violet-500 text-base sm:text-lg" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-stone-800 leading-tight">{label}</p>
            <p className="text-[11px] sm:text-xs text-stone-400">
              {activeCount}/{subjects.length} activas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <HiOutlineChevronDown className="text-stone-400" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 sm:px-5 pb-4 pt-1 border-t border-stone-100">
              {/* Bulk add */}
              {!allActive && (
                <button
                  onClick={() => onBulkAdd(subjects.map((s) => s.id))}
                  className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 mb-3 mt-2 transition-colors"
                >
                  <HiOutlinePlusCircle className="text-base" />
                  Activar todas
                </button>
              )}

              <div className="space-y-1.5">
                {subjects.map((subject) => {
                  const active = activeSubjects.has(subject.id);
                  return (
                    <button
                      key={subject.id}
                      onClick={() => onToggle(subject.id)}
                      className={`w-full flex items-center justify-between rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-left transition-all ${
                        active
                          ? "bg-violet-50 border border-violet-200"
                          : "bg-stone-50 border border-transparent hover:bg-stone-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <span
                          className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-md flex-shrink-0 ${
                            active
                              ? "bg-violet-200 text-violet-700"
                              : "bg-stone-200 text-stone-500"
                          }`}
                        >
                          {subject.id}
                        </span>
                        <span
                          className={`text-xs sm:text-sm truncate ${
                            active
                              ? "text-stone-800 font-medium"
                              : "text-stone-500"
                          }`}
                        >
                          {subject.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
                        <span className="text-[10px] text-stone-400 hidden sm:inline">
                          {subject.ects} ECTS
                        </span>
                        {active ? (
                          <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-lg bg-violet-500 flex items-center justify-center">
                            <HiOutlineCheck className="text-white text-[10px] sm:text-xs" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-lg border-2 border-stone-200" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
