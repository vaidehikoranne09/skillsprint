import React from 'react';
import { genderIllustrations } from '../../data/dummyData';

const DynamicIllustration = ({ gender = 'neutral', className = '' }) => {
  const illustration = genderIllustrations[gender] || genderIllustrations.neutral;

  return (
    <img 
      src={illustration} 
      alt={`${gender} learning illustration`}
      className={`w-full h-auto max-w-md ${className}`}
    />
  );
};

export default DynamicIllustration;