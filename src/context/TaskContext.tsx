
import React, { createContext, useContext, ReactNode } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import { Task, Category, TaskFilter } from '@/lib/types';

interface TaskContextType {
  // Tasks
  tasks: Task[];
  allTasks: Task[];
  loading: boolean;
  filter: TaskFilter;
  updateFilter: (filter: Partial<TaskFilter>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task | null;
  updateTask: (taskId: string, updates: Partial<Task>) => boolean;
  toggleTaskCompletion: (taskId: string) => boolean;
  deleteTask: (taskId: string) => boolean;
  getStats: () => {
    total: number;
    completed: number;
    active: number;
    dueToday: number;
    overdue: number;
    highPriority: number;
  };
  
  // Categories
  categories: Category[];
  categoriesLoading: boolean;
  addCategory: (category: Omit<Category, 'id'>) => Category | null;
  updateCategory: (categoryId: string, updates: Partial<Category>) => boolean;
  deleteCategory: (categoryId: string) => boolean;
  getCategoryById: (categoryId: string | undefined) => Category | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const {
    tasks,
    allTasks,
    loading,
    filter,
    updateFilter,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    getStats
  } = useTasks();
  
  const {
    categories,
    loading: categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
  } = useCategories();
  
  return (
    <TaskContext.Provider
      value={{
        tasks,
        allTasks,
        loading,
        filter,
        updateFilter,
        addTask,
        updateTask,
        toggleTaskCompletion,
        deleteTask,
        getStats,
        
        categories,
        categoriesLoading,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  
  return context;
}
