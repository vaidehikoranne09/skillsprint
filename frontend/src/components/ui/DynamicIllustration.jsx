import React from 'react';

const DynamicIllustration = ({ gender = 'neutral', className = '' }) => {
  // Use emoji fallbacks if images don't load
  const illustrations = {
    female: '👩‍🎓',
    male: '👨‍🎓',
    neutral: '🧑‍🎓'
  };

  const getIllustration = () => {
    switch(gender) {
      case 'female':
        return illustrations.female;
      case 'male':
        return illustrations.male;
      default:
        return illustrations.neutral;
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="text-8xl">{getIllustration()}</span>
    </div>
  );
};

export default DynamicIllustration;