import React from 'react';
import Card from '../ui/Card';

const StatCard = ({ 
  icon, 
  title, 
  value, 
  subtitle = '', 
  color = 'primary',
  trend = null 
}) => {
  const colors = {
    primary: 'bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600',
    green: 'bg-gradient-to-br from-green-50 to-green-100 text-green-600',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600',
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600',
    red: 'bg-gradient-to-br from-red-50 to-red-100 text-red-600',
  };

  return (
    <Card className="text-center hover:shadow-lg transition-shadow duration-300">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${colors[color]} shadow-sm`}>
        <i className={`fas ${icon} text-2xl`} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mt-3">{value}</h3>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      {trend !== null && trend !== undefined && (
        <div className={`text-sm mt-2 font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
        </div>
      )}
    </Card>
  );
};

export default StatCard;