import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DifficultyChip from '../ui/DifficultyChip';
import ProgressBar from '../ui/ProgressBar';

const ConceptCard = ({ concept, onStartPractice }) => {
  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{concept.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{concept.description}</p>
        </div>
        <DifficultyChip difficulty={concept.difficulty} />
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{concept.questionCount} questions</span>
          <span className="font-semibold text-primary-600">{Math.round(concept.progress)}%</span>
        </div>
        <ProgressBar progress={concept.progress} height="h-2" showLabel={false} />
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-400">⏱️ {concept.timeEstimate}</span>
          <Button 
            size="sm" 
            onClick={() => onStartPractice(concept.id)}
          >
            {concept.progress > 0 ? 'Continue' : 'Start Practice'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ConceptCard;