'use client';

import { Course, Link, Topic } from '@/types';
import { useState } from 'react';

interface AddLinkFormProps {
  course: Course;
  onAddLink: (courseId: string, link: Link, topicId?: string, type?: 'exercise' | 'submission') => void;
  onAddTopic: (courseId: string, topic: Topic) => void;
  onCancel: () => void;
}

export default function AddLinkForm({ course, onAddLink, onAddTopic, onCancel }: AddLinkFormProps) {
  const [linkType, setLinkType] = useState<'general' | 'topic'>('general');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [contentType, setContentType] = useState<'exercise' | 'submission'>('exercise');
  const [newTopicName, setNewTopicName] = useState('');
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLink: Link = {
      id: `link-${Date.now()}`,
      title,
      url,
      description: description || undefined,
    };

    if (linkType === 'general') {
      onAddLink(course.id, newLink);
    } else if (selectedTopicId) {
      onAddLink(course.id, newLink, selectedTopicId, contentType);
    }

    setTitle('');
    setUrl('');
    setDescription('');
  };

  const handleCreateTopic = () => {
    if (newTopicName.trim()) {
      const newTopic: Topic = {
        id: `topic-${Date.now()}`,
        name: newTopicName,
        exercises: [],
        submissions: [],
      };
      onAddTopic(course.id, newTopic);
      setSelectedTopicId(newTopic.id);
      setNewTopicName('');
      setIsCreatingTopic(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Añadir Enlace a {course.name}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tipo de Enlace</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="general"
                  checked={linkType === 'general'}
                  onChange={() => setLinkType('general')}
                  className="mr-2"
                />
                General
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="topic"
                  checked={linkType === 'topic'}
                  onChange={() => setLinkType('topic')}
                  className="mr-2"
                />
                Por Tema
              </label>
            </div>
          </div>

          {linkType === 'topic' && (
            <>
              <div className="mb-4">
                <label htmlFor="topic" className="block text-sm font-medium mb-2">
                  Tema
                </label>
                {!isCreatingTopic ? (
                  <div>
                    <select
                      id="topic"
                      value={selectedTopicId}
                      onChange={(e) => setSelectedTopicId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                      required={linkType === 'topic'}
                    >
                      <option value="">Selecciona un tema</option>
                      {course.topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsCreatingTopic(true)}
                      className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline"
                    >
                      + Crear nuevo tema
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      placeholder="Nombre del nuevo tema"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCreateTopic}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                      >
                        Crear
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingTopic(false)}
                        className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-sm rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tipo de Contenido</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="exercise"
                      checked={contentType === 'exercise'}
                      onChange={() => setContentType('exercise')}
                      className="mr-2"
                    />
                    Ejercicio
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="submission"
                      checked={contentType === 'submission'}
                      onChange={() => setContentType('submission')}
                      className="mr-2"
                    />
                    Entrega
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Añadir Enlace
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
