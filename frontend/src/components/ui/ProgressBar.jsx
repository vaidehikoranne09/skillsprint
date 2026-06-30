import React from 'react';

const ProgressBar = ({ 
  progress, 
  color = 'primary',
  showLabel = true,
  label = '',
  className = '',
  height = 'h-2.5'
}) => {
  const colors = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-600">{label || `${Math.round(progress)}%`}</span>
          <span className="text-gray-700 font-semibold">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${colors[color]} transition-all duration-500 ease-out rounded-full ${height}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;