'use client';

import { Course, Semester } from '@/types';
import { useState } from 'react';

interface AddCourseFormProps {
  onAddCourse: (course: Course) => void;
  onCancel: () => void;
}

export default function AddCourseForm({ onAddCourse, onCancel }: AddCourseFormProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [semester, setSemester] = useState<Semester>('Q1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name,
      code,
      semester,
      topics: [],
      generalLinks: [],
    };

    onAddCourse(newCourse);
    setName('');
    setCode('');
    setSemester('Q1');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Añadir Nueva Asignatura</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nombre de la Asignatura
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="code" className="block text-sm font-medium mb-2">
              Código de la Asignatura
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="semester" className="block text-sm font-medium mb-2">
              Cuatrimestre
            </label>
            <select
              id="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value as Semester)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            >
              <option value="Q1">Cuatrimestre 1</option>
              <option value="Q2">Cuatrimestre 2</option>
              <option value="Q3">Cuatrimestre 3</option>
              <option value="Q4">Cuatrimestre 4</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Añadir Asignatura
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
