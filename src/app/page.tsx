'use client';

import { Course, Semester, Link, Topic } from '@/types';
import { useState } from 'react';
import CourseCard from '@/components/CourseCard';
import AddCourseForm from '@/components/AddCourseForm';
import AddLinkForm from '@/components/AddLinkForm';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'course-1',
      name: 'Programación Avanzada',
      code: 'PA-101',
      semester: 'Q1',
      topics: [
        {
          id: 'topic-1',
          name: 'Tema 1: Introducción',
          exercises: [
            {
              id: 'ex-1',
              title: 'Ejercicio 1.1',
              url: 'https://example.com/ex1',
              description: 'Ejercicio de introducción',
            },
          ],
          submissions: [
            {
              id: 'sub-1',
              title: 'Entrega Tema 1',
              url: 'https://example.com/sub1',
            },
          ],
        },
      ],
      generalLinks: [
        {
          id: 'link-1',
          title: 'Aula Virtual',
          url: 'https://example.com/aula',
          description: 'Acceso al aula virtual',
        },
      ],
    },
  ]);
  const [selectedSemester, setSelectedSemester] = useState<Semester | 'all'>('all');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddLink, setShowAddLink] = useState<string | null>(null);

  const filteredCourses = selectedSemester === 'all'
    ? courses
    : courses.filter(course => course.semester === selectedSemester);

  const handleAddCourse = (course: Course) => {
    setCourses([...courses, course]);
    setShowAddCourse(false);
  };

  const handleAddLink = (courseId: string, link: Link, topicId?: string, type?: 'exercise' | 'submission') => {
    setCourses(courses.map(course => {
      if (course.id !== courseId) return course;

      if (!topicId) {
        return {
          ...course,
          generalLinks: [...course.generalLinks, link],
        };
      }

      return {
        ...course,
        topics: course.topics.map(topic => {
          if (topic.id !== topicId) return topic;

          if (type === 'exercise') {
            return {
              ...topic,
              exercises: [...topic.exercises, link],
            };
          } else {
            return {
              ...topic,
              submissions: [...topic.submissions, link],
            };
          }
        }),
      };
    }));
    setShowAddLink(null);
  };

  const handleAddTopic = (courseId: string, topic: Topic) => {
    setCourses(courses.map(course => {
      if (course.id !== courseId) return course;
      return {
        ...course,
        topics: [...course.topics, topic],
      };
    }));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">FibLinks Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Todos tus enlaces de asignaturas universitarias en un solo lugar
          </p>
        </header>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSemester('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSemester === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Todos
            </button>
            {(['Q1', 'Q2', 'Q3', 'Q4'] as Semester[]).map((semester) => (
              <button
                key={semester}
                onClick={() => setSelectedSemester(semester)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSemester === semester
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Cuatrimestre {semester.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddCourse(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors ml-auto"
          >
            + Añadir Asignatura
          </button>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No hay asignaturas en este cuatrimestre
            </p>
            <button
              onClick={() => setShowAddCourse(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Añadir primera asignatura
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="relative">
                <CourseCard course={course} />
                <button
                  onClick={() => setShowAddLink(course.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold transition-colors flex items-center justify-center"
                  title="Añadir enlace"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        )}

        {showAddCourse && (
          <AddCourseForm
            onAddCourse={handleAddCourse}
            onCancel={() => setShowAddCourse(false)}
          />
        )}

        {showAddLink && (
          <AddLinkForm
            course={courses.find(c => c.id === showAddLink)!}
            onAddLink={handleAddLink}
            onAddTopic={handleAddTopic}
            onCancel={() => setShowAddLink(null)}
          />
        )}
      </div>
    </div>
  );
}
