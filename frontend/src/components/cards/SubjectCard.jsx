import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';

const SubjectCard = ({ subject, onClick }) => {
  const navigate = useNavigate();

    const handleClick = () => {
    // Navigate using the subject ID
    navigate(`/subject/${subject.id}`);
  };

  return (
    <Card 
      hover 
      className="cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white flex-shrink-0"
          style={{ backgroundColor: subject.color || '#7c3aed' }}
        >
          <i className={`fas ${subject.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {subject.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{subject.description}</p>
          <div className="mt-3">
            <ProgressBar 
              progress={subject.progress} 
              showLabel 
              label="Progress"
              color="primary"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SubjectCard;