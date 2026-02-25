'use client';

import React from 'react';
import { FileText, Briefcase, Bot, TrendingUp } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700'
};

export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  count, 
  icon, 
  color, 
  trend 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">Total items</p>
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center space-x-1">
            <TrendingUp 
              className={`w-4 h-4 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
            />
            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold text-gray-900">{count}</div>
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          View all →
        </button>
      </div>
    </div>
  );
};
