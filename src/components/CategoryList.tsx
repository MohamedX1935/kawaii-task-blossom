
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Heart, Star, Pen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(1, "Category name is required").max(30),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (category: Omit<Category, "id">) => void;
  category?: Category;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  onSubmit,
  category,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      color: category?.color || "kawaii-pink",
      icon: category?.icon || "heart",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    onClose();
  };

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name || "",
        color: category?.color || "kawaii-pink",
        icon: category?.icon || "heart",
      });
    }
  }, [open, category, form]);

  const colorOptions = [
    { value: "kawaii-pink", label: "Pink", bg: "bg-kawaii-pink" },
    { value: "kawaii-lavender", label: "Lavender", bg: "bg-kawaii-lavender" },
    { value: "kawaii-mint", label: "Mint", bg: "bg-kawaii-mint" },
    { value: "kawaii-blue", label: "Blue", bg: "bg-kawaii-blue" },
  ];

  const iconOptions = [
    { value: "heart", label: "Heart", icon: <Heart className="h-4 w-4" /> },
    { value: "star", label: "Star", icon: <Star className="h-4 w-4" /> },
    { value: "pen", label: "Pen", icon: <Pen className="h-4 w-4" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-comfortaa">
            {category ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <span className={cn("mr-2 h-3 w-3 rounded-full", color.bg)}></span>
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center">
                              {icon.icon}
                              <span className="ml-2">{icon.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-kawaii-pink text-primary-foreground hover:bg-kawaii-pink/90"
              >
                {category ? "Save Changes" : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface CategoryListProps {
  onSelectCategory: (categoryId: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onSelectCategory }) => {
  const { categories, addCategory, deleteCategory, updateCategory, allTasks } = useTaskContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  const handleAddCategory = (category: Omit<Category, "id">) => {
    addCategory(category);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleUpdateCategory = (categoryData: Omit<Category, "id">) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
      setEditingCategory(undefined);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
  };

  const getCategoryTaskCount = (categoryId: string) => {
    return allTasks.filter(task => task.categoryId === categoryId).length;
  };

  const getActiveCategoryTaskCount = (categoryId: string) => {
    return allTasks.filter(task => task.categoryId === categoryId && !task.completed).length;
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'heart':
        return <Heart className="h-5 w-5" />;
      case 'star':
        return <Star className="h-5 w-5" />;
      case 'pen':
        return <Pen className="h-5 w-5" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-comfortaa text-primary-foreground">Categories</h1>
        <Button
          onClick={() => {
            setEditingCategory(undefined);
            setIsDialogOpen(true);
          }}
          className="bg-kawaii-lavender hover:bg-kawaii-lavender/90 text-secondary-foreground"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category) => {
          const totalTasks = getCategoryTaskCount(category.id);
          const activeTasks = getActiveCategoryTaskCount(category.id);
          const progress = totalTasks > 0 ? ((totalTasks - activeTasks) / totalTasks) * 100 : 0;
          
          return (
            <Card
              key={category.id}
              className="kawaii-card hover:scale-[1.02] transition-all cursor-pointer"
              onClick={() => onSelectCategory(category.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        category.color === 'kawaii-pink' ? 'bg-kawaii-pink/20 text-pink-600' :
                        category.color === 'kawaii-lavender' ? 'bg-kawaii-lavender/30 text-purple-600' :
                        category.color === 'kawaii-mint' ? 'bg-kawaii-mint/30 text-green-600' :
                        category.color === 'kawaii-blue' ? 'bg-kawaii-blue/30 text-blue-600' : ''
                      )}
                    >
                      {getIconComponent(category.icon)}
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'} ({activeTasks} active)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCategory(category);
                      }}
                    >
                      <Pen className="h-4 w-4" />
                      <span className="sr-only">Edit category</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete category</span>
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      category.color === 'kawaii-pink' ? 'bg-kawaii-pink' :
                      category.color === 'kawaii-lavender' ? 'bg-kawaii-lavender' :
                      category.color === 'kawaii-mint' ? 'bg-kawaii-mint' :
                      category.color === 'kawaii-blue' ? 'bg-kawaii-blue' : 'bg-gray-400'
                    )}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CategoryDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
        category={editingCategory}
      />
    </div>
  );
};

export default CategoryList;
