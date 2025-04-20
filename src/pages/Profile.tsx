
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Avatar } from '@/components/ui/avatar';
import { User, Calendar, CheckCircle, Star, BarChart } from 'lucide-react';
import KawaiiMascot from '@/components/KawaiiMascot';
import EditProfileForm from '@/components/EditProfileForm';

const ProfilePage = () => {
  const { getStats } = useTaskContext();
  const stats = getStats();
  
  // Calculate task completion rate
  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;
  
  // Mock user data (would come from a real auth system in a production app)
  const user = {
    name: "Imane",
    joinedDate: "April 2025",
    avatar: null, // No avatar image for now
    preferences: {
      darkMode: false,
      notifications: true,
      backupFrequency: 'daily'
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-comfortaa text-primary-foreground">My Profile</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-kawaii-pink/20">
        <h2 className="text-lg font-medium mb-6">Edit Profile</h2>
        <EditProfileForm />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-kawaii-pink/20">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <BarChart className="h-5 w-5 text-kawaii-pink" />
          Task Statistics
        </h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Completion Rate</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <Slider 
              value={[completionRate]} 
              max={100} 
              step={1}
              disabled 
              className="[&>.absolute]:bg-kawaii-pink" 
            />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="bg-kawaii-pink/10 p-3 rounded-md text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </div>
            <div className="bg-kawaii-lavender/10 p-3 rounded-md text-center">
              <p className="text-2xl font-bold">{stats.overdue}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
            <div className="bg-kawaii-mint/10 p-3 rounded-md text-center">
              <p className="text-2xl font-bold">{stats.dueToday}</p>
              <p className="text-xs text-muted-foreground">Due Today</p>
            </div>
            <div className="bg-kawaii-blue/10 p-3 rounded-md text-center">
              <p className="text-2xl font-bold">{stats.highPriority}</p>
              <p className="text-xs text-muted-foreground">High Priority</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-kawaii-pink/20">
        <h2 className="text-lg font-medium mb-4">App Settings</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span>Dark Mode</span>
            <Button variant="outline" size="sm">Coming Soon</Button>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b">
            <span>Notifications</span>
            <Button variant="outline" size="sm">Coming Soon</Button>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b">
            <span>Data Backup</span>
            <Button variant="outline" size="sm">Coming Soon</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
