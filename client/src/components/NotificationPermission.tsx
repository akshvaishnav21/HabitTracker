import { useReminders } from "@/hooks/use-reminders";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useState } from "react";

const NotificationPermission = () => {
  const { isNotificationSupported, permissionGranted, requestPermission } = useReminders();
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Don't show anything if notifications are not supported, already granted, 
  // or the user has dismissed the prompt
  if (!isNotificationSupported() || permissionGranted || (Notification.permission === 'denied') || hasInteracted) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-80 bg-white p-4 rounded-lg shadow-lg border-2 border-primary z-50 animate-in slide-in-from-bottom-5 pulse-border">
      <div className="flex items-start space-x-3">
        <div className="bg-gradient-primary p-2 rounded-full">
          <Bell className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm">Enable Reminders</h3>
          <p className="text-xs text-gray-500 mt-1">
            Allow notifications to receive reminders for your habits!
          </p>
          <div className="mt-3 flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={async () => {
                await requestPermission();
                setHasInteracted(true);
              }}
              className="text-xs bg-gradient-primary btn-hover-glow hover:text-white"
            >
              Enable Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHasInteracted(true)}
              className="text-xs"
            >
              No thanks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermission;