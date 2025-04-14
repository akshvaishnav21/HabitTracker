import React from 'react';
import { Link } from 'wouter';
import { PlusIcon } from 'lucide-react';

const AddHabitButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Link href="/habits/new">
        <div className="w-14 h-14 rounded-full bg-gradient-primary hover:bg-gradient-to-br hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary pulse-border cursor-pointer transform transition-transform hover:scale-110">
          <PlusIcon className="h-7 w-7" />
        </div>
      </Link>
    </div>
  );
};

export default AddHabitButton;
