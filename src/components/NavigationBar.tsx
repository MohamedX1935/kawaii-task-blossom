
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Home, Calendar, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddTask: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  onTabChange,
  onAddTask
}) => {
  const { getStats } = useTaskContext();
  const stats = getStats();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-kawaii-pink/20 shadow-lg py-2 px-4 z-50">
      <div className="max-w-3xl mx-auto flex items-center justify-around">
        <Button
          variant="ghost"
          className={cn(
            "flex flex-col h-14 w-14 rounded-full items-center justify-center gap-1",
            activeTab === 'home' && "bg-kawaii-pink/20 text-primary-foreground"
          )}
          onClick={() => onTabChange('home')}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px]">Home</span>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            "flex flex-col h-14 w-14 rounded-full items-center justify-center gap-1",
            activeTab === 'categories' && "bg-kawaii-lavender/30 text-secondary-foreground"
          )}
          onClick={() => onTabChange('categories')}
        >
          <div className="relative">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <rect x="4" y="4" width="6" height="6" rx="1" />
              <rect x="14" y="4" width="6" height="6" rx="1" />
              <rect x="4" y="14" width="6" height="6" rx="1" />
              <rect x="14" y="14" width="6" height="6" rx="1" />
            </svg>
          </div>
          <span className="text-[10px]">Categories</span>
        </Button>
        
        <div className="relative -mt-8">
          <Button
            className="h-14 w-14 rounded-full bg-kawaii-pink hover:bg-kawaii-pink/90 text-white shadow-lg"
            onClick={onAddTask}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          className={cn(
            "flex flex-col h-14 w-14 rounded-full items-center justify-center gap-1",
            activeTab === 'calendar' && "bg-kawaii-mint/30 text-accent-foreground"
          )}
          onClick={() => onTabChange('calendar')}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px]">Calendar</span>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            "flex flex-col h-14 w-14 rounded-full items-center justify-center gap-1",
            activeTab === 'profile' && "bg-kawaii-blue/30 text-blue-700"
          )}
          onClick={() => onTabChange('profile')}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px]">Profile</span>
        </Button>
      </div>
    </div>
  );
};

export default NavigationBar;
