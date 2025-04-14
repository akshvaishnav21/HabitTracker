import React from 'react';
import { WeeklyProgress as WeeklyProgressType } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { CheckIcon, XIcon } from 'lucide-react';

interface WeeklyProgressProps {
  weeklyProgress: WeeklyProgressType;
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ weeklyProgress }) => {
  // Function to determine the appropriate color for the progress bar
  const getProgressColorClass = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-amber-500";
    return "bg-gray-300";
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between mb-5">
        {weeklyProgress.days.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs font-medium text-gray-600 mb-2">{day.shortName}</div>
            {day.isFuture ? (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-gray-100 text-gray-400 border-2 border-gray-200">
                -
              </div>
            ) : day.completion === 100 ? (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-green-100 text-green-700 border-2 border-green-300">
                <CheckIcon className="h-5 w-5" />
              </div>
            ) : day.completion > 0 ? (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium bg-amber-100 text-amber-700 border-2 border-amber-300">
                {day.completion}%
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-red-100 text-red-700 border-2 border-red-200">
                <XIcon className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>
      <Progress value={weeklyProgress.percentage} className="h-3 mb-2" />
      <div className="text-sm text-gray-600 font-medium text-center">
        <span className="text-green-600 font-bold">{weeklyProgress.percentage}%</span> complete this week
      </div>
    </div>
  );
};

export default WeeklyProgress;
