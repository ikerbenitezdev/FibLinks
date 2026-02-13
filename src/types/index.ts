export interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  color?: string;
  links: Link[];
}
