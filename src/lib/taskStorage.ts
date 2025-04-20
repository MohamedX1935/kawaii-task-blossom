import { Task, Category } from './types';

// LocalStorage keys
const TASKS_KEY = 'imanes-tasks:tasks';
const CATEGORIES_KEY = 'imanes-tasks:categories';

// Default categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Personal', color: 'kawaii-pink', icon: 'heart' },
  { id: '2', name: 'Work', color: 'kawaii-blue', icon: 'pen' },
  { id: '3', name: 'Shopping', color: 'kawaii-mint', icon: 'star' },
  { id: '4', name: 'School', color: 'kawaii-lavender', icon: 'book' },
];

// Load tasks from localStorage
export const loadTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [];
  }
};

// Save tasks to localStorage
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};

// Load categories from localStorage
export const loadCategories = (): Category[] => {
  try {
    const categories = localStorage.getItem(CATEGORIES_KEY);
    if (!categories) {
      // Initialize with default categories if none exist
      saveCategoriesHelper(defaultCategories);
      return defaultCategories;
    }
    return JSON.parse(categories);
  } catch (error) {
    console.error('Failed to load categories:', error);
    return defaultCategories;
  }
};

// Save categories to localStorage (helper)
const saveCategoriesHelper = (categories: Category[]): void => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories:', error);
  }
};

// Save categories to localStorage (public)
export const saveCategories = (categories: Category[]): void => {
  saveCategoriesHelper(categories);
};

// Helper to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Add a new task
export const addTask = (task: Omit<Task, 'id' | 'createdAt'>): Task => {
  const tasks = loadTasks();
  const newTask: Task = {
    ...task,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

// Update an existing task
export const updateTask = (taskId: string, updates: Partial<Task>): Task | null => {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return null;
  }
  
  const updatedTask = { ...tasks[taskIndex], ...updates };
  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);
  
  return updatedTask;
};

// Delete a task
export const deleteTask = (taskId: string): boolean => {
  const tasks = loadTasks();
  const newTasks = tasks.filter(task => task.id !== taskId);
  
  if (newTasks.length === tasks.length) {
    return false;
  }
  
  saveTasks(newTasks);
  return true;
};

// Add a category
export const addCategory = (category: Omit<Category, 'id'>): Category => {
  const categories = loadCategories();
  const newCategory: Category = {
    ...category,
    id: generateId(),
  };
  
  categories.push(newCategory);
  saveCategories(categories);
  
  return newCategory;
};

// Auto-backup functionality (runs every 30 seconds)
let backupInterval: number | null = null;

export const startAutoBackup = (): void => {
  if (backupInterval) return;
  
  backupInterval = window.setInterval(() => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    try {
      const tasks = loadTasks();
      const categories = loadCategories();
      
      const backupData = {
        tasks,
        categories,
        timestamp,
        version: '1.0.0'
      };
      
      localStorage.setItem(`imanes-tasks:backup-${timestamp}`, JSON.stringify(backupData));
      
      // Keep only the 5 most recent backups
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('imanes-tasks:backup-'))
        .sort()
        .reverse();
      
      if (backupKeys.length > 5) {
        backupKeys.slice(5).forEach(key => localStorage.removeItem(key));
      }
      
      console.log(`Auto backup created at ${timestamp}`);
    } catch (error) {
      console.error('Auto backup failed:', error);
    }
  }, 30000); // Every 30 seconds
};

export const stopAutoBackup = (): void => {
  if (backupInterval) {
    clearInterval(backupInterval);
    backupInterval = null;
  }
};
