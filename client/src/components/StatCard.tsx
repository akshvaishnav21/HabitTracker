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
  const getIconAndColor = () => {
    switch (icon) {
      case 'habits':
        return { 
          icon: <Calendar className="h-5 w-5 text-white" />,
          bgColor: 'bg-primary' // Blue
        };
      case 'progress':
        return { 
          icon: <CheckCircle className="h-5 w-5 text-white" />,
          bgColor: 'bg-[#00C853]' // Green
        };
      case 'streak':
        return { 
          icon: <TrendingUp className="h-5 w-5 text-white" />,
          bgColor: 'bg-[#FF9800]' // Orange
        };
      case 'completion':
        return { 
          icon: <BarChart2 className="h-5 w-5 text-white" />,
          bgColor: 'bg-[#9C27B0]' // Purple
        };
      default:
        return { 
          icon: null,
          bgColor: 'bg-white'
        };
    }
  };

  const { icon: iconElement, bgColor } = getIconAndColor();

  return (
    <div className={`p-5 rounded-lg shadow-sm ${bgColor} text-white hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium mb-1">{title}</div>
        {iconElement}
      </div>
      <div className="flex items-baseline mt-2">
        <div className="text-2xl font-bold">{value}</div>
        {suffix && (
          <div className="text-sm text-white/80 ml-2">{suffix}</div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
