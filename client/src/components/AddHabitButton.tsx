import React from 'react';
import { Link } from 'wouter';
import { PlusIcon } from 'lucide-react';

const AddHabitButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Link href="/habits/new">
        <a className="w-14 h-14 rounded-full bg-primary hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary pulse-light">
          <PlusIcon className="h-7 w-7" />
        </a>
      </Link>
    </div>
  );
};

export default AddHabitButton;
