import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import DifficultyChip from '../ui/DifficultyChip';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';

const TopicCard = ({ topic, subjectId, subjectName }) => {
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // CRITICAL FIX: Use topic name instead of ID
    // This ensures each subject uses its own topics
    const topicName = topic.name;
    const encodedSubject = encodeURIComponent(subjectName || '');
    const encodedTopic = encodeURIComponent(topicName);
    
    console.log('🎯 TopicCard clicked:', { 
      topicName, 
      subjectName, 
      topicId: topic.id 
    });
    
    // Navigate using topic NAME instead of ID
    navigate(`/learn/${encodedTopic}?subject=${encodedSubject}`);
  };

  return (
    <Card hover className="flex flex-col h-full border border-gray-200 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{topic.icon || '📚'}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{topic.description}</p>
          </div>
        </div>
        <DifficultyChip difficulty={topic.difficulty || 'Medium'} />
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {topic.completedQuestions || 0}/{topic.totalQuestions || 0} questions
          </span>
          <span className="font-semibold text-primary-600">
            {Math.round(topic.progress || 0)}%
          </span>
        </div>
        <ProgressBar progress={topic.progress || 0} height="h-2" showLabel={false} />
        
        <div className="flex items-center justify-between pt-2">
          <Badge variant="gray">{topic.totalQuestions || 0} Questions</Badge>
          <Button 
            size="sm" 
            onClick={handleStart}
            className="cursor-pointer"
          >
            {topic.progress > 0 ? 'Continue' : 'Start'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TopicCard;