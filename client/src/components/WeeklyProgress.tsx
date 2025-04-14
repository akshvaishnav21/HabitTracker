import React from 'react';
import { WeeklyProgress as WeeklyProgressType } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface WeeklyProgressProps {
  weeklyProgress: WeeklyProgressType;
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ weeklyProgress }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between mb-3">
        {weeklyProgress.days.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-500 mb-1">{day.shortName}</div>
            {day.isFuture ? (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-gray-100 text-gray-400 ring-2 ring-gray-200">
                -
              </div>
            ) : day.completion === 100 ? (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-green-100 text-green-800">
                ✓
              </div>
            ) : day.completion > 0 ? (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-amber-100 text-amber-800">
                {day.completion}%
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-gray-100 text-gray-800">
                0%
              </div>
            )}
          </div>
        ))}
      </div>
      <Progress value={weeklyProgress.percentage} className="h-2" />
      <div className="text-sm text-gray-500 mt-2 text-center">
        <span className="font-medium text-green-600">{weeklyProgress.percentage}%</span> complete this week
      </div>
    </div>
  );
};

export default WeeklyProgress;
