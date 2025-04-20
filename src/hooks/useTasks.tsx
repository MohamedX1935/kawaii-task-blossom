
import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFilter } from '@/lib/types';
import { 
  loadTasks, 
  saveTasks, 
  addTask as addTaskToStorage,
  updateTask as updateTaskInStorage,
  deleteTask as deleteTaskFromStorage,
  startAutoBackup,
  stopAutoBackup
} from '@/lib/taskStorage';
import { toast } from "@/components/ui/use-toast";
import { useToast as useSonnerToast } from "@/components/ui/sonner";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>({
    status: 'all',
    sortBy: 'createdAt',
    sortDirection: 'desc'
  });
  const { toast: sonnerToast } = useSonnerToast();

  // Load tasks on mount
  useEffect(() => {
    try {
      const loadedTasks = loadTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast({
        title: "Error loading tasks",
        description: "Your tasks couldn't be loaded. Please try refreshing the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }

    // Start auto backup
    startAutoBackup();
    
    // Clean up on unmount
    return () => {
      stopAutoBackup();
    };
  }, []);

  // Filtered and sorted tasks
  const filteredTasks = useCallback(() => {
    return tasks
      .filter(task => {
        // Filter by status
        if (filter.status === 'active' && task.completed) return false;
        if (filter.status === 'completed' && !task.completed) return false;
        
        // Filter by category
        if (filter.categoryId && task.categoryId !== filter.categoryId) return false;
        
        // Filter by search query
        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          return (
            task.title.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query))
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        const direction = filter.sortDirection === 'asc' ? 1 : -1;
        
        switch (filter.sortBy) {
          case 'dueDate':
            if (!a.dueDate) return direction;
            if (!b.dueDate) return -direction;
            return direction * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
            
          case 'priority': {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return direction * (priorityOrder[a.priority] - priorityOrder[b.priority]);
          }
            
          case 'title':
            return direction * a.title.localeCompare(b.title);
            
          default: // createdAt
            return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
      });
  }, [tasks, filter]);

  // Add a new task
  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask = addTaskToStorage(task);
      setTasks(prev => [...prev, newTask]);
      
      sonnerToast("Task added successfully", {
        description: `"${task.title}" has been added`,
        action: {
          label: "Undo",
          onClick: () => deleteTask(newTask.id)
        }
      });
      
      return newTask;
    } catch (error) {
      console.error('Failed to add task:', error);
      toast({
        title: "Failed to add task",
        description: "Your task couldn't be saved. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [sonnerToast]);

  // Update a task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = updateTaskInStorage(taskId, updates);
      
      if (!updatedTask) {
        toast({
          title: "Task not found",
          description: "The task you're trying to update doesn't exist.",
          variant: "destructive"
        });
        return false;
      }
      
      setTasks(prev => 
        prev.map(task => task.id === taskId ? { ...task, ...updates } : task)
      );
      
      if ('completed' in updates) {
        const message = updates.completed ? "Task completed" : "Task marked as active";
        sonnerToast(message, {
          description: `"${updatedTask.title}"`,
        });
      } else {
        sonnerToast("Task updated", {
          description: `"${updatedTask.title}" has been updated`,
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to update task:', error);
      toast({
        title: "Failed to update task",
        description: "Your task couldn't be updated. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [sonnerToast]);

  // Toggle task completion
  const toggleTaskCompletion = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;
    
    return updateTask(taskId, { completed: !task.completed });
  }, [tasks, updateTask]);

  // Delete a task
  const deleteTask = useCallback((taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return false;
      
      const success = deleteTaskFromStorage(taskId);
      
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        
        sonnerToast("Task deleted", {
          description: `"${task.title}" has been removed`,
          action: {
            label: "Undo",
            onClick: () => {
              const { id, ...taskWithoutId } = task;
              addTask({ ...taskWithoutId, createdAt: task.createdAt } as any);
            }
          }
        });
      }
      
      return success;
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast({
        title: "Failed to delete task",
        description: "Your task couldn't be deleted. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [tasks, addTask, sonnerToast]);

  // Update filter
  const updateFilter = useCallback((newFilter: Partial<TaskFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  // Get task stats
  const getStats = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueToday = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }).length;
    
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return new Date(task.dueDate) < new Date();
    }).length;
    
    const highPriority = tasks.filter(task => 
      !task.completed && task.priority === 'high'
    ).length;
    
    return { total, completed, active, dueToday, overdue, highPriority };
  }, [tasks]);

  return {
    tasks: filteredTasks(),
    allTasks: tasks,
    loading,
    filter,
    updateFilter,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    getStats
  };
}
