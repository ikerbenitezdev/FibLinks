'use client';

import { Course } from '@/types';
import { useState } from 'react';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold">{course.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{course.code}</p>
        </div>
        <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
          {course.semester}
        </span>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline mt-2"
      >
        {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {course.generalLinks.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Enlaces Generales</h4>
              <ul className="space-y-1">
                {course.generalLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      {link.title}
                    </a>
                    {link.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                        {link.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {course.topics.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Temas</h4>
              {course.topics.map((topic) => (
                <div key={topic.id} className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <h5 className="font-medium mb-2">{topic.name}</h5>
                  
                  {topic.exercises.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Ejercicios:</p>
                      <ul className="ml-4 space-y-1">
                        {topic.exercises.map((exercise) => (
                          <li key={exercise.id}>
                            <a
                              href={exercise.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                            >
                              {exercise.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {topic.submissions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Entregas:</p>
                      <ul className="ml-4 space-y-1">
                        {topic.submissions.map((submission) => (
                          <li key={submission.id}>
                            <a
                              href={submission.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                            >
                              {submission.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
