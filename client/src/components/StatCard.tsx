import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, suffix }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="flex items-end">
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        {suffix && (
          <div className="text-sm text-gray-500 ml-2 mb-1">{suffix}</div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
