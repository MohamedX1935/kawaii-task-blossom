
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: Priority;
  categoryId?: string;
}

export type Priority = 'low' | 'medium' | 'high';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface TaskFilter {
  status?: 'all' | 'active' | 'completed';
  categoryId?: string;
  searchQuery?: string;
  sortBy?: 'dueDate' | 'priority' | 'title' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}
