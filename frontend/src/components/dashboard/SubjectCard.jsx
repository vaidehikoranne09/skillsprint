import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';

const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.stopPropagation();
    navigate(`/subject/${subject.id}`);
  };

  return (
    <Card 
      hover 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${subject.borderColor || 'border-gray-200'}`}
      onClick={() => navigate(`/subject/${subject.id}`)}
    >
      <div className="flex items-start gap-4">
        <div 
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white flex-shrink-0 transition-transform group-hover:scale-110 shadow-md ${subject.bgColor}`}
          style={{ backgroundColor: subject.color || '#7c3aed' }}
        >
          <i className={`fas ${subject.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {subject.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">{subject.description}</p>
            </div>
            <span className={`text-sm font-bold ${subject.textColor}`}>
              {subject.progress}%
            </span>
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{subject.questionsSolved} questions solved</span>
              <span>{subject.totalQuestions} total</span>
            </div>
            <ProgressBar progress={subject.progress} height="h-2.5" showLabel={false} />
          </div>

          <div className="mt-3 flex justify-end">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleContinue}
              className="group-hover:bg-primary-600 group-hover:text-white transition-colors"
            >
              Continue Learning →
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SubjectCard;