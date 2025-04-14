import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckIcon, CalendarIcon, Boxes } from "lucide-react";

interface IntroductionModalProps {
  onClose: () => void;
}

const IntroductionModal: React.FC<IntroductionModalProps> = ({ onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl">Welcome to HabitTrack</DialogTitle>
          <DialogDescription>
            Your simple, private habit tracker that works right in your browser.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-3">
              <CheckIcon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">100% Private</h4>
              <p className="text-sm text-gray-600">All your data stays on your device. No accounts, no tracking.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Simple Tracking</h4>
              <p className="text-sm text-gray-600">One tap to mark habits complete. See your streaks and progress.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3">
              <Boxes className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Works Offline</h4>
              <p className="text-sm text-gray-600">Use HabitTrack anytime, even without an internet connection.</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntroductionModal;
