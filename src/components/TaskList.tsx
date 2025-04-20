
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import TaskCard from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus, ArrowDown, ArrowUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskListProps {
  onAddTask: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ onAddTask }) => {
  const { tasks, filter, updateFilter, categories, getStats } = useTaskContext();
  const stats = getStats();

  const handleStatusChange = (value: string) => {
    updateFilter({ status: value as 'all' | 'active' | 'completed' });
  };

  const handleCategoryChange = (value: string) => {
    updateFilter({ categoryId: value === 'all' ? undefined : value });
  };

  const handleSortChange = (value: string) => {
    if (value === 'name') {
      updateFilter({ sortBy: 'title', sortDirection: 'asc' });
    } else if (value === 'date-asc') {
      updateFilter({ sortBy: 'dueDate', sortDirection: 'asc' });
    } else if (value === 'date-desc') {
      updateFilter({ sortBy: 'dueDate', sortDirection: 'desc' });
    } else if (value === 'priority') {
      updateFilter({ sortBy: 'priority', sortDirection: 'desc' });
    } else if (value === 'recent') {
      updateFilter({ sortBy: 'createdAt', sortDirection: 'desc' });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter({ searchQuery: e.target.value });
  };

  const toggleSortDirection = () => {
    updateFilter({
      sortDirection: filter.sortDirection === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-1 font-comfortaa text-primary-foreground">Imane's Tasks</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-kawaii-pink"></span>
              <span>{stats.active} active</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-kawaii-mint"></span>
              <span>{stats.completed} completed</span>
            </div>
            {stats.dueToday > 0 && (
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-kawaii-blue"></span>
                <span>{stats.dueToday} today</span>
              </div>
            )}
          </div>
        </div>
        <Button onClick={onAddTask} className="bg-kawaii-pink hover:bg-kawaii-pink/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="rounded-lg bg-white p-4 border border-kawaii-pink/20 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search tasks..."
              onChange={handleSearchChange}
              value={filter.searchQuery || ''}
              className="border-kawaii-lavender/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select onValueChange={handleStatusChange} defaultValue={filter.status}>
              <SelectTrigger className="w-[130px] bg-white border-kawaii-lavender/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={handleCategoryChange} defaultValue={'all'}>
              <SelectTrigger className="w-[130px] bg-white border-kawaii-lavender/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <span
                        className={cn(
                          "mr-2 h-2 w-2 rounded-full",
                          category.color === 'kawaii-pink' ? 'bg-kawaii-pink' :
                          category.color === 'kawaii-lavender' ? 'bg-kawaii-lavender' :
                          category.color === 'kawaii-mint' ? 'bg-kawaii-mint' :
                          category.color === 'kawaii-blue' ? 'bg-kawaii-blue' : 'bg-gray-400'
                        )}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Select onValueChange={handleSortChange} defaultValue="recent">
                <SelectTrigger className="w-[130px] bg-white border-kawaii-lavender/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date-asc">Due Date ↑</SelectItem>
                  <SelectItem value="date-desc">Due Date ↓</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 border-kawaii-lavender/50"
                onClick={toggleSortDirection}
              >
                {filter.sortDirection === 'asc' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="relative">
                <Heart className="h-16 w-16 text-kawaii-pink opacity-30" />
                <Heart className="h-10 w-10 text-kawaii-pink/50 absolute -top-2 -right-2 animate-bounce-slow" />
              </div>
              <p className="text-muted-foreground text-center">
                {filter.searchQuery
                  ? "No tasks match your search."
                  : filter.status === 'completed'
                  ? "No completed tasks yet."
                  : filter.status === 'active'
                  ? "No active tasks. Add your first task!"
                  : "No tasks yet. Add your first task!"}
              </p>
              <Button
                variant="outline"
                onClick={onAddTask}
                className="mt-2 border-kawaii-pink/50 text-primary-foreground"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Your First Task
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
