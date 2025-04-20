
import React from 'react';
import { cn } from '@/lib/utils';
import { Task } from '@/lib/types';
import { useTaskContext } from '@/context/TaskContext';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, Heart } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, className }) => {
  const { toggleTaskCompletion, deleteTask, getCategoryById } = useTaskContext();

  const category = getCategoryById(task.categoryId);
  
  const priorityClasses = {
    low: 'text-green-400',
    medium: 'text-amber-400',
    high: 'text-red-400'
  };
  
  const prioritySize = {
    low: 'w-4 h-4',
    medium: 'w-5 h-5', 
    high: 'w-6 h-6'
  };

  const handleToggle = () => {
    toggleTaskCompletion(task.id);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate.getTime() === today.getTime()) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return `Tomorrow, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <Card className={cn('kawaii-card group animate-fade-in', 
      task.completed && 'opacity-75', 
      className
    )}>
      <CardContent className="p-4 flex items-start gap-3">
        <div 
          className="mt-0.5 flex-shrink-0"
          style={{ color: category?.color === 'kawaii-pink' ? '#FFD1DC' : 
                         category?.color === 'kawaii-lavender' ? '#E6E6FA' :
                         category?.color === 'kawaii-mint' ? '#C5E8C5' :
                         category?.color === 'kawaii-blue' ? '#ADD8E6' : undefined }}
        >
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={handleToggle}
            className="heart-checkbox"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium leading-tight mb-1",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-muted-foreground line-clamp-2 mb-2",
                  task.completed && "line-through"
                )}>
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {category && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full",
                    category.color === 'kawaii-pink' ? 'bg-kawaii-pink/20 text-primary-foreground' :
                    category.color === 'kawaii-lavender' ? 'bg-kawaii-lavender/30 text-secondary-foreground' :
                    category.color === 'kawaii-mint' ? 'bg-kawaii-mint/30 text-accent-foreground' :
                    category.color === 'kawaii-blue' ? 'bg-kawaii-blue/30 text-blue-700' : ''
                  )}>
                    {category.name}
                  </span>
                )}
                
                {task.dueDate && (
                  <span className={cn(
                    "flex items-center gap-1",
                    isOverdue ? "text-destructive" : "text-muted-foreground"
                  )}>
                    <Clock className="w-3 h-3" />
                    {formatDate(task.dueDate)}
                    {isOverdue && " (Overdue)"}
                  </span>
                )}
                
                <span className="flex items-center gap-0.5">
                  <Heart className={cn("fill-current", priorityClasses[task.priority], prioritySize[task.priority])} />
                </span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete task</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
