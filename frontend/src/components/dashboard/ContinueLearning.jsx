import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';

const ContinueLearning = ({ data }) => {
  const navigate = useNavigate();

  if (!data) return null;

  const handleContinue = () => {
    navigate(`/learn/${data.topicId}/${data.subtopicId}`);
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100 shadow-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary-600 font-semibold">📚 Continue Learning</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{data.subjectName}</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mt-1">
            {data.topicName}: {data.subtopicName}
          </h3>
          
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">⏱️ {data.estimatedTimeLeft} remaining</span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">📖 Next: {data.nextSubtopic}</span>
          </div>
          
          <div className="mt-3 w-full md:w-80">
            <ProgressBar 
              progress={data.progress} 
              showLabel 
              label="Progress"
              color="primary"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleContinue}
          className="whitespace-nowrap shadow-lg hover:shadow-xl"
        >
          Continue <i className="fas fa-arrow-right ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default ContinueLearning;