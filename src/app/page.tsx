"use client";

import { useState, useEffect } from "react";
import { Subject, Link } from "@/types";
import SubjectCard from "@/components/SubjectCard";
import AddSubjectForm from "@/components/AddSubjectForm";

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Load subjects from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("fiblinks-subjects");
    if (stored) {
      try {
        setSubjects(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading subjects:", e);
      }
    }
  }, []);

  // Save subjects to localStorage whenever they change
  useEffect(() => {
    if (subjects.length > 0 || localStorage.getItem("fiblinks-subjects")) {
      localStorage.setItem("fiblinks-subjects", JSON.stringify(subjects));
    }
  }, [subjects]);

  const addSubject = (name: string, description?: string) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name,
      description,
      links: [],
    };
    setSubjects([...subjects, newSubject]);
  };

  const deleteSubject = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta asignatura?")) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const addLink = (
    subjectId: string,
    title: string,
    url: string,
    description?: string
  ) => {
    const newLink: Link = {
      id: crypto.randomUUID(),
      title,
      url,
      description,
    };

    setSubjects(
      subjects.map((subject) =>
        subject.id === subjectId
          ? { ...subject, links: [...subject.links, newLink] }
          : subject
      )
    );
  };

  const deleteLink = (subjectId: string, linkId: string) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              links: subject.links.filter((link) => link.id !== linkId),
            }
          : subject
      )
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            FibLinks Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus asignaturas y enlaces en un solo lugar
          </p>
        </header>

        <AddSubjectForm onAdd={addSubject} />

        {subjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No tienes asignaturas aún. ¡Añade tu primera asignatura!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onDelete={deleteSubject}
                onAddLink={addLink}
                onDeleteLink={deleteLink}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
