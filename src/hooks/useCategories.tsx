
import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/lib/types';
import { 
  loadCategories, 
  saveCategories, 
  addCategory as addCategoryToStorage,
  generateId
} from '@/lib/taskStorage';
import { toast } from "@/components/ui/use-toast";
import { useToast as useSonnerToast } from "@/components/ui/sonner";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast: sonnerToast } = useSonnerToast();

  // Load categories on mount
  useEffect(() => {
    try {
      const loadedCategories = loadCategories();
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast({
        title: "Error loading categories",
        description: "Your categories couldn't be loaded. Please try refreshing the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new category
  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    try {
      const newCategory = addCategoryToStorage(category);
      setCategories(prev => [...prev, newCategory]);
      
      sonnerToast("Category added", {
        description: `"${category.name}" has been added`,
      });
      
      return newCategory;
    } catch (error) {
      console.error('Failed to add category:', error);
      toast({
        title: "Failed to add category",
        description: "Your category couldn't be saved. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [sonnerToast]);

  // Update a category
  const updateCategory = useCallback((categoryId: string, updates: Partial<Category>) => {
    try {
      const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
      
      if (categoryIndex === -1) {
        toast({
          title: "Category not found",
          description: "The category you're trying to update doesn't exist.",
          variant: "destructive"
        });
        return false;
      }
      
      const updatedCategory = { ...categories[categoryIndex], ...updates };
      const updatedCategories = [...categories];
      updatedCategories[categoryIndex] = updatedCategory;
      
      saveCategories(updatedCategories);
      setCategories(updatedCategories);
      
      sonnerToast("Category updated", {
        description: `"${updatedCategory.name}" has been updated`,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to update category:', error);
      toast({
        title: "Failed to update category",
        description: "Your category couldn't be updated. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [categories, sonnerToast]);

  // Delete a category
  const deleteCategory = useCallback((categoryId: string) => {
    try {
      const category = categories.find(cat => cat.id === categoryId);
      
      if (!category) {
        toast({
          title: "Category not found",
          description: "The category you're trying to delete doesn't exist.",
          variant: "destructive"
        });
        return false;
      }
      
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      saveCategories(updatedCategories);
      setCategories(updatedCategories);
      
      sonnerToast("Category deleted", {
        description: `"${category.name}" has been removed`,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast({
        title: "Failed to delete category",
        description: "Your category couldn't be deleted. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [categories, sonnerToast]);

  // Get a category by ID
  const getCategoryById = useCallback((categoryId: string | undefined) => {
    if (!categoryId) return null;
    return categories.find(cat => cat.id === categoryId) || null;
  }, [categories]);

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
  };
}
