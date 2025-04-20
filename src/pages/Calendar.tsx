
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/context/TaskContext';
import { Task } from '@/lib/types';
import KawaiiMascot from '@/components/KawaiiMascot';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { allTasks } = useTaskContext();
  
  // Get tasks for the selected date
  const getTasksForDate = (date: Date | undefined): Task[] => {
    if (!date) return [];
    
    return allTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  const tasksForSelectedDate = selectedDate ? getTasksForDate(selectedDate) : [];
  
  // Navigate to previous or next month
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };
  
  // Function to get task count for a specific day
  const getDayTaskCount = (day: Date): number => {
    return getTasksForDate(day).length;
  };
  
  // Custom day renderer
  const renderDay = (day: Date) => {
    const taskCount = getDayTaskCount(day);
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {day.getDate()}
        {taskCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-kawaii-pink text-[10px] text-white">
            {taskCount > 9 ? '9+' : taskCount}
          </span>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-comfortaa text-primary-foreground">My Calendar</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 border-kawaii-lavender/50"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-sm">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 border-kawaii-lavender/50"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-kawaii-pink/20">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="w-full"
          components={{
            Day: ({ date, ...props }) => (
              <Button {...props}>
                {renderDay(date)}
              </Button>
            ),
          }}
        />
      </div>
      
      {selectedDate && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-kawaii-pink/20">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-kawaii-pink" />
            Tasks for {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          
          {tasksForSelectedDate.length > 0 ? (
            <div className="space-y-2">
              {tasksForSelectedDate.map(task => (
                <div 
                  key={task.id} 
                  className={`p-3 rounded-md border ${
                    task.completed ? 'border-kawaii-mint bg-kawaii-mint/10' : 'border-kawaii-pink/30 bg-kawaii-pink/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-2 ${
                        task.priority === 'high' ? 'bg-red-500' :
                        task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                      }`}></span>
                      <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                        {task.title}
                      </span>
                    </div>
                    <span className={`text-xs ${task.completed ? 'text-kawaii-mint' : 'text-kawaii-pink'}`}>
                      {task.completed ? 'Completed' : 'Active'}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1 ml-4">
                      {task.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 space-y-3 text-center">
              <KawaiiMascot mood="happy" className="w-16 h-16" />
              <p className="text-muted-foreground">
                No tasks scheduled for this day
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
