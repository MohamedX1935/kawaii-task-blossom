
import React, { useState } from 'react';
import { TaskProvider } from '@/context/TaskContext';
import { useTaskContext } from '@/context/TaskContext';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import CategoryList from '@/components/CategoryList';
import NavigationBar from '@/components/NavigationBar';
import KawaiiMascot from '@/components/KawaiiMascot';
import { Task } from '@/lib/types';

// Main content of the app
const MainContent = () => {
  const { addTask, updateFilter } = useTaskContext();
  const [activeTab, setActiveTab] = useState('home');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = (task: Omit<Task, 'id' | 'createdAt'>) => {
    addTask({ ...task, completed: false });
    setIsTaskFormOpen(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    updateFilter({ categoryId, status: 'all' });
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-kawaii-pink/10">
      <div className="max-w-3xl mx-auto pb-24 px-4">
        <div className="relative pt-6 mb-6">
          <div className="absolute -top-6 right-0 md:right-10 opacity-90 pointer-events-none">
            <KawaiiMascot mood="happy" className="w-20 h-20 md:w-24 md:h-24" />
          </div>
        </div>

        <div className="min-h-[70vh] pb-20">
          {activeTab === 'home' && (
            <TaskList onAddTask={handleAddTask} />
          )}
          
          {activeTab === 'categories' && (
            <CategoryList onSelectCategory={handleCategorySelect} />
          )}
          
          {activeTab === 'calendar' && (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <KawaiiMascot mood="excited" />
              <p className="text-muted-foreground mt-4 text-center">
                Calendar view coming soon!
              </p>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <KawaiiMascot mood="excited" />
              <p className="text-muted-foreground mt-4 text-center">
                Profile features coming soon!
              </p>
            </div>
          )}
        </div>
      </div>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskSubmit}
        task={editingTask}
      />

      <NavigationBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTask={handleAddTask}
      />
    </div>
  );
};

// Main app with context provider
const Index = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-b from-white to-kawaii-pink/10">
        <MainContent />
      </div>
    </TaskProvider>
  );
};

export default Index;
