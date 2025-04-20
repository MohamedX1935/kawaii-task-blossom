
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { Bell, Moon } from "lucide-react";

const EditProfileForm = () => {
  const { toast } = useToast();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = React.useState(true);

  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
    toast({
      title: checked ? "Notifications enabled" : "Notifications disabled",
      description: checked ? "You'll receive task updates" : "You won't receive notifications",
    });
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully",
    });
  };

  return (
    <form onSubmit={handleSaveChanges} className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Display Name</label>
        <Input 
          placeholder="Enter your name" 
          defaultValue="Imane"
          className="w-full max-w-sm" 
        />
      </div>
      
      <div className="flex items-center justify-between py-3 border-b">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span className="text-sm sm:text-base">Notifications</span>
        </div>
        <Switch 
          checked={notifications} 
          onCheckedChange={handleNotificationsChange} 
        />
      </div>

      <div className="flex items-center justify-between py-3 border-b">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4" />
          <span className="text-sm sm:text-base">Dark Mode</span>
        </div>
        <Switch 
          checked={isDarkMode} 
          onCheckedChange={toggleDarkMode}
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        Save Changes
      </Button>
    </form>
  );
};

export default EditProfileForm;
