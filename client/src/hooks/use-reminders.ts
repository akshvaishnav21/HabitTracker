import { useState, useEffect } from 'react';
import { Habit } from '@/lib/types';
import { loadHabits } from '@/lib/habitStore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Check if the browser supports Notification API
const isNotificationSupported = () => 'Notification' in window;

export const useReminders = () => {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isNotificationSupported()) {
      if (Notification.permission === 'granted') {
        setPermissionGranted(true);
      }
    }
  }, []);

  // Request permission for notifications
  const requestPermission = async () => {
    if (!isNotificationSupported()) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setPermissionGranted(granted);
      
      if (granted) {
        toast({
          title: "Notifications enabled",
          description: "You will now receive reminders for your habits.",
        });
      } else {
        toast({
          title: "Notifications disabled",
          description: "You won't receive reminders for your habits.",
          variant: "destructive",
        });
      }
      
      return granted;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request notification permission.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Send a notification
  const sendNotification = (title: string, body: string) => {
    if (!isNotificationSupported() || !permissionGranted) {
      return;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico', // Use app favicon
      });

      // Close the notification after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return {
    isNotificationSupported,
    permissionGranted,
    requestPermission,
    sendNotification,
  };
};

// Initialize reminder system
export const initializeReminderSystem = () => {
  // Check for reminders every minute
  const checkInterval = 60 * 1000; // 1 minute
  
  // Format current time to HH:MM format for comparison
  const getCurrentTimeString = () => {
    const now = new Date();
    return format(now, 'HH:mm');
  };
  
  // Check for habits that need reminders
  const checkReminders = () => {
    const currentTime = getCurrentTimeString();
    const habits = loadHabits();
    
    habits.forEach(habit => {
      if (habit.reminderEnabled && habit.reminderTime === currentTime) {
        // Send notification for this habit
        if (Notification.permission === 'granted') {
          new Notification('Habit Reminder', {
            body: `Time to complete your habit: ${habit.title}`,
            icon: '/favicon.ico',
          });
        }
      }
    });
  };
  
  // Set up interval to check reminders
  const intervalId = setInterval(checkReminders, checkInterval);
  
  // Initial check
  checkReminders();
  
  // Clean up function
  return () => {
    clearInterval(intervalId);
  };
};