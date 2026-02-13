"use client";

import { Subject } from "@/types";
import { useState } from "react";

interface SubjectCardProps {
  subject: Subject;
  onDelete: (id: string) => void;
  onAddLink: (subjectId: string, title: string, url: string, description?: string) => void;
  onDeleteLink: (subjectId: string, linkId: string) => void;
}

export default function SubjectCard({ subject, onDelete, onAddLink, onDeleteLink }: SubjectCardProps) {
  const [showLinks, setShowLinks] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDescription, setLinkDescription] = useState("");

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {subject.name}
          </h3>
          {subject.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {subject.description}
            </p>
          )}
          <div className="mt-2 text-sm text-gray-500">
            {subject.links.length} enlace{subject.links.length !== 1 && "s"}
          </div>
        </div>
        <button
          onClick={() => onDelete(subject.id)}
          className="text-red-500 hover:text-red-700 font-semibold"
          title="Eliminar asignatura"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setShowLinks(!showLinks)}
          className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {showLinks ? "Ocultar enlaces" : "Ver enlaces"}
        </button>

        {showLinks && (
          <div className="mt-4 space-y-3">
            {subject.links.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                No hay enlaces aún
              </p>
            ) : (
              subject.links.map((link) => (
                <div
                  key={link.id}
                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md flex justify-between items-start"
                >
                  <div className="flex-1">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      {link.title}
                    </a>
                    {link.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {link.description}
                      </p>
                    )}
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 break-all">
                      {link.url}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteLink(subject.id, link.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                    title="Eliminar enlace"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}

            <button
              onClick={() => setShowAddLink(!showAddLink)}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              {showAddLink ? "Cancelar" : "+ Añadir enlace"}
            </button>

            {showAddLink && (
              <form onSubmit={handleAddLink} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título del enlace *
                  </label>
                  <input
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                    placeholder="ej: Apuntes tema 1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL *
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción (opcional)
                  </label>
                  <input
                    type="text"
                    value={linkDescription}
                    onChange={(e) => setLinkDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                    placeholder="Descripción breve"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Guardar enlace
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
