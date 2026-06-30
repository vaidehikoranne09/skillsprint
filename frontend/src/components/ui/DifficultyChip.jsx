import React from 'react';

const DifficultyChip = ({ difficulty, size = 'md' }) => {
  const variants = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
    Mixed: 'bg-purple-100 text-purple-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${variants[difficulty] || variants.Easy}
      ${sizes[size]}
    `}>
      {difficulty}
    </span>
  );
};

export default DifficultyChip;