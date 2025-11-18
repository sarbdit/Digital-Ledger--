
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color, bgColor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${bgColor} ${color}`}>
        <i className={`${icon} text-2xl`}></i>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
