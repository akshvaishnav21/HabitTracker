import React from 'react';
import { IconType } from 'react-icons';
import { CheckCircle, TrendingUp, Calendar, BarChart2 } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  icon?: 'habits' | 'progress' | 'streak' | 'completion';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, suffix, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'habits':
        return <Calendar className="h-4 w-4 text-primary" />;
      case 'progress':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'streak':
        return <TrendingUp className="h-4 w-4 text-amber-500" />;
      case 'completion':
        return <BarChart2 className="h-4 w-4 text-indigo-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
        {getIcon()}
      </div>
      <div className="flex items-baseline mt-2">
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        {suffix && (
          <div className="text-sm text-gray-500 ml-2">{suffix}</div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
