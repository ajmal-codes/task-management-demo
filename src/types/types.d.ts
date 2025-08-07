export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
export interface ColumnType {
  id: string;
  title: string;
  order: number;
  color?:string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  labels: string[];
  assignedTo: string | null;
  order: number;
  createdAt: string;
}

export interface FilterState {
  priority: string;
  dueDate: string;
  assignedTo: string;
  labels: string[];
}

export interface DeleteConfirm {
  type: "task" | "column" | "user";
  id: string;
  name: string;
}