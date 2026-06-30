import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = true,
  ...props 
}) => {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100
        ${padding ? 'p-6' : ''}
        ${hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;