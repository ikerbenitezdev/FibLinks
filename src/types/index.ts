export interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
}

export interface Topic {
  id: string;
  name: string;
  exercises: Link[];
  submissions: Link[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  semester: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  topics: Topic[];
  generalLinks: Link[];
}

export type Semester = 'Q1' | 'Q2' | 'Q3' | 'Q4';
